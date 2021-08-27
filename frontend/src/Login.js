import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { error } from './constants/error';
import { errorHandler } from './services/error-handler';
import { refreshToken } from './services/silent-refresh';

function Login({ setUserId, setIsLogined, isLogined }) {
	const [formData, setFormData] = useState({});
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onClick = async () => {
		const response = await axios.post(`${process.env.REACT_APP_REQUEST_URL}/api/user/login`, formData, {
            withCredentials: true
        });
        errorHandler(response.data.data);
        console.log(response.data);
        if (response.data.data === 'ERR_EMAIL_NOT_VERIFIED') {
            alert('이메일 인증 후 이용해주세요.');
            return;
        }
		if (!response.data.status) {
			alert('로그인에 실패하였습니다.');
			return;
		}
		const expires = new Date(response.data.data.expires) - new Date();
        console.log(expires);
		const token = response.data.data.token;
		axios.defaults.headers.common['Authorization'] = token;
		setTimeout(refreshToken, expires);
		setIsLogined(true);
		setUserId(formData.userId);
        localStorage.setItem('isLogined', true);
        localStorage.setItem('userId', formData.userId);
	};

    if (isLogined) return <Redirect to="/"></Redirect>;
	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>로그인</h2>
			<div className="box">
				<div className="field">
					<label className="label">ID</label>
					<div className="control">
						<input className="input" type="text" name="userId" onChange={onChange} placeholder="아이디" />
					</div>
				</div>

				<div className="field">
					<label className="label">PW</label>
					<div className="control">
						<input className="input" type="password" name="userPw" onChange={onChange} placeholder="비밀번호" />
					</div>
				</div>

				<button className="button is-fullwidth is-primary" onClick={onClick}>
					로그인
				</button>
			</div>
		</div>
	);
}

export default Login;
