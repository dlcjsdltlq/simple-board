import error from '../constants/error.js';
import * as model from '../models/article.js';
import * as commentModel from '../models/comment.js';
import * as userModel from '../models/user.js';
import * as voteModel from '../models/vote.js';

import DOMPurify from 'isomorphic-dompurify';

export const writeArticle = async (req, res, next) => {
	try {
		const { subject, text } = req.body;
        const cleanSubject = DOMPurify.sanitize(subject);
        const cleanText = DOMPurify.sanitize(text);
		const userId = req.userId;
		const userName = (await userModel.getUserData(userId, null)).userName;
		const result = await model.addArticle(userId, userName, cleanSubject, cleanText);
		res.json({ status: true, data: { articleId: result.articleId } });
	} catch (e) {
		next(e);
	}
};

export const deleteArticle = async (req, res, next) => {
	try {
		const { articleId } = req.body;
		const userId = req.userId;
		if (!(await model.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
		if (!(await model.checkWriter(articleId, userId))) throw error.ERR_USER_INCORRECT;
		await model.deleteArticle(articleId);
		await commentModel.removeComments(articleId);
		res.json({ status: true, data: null });
	} catch (e) {
		next(e);
	}
};

export const modifyArticle = async (req, res, next) => {
	try {
		const { articleId, subject, text } = req.body;
        const cleanSubject = DOMPurify.sanitize(subject);
        const cleanText = DOMPurify.sanitize(text);
		const userId = req.userId;
		if (!(await model.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
		if (!(await model.checkWriter(articleId, userId))) throw error.ERR_USER_INCORRECT;
		await model.modifyArticle(articleId, cleanSubject, cleanText);
		res.json({ status: true, data: null });
	} catch (e) {
		next(e);
	}
};

export const listArticle = async (req, res, next) => {
	try {
		const { start, end } = req.query;
		const result = await model.getArticleList(start, end);
		res.json({ status: true, data: result });
	} catch (e) {
		next(e);
	}
};

export const viewArticle = async (req, res, next) => {
	try {
		const { articleId } = req.params;
		if (!(await model.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
		const result = await model.getArticle(articleId);
		await model.increaseView(articleId);
		res.json({ status: true, data: result });
	} catch (e) {
		next(e);
	}
};

export const voteArticle = async (req, res, next) => {
	try {
		const { articleId, voteType } = req.body;
		const userId = req.userId;
		if (!(await model.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
		if (await voteModel.isVoted(articleId, userId, voteType)) throw error.ERR_ALREADY_VOTED;
        if (voteType !== 'u' && voteType !== 'd') throw error.ERR_VOTE_TYPE_INVALID;
		await voteModel.voteArticle(articleId, userId, voteType);
        const { upVote, downVote } = await model.increaseVote(articleId, voteType);
		res.json({ status: true, data: { articleId, upVote, downVote } });
	} catch (e) {
		next(e);
	}
};
