import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { error } from './constants/error';
import { errorHandler } from './services/error-handler';

function EmailVerify() {
    const [verifyState, setVerifyState] = useState('ready');

    const { token } = useParams();

    useEffect(() => {
        axios.post('http://localhost:3001/api/user/email-verify', { token }).then(response => {
            errorHandler(response.data.data);
            if (response.data.data === 'ACCOUNT_ACCEPTED') setVerifyState('success');
        }).catch(() => setVerifyState('error'));
    }, [token]);

    if (verifyState === 'ready') return <div>요청중...</div>
    
    if (verifyState === 'error') return <div>인증할 수 없습니다.</div>

	return (
		<section className="hero is-medium is-link">
			<div className="hero-body">
				<p className="title">이메일 인증 완료</p>
				<p className="subtitle">이메일 주소가 인증되었습니다.</p>
			</div>
		</section>
	);
}

export default EmailVerify;
