import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { error } from './constants/error';
import { errorHandler } from './services/error-handler';

function SignUp() {
	const [input, setInput] = useState({});
	const [isPwWrong, setPwWrong] = useState(false);
	const [waitVerify, setWaitVerify] = useState(false);
	const history = useHistory();

	const onChange = (e) => {
		const { name, value } = e.target;
		setInput({
			...input,
			[name]: value,
		});
	};

	const onPwInput = () => {
		console.log(input);
		if (input.userPwCheck && input.userPw !== input.userPwCheck) setPwWrong(true);
		else setPwWrong(false);
	};

	const onSubmit = async () => {
		let response = await axios.post('http://localhost:3001/api/user/check-exists', {
			userId: input.userId,
			userEmail: input.userEmail,
		});
		errorHandler(response.data.data);

		const exists = response.data.data;

		if (exists && error.hasOwnProperty(exists)) {
			alert(error[exists].msgKor);
		}

		response = await axios.post('http://localhost:3001/api/user/signup', input);

        errorHandler(response.data.data);

		if (response.data.data === 'WAIT_EMAIL_VERIFY') setWaitVerify(true);
	};

	if (waitVerify)
		return (
			<section className="hero is-medium is-link">
				<div className="hero-body">
					<p className="title">Thank You!</p>
					<p className="subtitle">이메일 인증으로 회원가입을 완료해주세요.</p>
				</div>
			</section>
		);

	return (
		<div className="container m-auto is-max-desktop">
			<h2 className="title has-text-centered is-1" style={{ marginTop: '100px' }}>
				회원가입
			</h2>
			<div className="box">
				<div className="field">
					<label className="label">ID</label>
					<div className="control">
						<input className="input" type="text" placeholder="아이디" name="userId" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">PW</label>
					<div className="control">
						<input className="input" type="password" placeholder="비밀번호" name="userPw" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">PW 확인</label>
					<div className="control">
						<input className="input" type="password" placeholder="비밀번호 확인" name="userPwCheck" onChange={onChange} onKeyUp={onPwInput} />
					</div>
					{isPwWrong ? (
						<label className="label" style={{ color: '#FF0000' }}>
							비밀번호가 일치하지 않습니다!
						</label>
					) : (
						''
					)}
				</div>
				<div className="field">
					<label className="label">닉네임</label>
					<div className="control">
						<input className="input" type="text" placeholder="닉네임" name="userName" onChange={onChange} />
					</div>
				</div>
				<div className="field">
					<label className="label">이메일 주소</label>
					<div className="control">
						<input className="input" type="email" placeholder="to@example.com" name="userEmail" onChange={onChange} />
					</div>
				</div>
				<button className="button is-fullwidth is-primary" onClick={onSubmit}>
					회원가입
				</button>
			</div>
		</div>
	);
}

export default SignUp;
