import * as model from '../models/user.js';
import * as authModel from '../models/auth.js';
import * as verify from '../services/verify.js';
import error from '../constants/error.js';

import DOMPurify from 'isomorphic-dompurify';

export const signUp = async (req, res, next) => {
	try {
		const { userId, userName, userEmail, userPw } = req.body;
        const cleanUserName = DOMPurify.sanitize(userName);
        const existsResult = await model.checkExists(userId, userEmail);
		if (existsResult.userIdCount) throw error.ERR_EXISTING_USER_ID;
		if (existsResult.userEmailCount) throw error.ERR_EXISTING_EMAIL;
        const pwHash = verify.createPwHash(userPw);
        const emailVerifyToken = verify.createEmailVerifyToken();
		await model.addUserData(userId, cleanUserName, userEmail, pwHash, emailVerifyToken);
        await verify.sendVerifyEmail(req.app.locals.transporter, userEmail, 'http://localhost:3000/email-verify/' + emailVerifyToken);
		res.json({ status: true, data: 'WAIT_EMAIL_VERIFY' });
	} catch (e) {
		next(e);
	}
};

export const checkExists = async (req, res, next) => {
	try {
		const { userId, userEmail } = req.body;
		const result = await model.checkExists(userId, userEmail);
        if (result.userIdCount) throw error.ERR_EXISTING_USER_ID;
		if (result.userEmailCount) throw error.ERR_EXISTING_EMAIL;
		res.json({ status: true, data: 'OK' });
	} catch (e) {
		next(e);
	}
};

export const login = async (req, res, next) => {
    try {
        const { userId, userPw } = req.body;
        if (!(await model.checkExists(userId, '')).userIdCount) throw error.ERR_ID_NOT_EXISTS;
        const userData = await model.getUserData(userId, null);
        if (userData.emailVerifyToken) throw error.ERR_EMAIL_NOT_VERIFIED;
        const result = verify.verifyPw(userPw, userData.userPw);
        req.userId = userId;
        if (result) next();
        else throw error.ERR_PW_INCORRECT;
    } catch (e) {
        next(e);
    }
};

export const logout = async (req, res, next) => {
	try {
        const token = req.cookies['Authorization'].replace('Bearer ', '');
		res.cookie('Authorization', '');
        await authModel.removeToken(token);
		res.json({ status: true, data: null });
	} catch (e) {
		next(e);
	}
};

export const emailVerify = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!(await model.checkEmailToken(token))) throw error.ERR_TOKEN_INVALID;
        await model.acceptVerify(token);
        res.json({ status: true, data: 'ACCOUNT_ACCEPTED' });
    } catch (e) {
        next(e);
    }
};

export const subscribePush = async (req, res, next) => {
    try {
        const subscription = req.body;
        const userId = req.userId;
        await model.subscribePush(userId, subscription);
        res.json({ status: true, data: 'SUBSCRIPTION_ACCEPTED' });
    } catch (e) {
        next(e);
    }
}