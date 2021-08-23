import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.min.css';
import './ArticleList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { dateFormat } from './services/date-format';
import { error } from './constants/error';
import { errorHandler } from './services/error-handler';

function ArticleList() {
	const [articleList, setArticleList] = useState([]);
	useEffect(() => {
		axios.get(`http://localhost:3001/api/article/getlist?start=1&end=100`).then((response) => {
            errorHandler(response.data.data);
			setArticleList(response.data.data);
		});
	}, []);
	return (
		<div className="container m-auto is-max-desktop">
			<table className="article-table">
				<thead>
					<tr>
						<th className="h-article-id">글 번호</th>
						<th className="h-article-title">제목</th>
						<th className="h-article-writer">작성자</th>
						<th className="h-article-date">작성 시간</th>
						<th className="h-article-views">조회수</th>
					</tr>
				</thead>
				<tbody className="article-list">
					{articleList.map((data, index) => {
						return (
							<tr key={data.articleId}>
								<td className="article-id">{data.articleId}</td>
								<td className="article-title">
									<Link to={`/article/${data.articleId}`}>{data.subject}</Link>
								</td>
								<td className="article-writer">{data.userName}</td>
								<td className="article-date">{dateFormat(data.date)}</td>
								<td className="article-views">{data.viewCounts}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

export default ArticleList;
