import React, { useEffect } from 'react';
import NavBar from './NavBar';
import ArticleList from './ArticleList';
import Article from './Article';
import Login from './Login';
import { observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import { refreshToken } from './services/silent-refresh';
import Write from './Write';
import SignUp from './SignUp';
import EmailVerify from './EmailVerify';
import axios from 'axios';
import { errorHandler } from './services/error-handler';
import { runPushWorker } from './services/push';

axios.interceptors.response.use(
	(response) => {
		errorHandler(response.data.data);
		return response;
	},
	(error) => {
		errorHandler(error.response.data.data);
		return error.response.data;
	}
);

function App({ boardStore }) {
	useEffect(() => {
		(async () => {
			if (localStorage.getItem('isLogined')) {
				const result = await refreshToken();
				if (!result) return localStorage.setItem('isLogined', '');
				boardStore.setIsLogined(true);
				boardStore.setUserId(localStorage.getItem('userId'));
                //alert(localStorage.getItem('isSubscriptionSent'))
                if (!localStorage.getItem('isSubscriptionSent')) await runPushWorker();
			}
		})();
	}, [boardStore]);
	return (
		<>
			<NavBar setUserId={boardStore.setUserId} setIsLogined={boardStore.setIsLogined} isLogined={boardStore.isLogined} />
			<Route path="/" component={ArticleList} exact />
			<Route path="/article/:articleId" render={() => <Article userId={boardStore.userId} />} exact />
			<Route path="/login" render={() => <Login setUserId={boardStore.setUserId} setIsLogined={boardStore.setIsLogined} isLogined={boardStore.isLogined} />} exact />
			<Route path="/write" render={() => <Write state={{ isModify: false, article: '' }} />} exact />
			<Route path="/signup" component={SignUp} exact />
			<Route path="/email-verify/:token" component={EmailVerify} exact />
		</>
	);
}

export default observer(App);
