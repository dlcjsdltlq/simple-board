import mongoose from './db.js';

const voteSchema = new mongoose.Schema({
    userId: String,
    articleId: String,
    voteType: String
});

const VoteModel = mongoose.model('VoteModel', voteSchema);

export const voteArticle = (articleId, userId, voteT) => {
    //votetype : 'u' || 'd'
    const voteType = { u: 'upVote', d: 'downVote' }[voteT];
    const voteInstance = new VoteModel({
        articleId, userId, voteType
    });
    return voteInstance.save();
};

export const getUserVote = (articleId, userId) => {
	return VoteModel.findOne({ articleId, userId });
};

export const isVoted = async (articleId, userId, voteT) => {
    //votetype : 'u' || 'd'
    const voteType = { u: 'upVote', d: 'downVote' }[voteT];
	return (await VoteModel.countDocuments({ articleId, userId, voteType }).exec()) > 0;
};
