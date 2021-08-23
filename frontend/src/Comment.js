import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { error } from './constants/error';
import { formatFullDate } from './services/date-format';
import { errorHandler } from './services/error-handler';

function CommentWrite({ articleId, depth, targetIndex, getComment, setClickedComment }) {
	const [comment, setComment] = useState('');

	const onCommentChange = (e) => {
		setComment(e.target.value);
	};

	const onCommentSubmit = async () => {
		if (!comment) return;
		const formData = {
			articleId,
			text: comment,
			depth,
			targetIndex,
		};
		const response = await axios.post('http://localhost:3001/api/comment/write', formData);
        errorHandler(response.data.data);
		getComment();
		setComment('');
        setClickedComment('');
	};

	return (
		<div className={depth === 0 ? '' : 'ml-5'}>
			<div className="block">
				<textarea className="textarea" placeholder="댓글 작성" onChange={onCommentChange} onKeyDown={e => e.key === 'Enter' && onCommentSubmit()} value={comment}></textarea>
			</div>
			<div className="block">
				<button className="button is-fullwidth is-primary" onClick={onCommentSubmit}>
					작성
				</button>
			</div>
		</div>
	);
}

function Comment({ userId, articleId }) {
	const [commentList, setCommentList] = useState([]);
	const [clickedComment, setClickedComment] = useState('');

	const getComment = () => {
		if (!articleId) return;
		axios
			.post('http://localhost:3001/api/comment/view', {
				articleId,
				start: 0,
				end: 100,
			})
			.then((response) => {
                errorHandler(response.data.data);
				const comments = response.data.data;
				setCommentList(comments);
			});
	};

	useEffect(getComment, [articleId]);

	const onDeleteClick = async (e) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
		const response = await axios.post('http://localhost:3001/api/comment/delete', {
			articleId,
			commentIndex: e.target.name,
		});
        errorHandler(response.data.data);
		getComment();
	};

	const toggleClickState = (idx) => {
		if (idx === clickedComment) {
			setClickedComment('');
		} else {
			setClickedComment(idx);
		}
	};

	return (
		<>
			<div className="block">
				{commentList.map((data, index) => {
					return (
						<div className="block" key={data.commentIndex}>
							<div className={'media ' + (data.depth === 0 ? '' : 'ml-5')} style={{ cursor: 'pointer' }} onClick={data.depth ===0 ? () => toggleClickState(data.commentIndex) : ()=>{}}>
								<div className="media-content">
									<div className="content">
										<div>
											<div style={{ width: '50%', display: 'inline-block' }}>
												<b>{data.userName}</b>
												<small className="ml-3">{formatFullDate(data.date)}</small>
											</div>
											<div style={{ width: '50%', textAlign: 'right', display: 'inline-block' }}>
												<button name={data.commentIndex} className="delete" onClick={onDeleteClick}></button>
											</div>
										</div>
										{data.text}
									</div>
								</div>
							</div>
							{clickedComment === data.commentIndex ? <CommentWrite articleId={articleId} depth={1} targetIndex={data.commentIndex} setCommentList={setCommentList} getComment={getComment} setClickedComment={setClickedComment} /> : ''}
						</div>
					);
				})}
			</div>
			<CommentWrite articleId={articleId} depth={0} targetIndex={null} setCommentList={setCommentList} getComment={getComment} setClickedComment={setClickedComment} />
		</>
	);
}

export default Comment;
