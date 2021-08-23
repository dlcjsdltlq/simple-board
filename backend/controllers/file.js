import error from '../constants/error.js';
import * as fileService from '../services/file.js';
import * as model from '../models/file.js';
import base64url from 'base64url';
import path from 'path';
import { statSync } from 'fs';

const SUPPORTED_FILES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'];

export const uploadFile = async (req, res, next) => {
	try {
		const file = req.file;
		console.log(file.mimetype);
		if (!SUPPORTED_FILES.includes(file.mimetype)) throw error.ERR_FILE_NOT_SUPPORED;
		const hash = fileService.hashFile(file.buffer);
        const b64FileName = base64url(file.originalname);
		if (!(await model.checkFileExists(hash))) {
            const extension = path.extname(file.originalname);
			const location = `C:/Users/kusta/Documents/Programming/simple-board/backend/uploads/file/${hash}${extension}`;
			await model.saveFile(hash, file.originalname, location, file.mimetype);
			fileService.saveFile(file.buffer, location);
		}
		return res.json({ status: true, data: `${hash}?n=${b64FileName}` });
	} catch (e) {
		next(e);
	}
};

export const getFile = async (req, res, next) => {
	try {
		const { file: hash } = req.params;
        const fileName = base64url.decode(req.query.n || '');
        let location = 'C:/Users/kusta/Documents/Programming/simple-board/backend/uploads/file/';
        if (fileName) location += hash + path.extname(fileName);
        else location += (await model.getFileData(hash)).fileLocation;
		if (statSync(location) === 'ENOENT') throw error.ERR_FILE_NOT_EXISTS;
		//const { fileLocation, fileType } = await model.getFileData(hash);
		//res.set({ 'Content-Type': fileType });
		res.download(location, fileName);
	} catch (e) {
		next(e);
	}
};
