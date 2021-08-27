import mongoose from './db.js';

const commentSchema = new mongoose.Schema({
	articleId: Number,
	commentIndex: Number,
	userId: String,
	userName: String,
	text: String,
	depth: Number,
	targetIndex: {
		type: Number,
		default: 0,
	},
	date: Date,
});

const CommentModel = mongoose.model('CommentModel', commentSchema);

export const addComment = (articleId, commentIndex, userId, userName, text, depth, targetIndex) => {
	const commentInstance = new CommentModel({
		articleId,
		commentIndex,
		userId,
		userName,
		text,
		depth,
		targetIndex,
		date: new Date(),
	});
	return commentInstance.save();
};

export const getComment = (articleId, commentIndex) => {
	return CommentModel.findOne({ articleId, commentIndex });
};

export const modifyComment = (articleId, commentIndex, text) => {
	return CommentModel.findOneAndUpdate({ articleId, commentIndex }, { text });
};

export const deleteComment = (articleId, commentIndex) => {
	return CommentModel.findOneAndDelete({ articleId, commentIndex });
};

export const removeComments = (articleId) => {
	return CommentModel.deleteMany({ articleId });
};

export const getComments = (articleId, start, end) => {
	return CommentModel.find({ articleId, commentIndex: { $gte: start, $lte: end } })
		.select('articleId commentIndex userId userName text depth targetIndex date -_id')
		.sort('commentIndex');
};

export const checkExists = async (articleId, commentIndex) => {
	const count = await CommentModel.countDocuments({ articleId, commentIndex }).exec();
	return count > 0;
};

export const checkWriter = async (articleId, commentIndex, userId) => {
	const count = await CommentModel.countDocuments({ articleId, commentIndex, userId }).exec();
	return count > 0;
};
