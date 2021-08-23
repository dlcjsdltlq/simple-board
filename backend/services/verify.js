import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { randomBytes } from 'crypto';

export const createToken = (key, payload, expire) => {
	const token = jwt.sign(payload, key, { expiresIn: expire });
	return token;
};

export const verifyToken = (key, token) => {
	try {
		return jwt.verify(token, key);
	} catch (e) {
		return 'TOKEN_INVALID';
	}
};

export const createPwHash = (pw) => {
	const salt = randomBytes(10).toString('hex');
	const hash = CryptoJS.SHA512(salt + pw);
	return salt + '$' + hash;
};

export const verifyPw = (pw, cipher) => {
	const salt = cipher.split('$')[0];
	const hash = cipher.split('$')[1];
	const checkHash = '' + CryptoJS.SHA512(salt + pw);
	return hash === checkHash;
};

export const createEmailVerifyToken = () => {
    return randomBytes(64).toString('hex');
};

export const sendVerifyEmail = (transporter, target, url) => {
    return transporter.sendMail({
        from: '"Simple-Board" <dlcjsdltlqdlf@gmail.com>',
        to: target,
        subject: 'Simple-Board 이메일 인증',
        text: `아래 링크를 클릭해 Simple Board의 회원가입 과정을 마무리해 주시기 바랍니다`,
        html: `아래 링크를 클릭해 Simple Board의 회원가입 과정을 마무리해 주시기 바랍니다.<br/><a href="${url}">인증하기</a>`
    });
}