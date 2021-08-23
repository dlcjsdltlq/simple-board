import mongoose from './db.js';

const authSchema = new mongoose.Schema({
    token: String,
    expireIn: {
        type: Date,
        expires: 0
    }
});

const AuthModel = mongoose.model('AuthModel', authSchema);

export const addToken = (token, expireIn) => {
    const authInstance = new AuthModel({
        token, expireIn
    })
    return authInstance.save();
};

export const checkToken = async (token) => {
    const result = await AuthModel.countDocuments({ token }).exec();
    return result > 0;
};

export const removeToken = (token) => {
    return AuthModel.findOneAndDelete({ token });
};