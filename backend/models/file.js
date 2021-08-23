import mongoose from './db.js';

const FileSchema = new mongoose.Schema({
	fileHash: {
		type: String,
		unique: true,
	},
	fileLocation: String,
	fileType: String,
});

const FileModel = mongoose.model('FileModel', FileSchema);

export const saveFile = (fileHash, fileLocation, fileType) => {
	const fileInstance = new FileModel({
		fileHash,
		fileLocation,
		fileType,
	});
	return fileInstance.save();
};

export const checkFileExists = async (fileHash) => {
    return (await FileModel.countDocuments({ fileHash }).exec() > 0);
}

export const getFileData = (fileHash) => {
    return FileModel.findOne({ fileHash });
};

export const deleteFile = (fileHash) => {
    return FileModel.findOneAndDelete({ fileHash });
};