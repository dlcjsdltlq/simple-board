import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all.js';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { errorHandler } from './services/error-handler';

function Write() {
	const { state } = useLocation();

	const history = useHistory();

	const [data, setData] = useState({
		subject: '',
		text: '',
	});

	const editorRef = useRef();

	useEffect(() => {
		if (state) {
			setData(() => ({
				subject: state.article.subject,
				text: state.article.text,
			}));
		}
	}, [state]);

	const onTextChange = () => {
		setData({
			...data,
			text: editorRef.current.getInstance().getHTML(),
		});
	};

	const onSubjectChange = (e) => {
		setData({
			...data,
			subject: e.target.value,
		});
	};

	const onClick = async () => {
        if (!data.subject.trim() || !data.text.trim()) return alert('제목이나 내용을 입력해 주세요.');
		if (state) {
			const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/article/modify`, {
				...data,
				articleId: state.article.articleId,
			});
            errorHandler(response.data.data);
		} else {
			const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/article/write`, data);
            errorHandler(response.data.data);
		}
		history.push({
			pathname: '/',
		});
	};

	const uploadImage = async (blob) => {
		const formData = new FormData();
		formData.append('file', blob);
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/file/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
        errorHandler(response.data.data);
		if (!response.status) {
			console.log(response.data.data);
			return false;
		}
		return `${process.env.REACT_APP_REQUEST_URL}/api/file/` + response.data.data;
	};

	return (
		<div className="container m-auto is-max-desktop">
			<div className="block">
				<input className="input" type="text" placeholder="제목" defaultValue={state ? state.article.subject : ''} onChange={onSubjectChange} />
			</div>
			<div className="block">
				<Editor
					initialValue={state ? state.article.text : ''}
					previewStyle="vertical"
					height="700px"
					initialEditType="wysiwyg"
					ref={editorRef}
					onChange={onTextChange}
					hooks={{
						addImageBlobHook: async (blob, callback) => {
							const url = await uploadImage(blob);
							callback(url, 'alt text');
							return false;
						},
					}}
                    plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
				/>
			</div>
			<div className="block">
				<button className="button is-fullwidth is-primary" onClick={onClick}>
					작성
				</button>
			</div>
		</div>
	);
}

export default Write;
