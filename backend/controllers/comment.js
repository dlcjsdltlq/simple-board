import * as model from '../models/comment.js';
import * as articleModel from '../models/article.js'
import * as userModel from '../models/user.js';
import error from '../constants/error.js';

import DOMPurify from 'isomorphic-dompurify';

export const writeComment = async (req, res, next) => {
    try {
        const { articleId, text, depth, targetIndex } = req.body;
        const cleanText = DOMPurify.sanitize(text);
        const userId = req.userId;
        if (!(await articleModel.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
        if (depth !== 0 && (targetIndex < 0 || !(await model.checkExists(articleId, targetIndex)))) throw error.ERR_TARGET_COMMENT_NOT_EXISTS;
        const userName = (await userModel.getUserData(userId, null)).userName;
        const commentIndex = (await articleModel.getArticle(articleId)).commentIndex;
        const result = await model.addComment(articleId, commentIndex, userId, userName, cleanText, depth, targetIndex);
        await articleModel.increaseCommentIndex(articleId);
        res.json({ status: true, data: result });
    } catch (e) {
        next(e);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const { articleId, commentIndex } = req.body;
        const userId = req.userId;
        if (!(await articleModel.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
        if (!(await model.checkExists(articleId, commentIndex))) throw error.ERR_COMMENT_NOT_EXISTS;
        if (!(await model.checkWriter(articleId, commentIndex, userId))) throw error.ERR_USER_INCORRECT;
        await model.deleteComment(articleId, commentIndex);
        res.json({ status: true, data: null });
    } catch (e) {
        next(e);
    }
};

export const modifyComment = async (req, res, next) => {
    try {
        const { articleId, commentIndex, text } = req.body;
        const userId = req.userId;
        if (!(await articleModel.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
        if (!(await model.checkExists(articleId, commentIndex))) throw error.ERR_COMMENT_NOT_EXISTS;
        if (!(await model.checkWriter(articleId, userId))) throw error.ERR_USER_INCORRECT;
        await model.modifyComment(articleId, commentIndex, text);
        res.json({ status: true, data: null });
    } catch (e) {
        next(e);
    }
};

export const viewComments = async (req, res, next) => {
    try {
        const { articleId, start, end } = req.body;
        if (!(await articleModel.checkExists(articleId))) throw error.ERR_ARTICLE_NOT_EXISTS;
        const result = await model.getComments(articleId, start, end);
        const comments = [];
        while (result.length !== 0) {
            const comment = result.shift();
            if (comment.depth) continue;
            const commentIndex = comment.commentIndex;
            comments.push(comment);
            comments.push(...result.filter(comment => comment.targetIndex === commentIndex));
        }
        res.json({ status: true, data: comments });
    } catch (e) {
        next(e);
    }
};