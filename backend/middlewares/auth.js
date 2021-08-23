import * as verify from '../services/verify.js';
import error from '../constants/error.js';
import * as model from '../models/auth.js';

Date.prototype.addMinute = function (m) {
	this.setTime(this.getTime() + m * 60 * 1000);
	return this;
};

Date.prototype.addDate = function (day) {
	this.setTime(this.getTime() + day * 86400000);
	return this;
};

export const issueToken = async (req, res, next) => {
	try {
		//refreshtoken: 30d, accesstoken: 1h
		const refreshExpires = new Date().addDate(30);
		const refreshToken = verify.createToken(process.env.KEY_REFRESH_TOKEN, { type: 'refresh', userId: req.body.userId }, '30d');
		const accessToken = verify.createToken(process.env.KEY_ACCESS_TOKEN, { type: 'access', userId: req.body.userId }, '1h');
		res.cookie('Authorization', 'Bearer ' + refreshToken, {
			httpOnly: true,
			expires: refreshExpires,
		});
		await model.addToken(refreshToken, refreshExpires);
		res.json({ status: true, data: { token: 'Bearer ' + accessToken, expires: new Date().addMinute(59) } });
	} catch (e) {
		next(e);
	}
};

export const issueAccessToken = async (req, res, next) => {
	try {
		//refreshtoken: 30d, accesstoken: 1h
		const token = req.cookies['Authorization'].replace('Bearer ', '');
		const result = verify.verifyToken(process.env.KEY_REFRESH_TOKEN, token);
		if (!(await model.checkToken(token)) || result === 'TOKEN_INVALID' || result.type !== 'refresh') throw error.ERR_TOKEN_INVALID;
		const accessToken = verify.createToken(process.env.KEY_ACCESS_TOKEN, { type: 'access', userId: result.userId }, '1h');
		res.json({ status: true, data: { token: 'Bearer ' + accessToken, expires: new Date().addMinute(59) } });
	} catch (e) {
		next(e);
	}
};

export const verifyToken = async (req, res, next) => {
	try {
		//refreshtoken: 30d, accesstoken: 1h
		const accessToken = req.header('Authorization');
        if (!accessToken || !accessToken.startsWith('Bearer ')) throw error.ERR_TOKEN_INVALID;
		const result = verify.verifyToken(process.env.KEY_ACCESS_TOKEN, accessToken.replace('Bearer ', ''));
		console.log(result);
		if (result === 'TOKEN_INVALILD' || result.type !== 'access') throw error.ERR_TOKEN_INVALID;
		req.userId = result.userId;
		next();
	} catch (e) {
		next(e);
	}
};
