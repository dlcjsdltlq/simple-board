import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import Comment from './Comment';
import { formatFullDate } from './services/date-format';
import { error } from './constants/error';
import { errorHandler } from './services/error-handler';

function Article({ userId }) {
	const [article, setArticle] = useState({});
	const { articleId } = useParams();
	const history = useHistory();
	useEffect(() => {
		axios.get(`http://localhost:3001/api/article/view/${articleId}`).then((response) => {
			const article = response.data.data;
            errorHandler(response.data.data);
			if (response.status === 404) history.goBack();
			setArticle(article);
		});
	}, [articleId, userId, history]);

	const onDeleteClick = async () => {
		if (userId !== article.userId) return alert('작성자가 아닙니다.');
		if (!window.confirm('글을 삭제하시겠습니까?')) return;
		const response = await axios.post(`http://localhost:3001/api/article/delete`, {
			articleId,
		});
        errorHandler(response.data.data);
		history.push({
			pathname: '/',
		});
	};

	const onVoteClick = async (e) => {
		const formData = {
			articleId,
			voteType: e.target.name
		};
		const response = await axios.post('http://localhost:3001/api/article/vote', formData);
        errorHandler(response.data.data);
		setArticle({
			...article,
			...response.data.data,
		});
        
	};

	const onModifyClick = () => {
		if (userId !== article.userId) return alert('작성자가 아닙니다.');
		history.push({
			pathname: '/write',
			state: {
				article,
			},
		});
	};

	return (
		<div className="container m-auto is-max-desktop">
			<div className="block">
				<h2 className="title is-2">{article.subject}</h2>
				<div className="article-item level">
					<div className="article-writer level-left mb-1">{article.userName}</div>
					<span className="article-info level-right mb-1">
						<span className="article-date">{formatFullDate(article.date)}</span>
						<span className="m-1 is-size-7">|</span>
						<span className="article-comment">댓글 수 {article.commentIndex}</span>
						<span className="m-1 is-size-7">|</span>
						<span className="article-recommend">추천수 {article.upVote}</span>
						<span className="m-1 is-size-7">|</span>
						<span className="article-views">조회수 {article.viewCounts}</span>
					</span>
				</div>
			</div>
			<hr />
			<div className="content" dangerouslySetInnerHTML={{ __html: article.text }}></div>
			<div className="buttons is-centered">
				<button className="button is-info is-light is-size-5 has-text-weight-bold" name="u" onClick={onVoteClick}>
					추천 {article.upVote}
				</button>
				<button className="button is-danger is-light is-size-5 has-text-weight-bold" name="d" onClick={onVoteClick}>
					비추천 {article.downVote}
				</button>
			</div>
			<div className="buttons is-centered">
				<button className="button" onClick={() => window.history.back()}>
					돌아가기
				</button>
				<button className="button" onClick={onModifyClick}>
					수정
				</button>
				<button className="button" onClick={onDeleteClick}>
					삭제
				</button>
			</div>
			<div className="comment-box">
				<div className="is-size-4 has-text-weight-bold mb-3">댓글</div>
				<hr />
				<Comment userId={userId} articleId={article.articleId} />
			</div>
		</div>
	);
}

export default Article;
