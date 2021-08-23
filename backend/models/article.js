import mongoose from './db.js';
import autoIncrement from 'mongoose-auto-increment';

const articleSchema = new mongoose.Schema({
	articleId: {
		type: Number,
		unique: true,
	},
	userId: String,
	userName: String,
	subject: String,
	text: String,
	viewCounts: {
		type: Number,
		default: 0,
	},
	commentIndex: {
		type: Number,
		default: 0,
	},
	upVote: { 
		type: Number,
		default: 0,
	},
	downVote: { 
		type: Number,
		default: 0,
	},
	date: Date,
});


articleSchema.plugin(autoIncrement.plugin, {
	model: 'ArticleModel',
	field: 'articleId',
	startAt: 1,
	increment: 1,
});

const ArticleModel = mongoose.model('ArticleModel', articleSchema);

export const addArticle = (userId, userName, subject, text) => {
	const articleInstance = new ArticleModel({
		userId,
		userName,
		subject,
		text,
		date: new Date(),
	});
	return articleInstance.save();
};

export const modifyArticle = (articleId, subject, text) => {
	return ArticleModel.findOneAndUpdate({ articleId }, { subject, text });
};

export const deleteArticle = (articleId) => {
	return ArticleModel.findOneAndDelete({ articleId });
};

export const getArticle = (articleId) => {
	return ArticleModel.findOne({ articleId }).select('articleId subject text userId userName date viewCounts commentIndex upVote downVote -_id');
};

export const getArticleList = (start, end) => {
	return ArticleModel.find({ articleId: { $gte: start, $lte: end } }).select('articleId subject userId userName date viewCounts commentIndex upVote downVote -_id');
};

export const checkExists = async (articleId) => {
	const count = await ArticleModel.countDocuments({ articleId }).exec();
	return count > 0;
};

export const checkWriter = async (articleId, userId) => {
	const count = await ArticleModel.countDocuments({ articleId, userId }).exec();
	return count > 0;
};

export const increaseView = (articleId) => {
	return ArticleModel.findOneAndUpdate({ articleId }, { $inc: { viewCounts: 1 } });
};

export const increaseCommentIndex = (articleId) => {
	return ArticleModel.findOneAndUpdate({ articleId }, { $inc: { commentIndex: 1 } });
};

export const increaseVote = (articleId, voteT) => {
    //votetype : 'u' || 'd'
    const voteType = { u: 'upVote', d: 'downVote' }[voteT];
	return ArticleModel.findOneAndUpdate({ articleId }, { $inc: { [voteType]: 1 } }, { new: true });
};
