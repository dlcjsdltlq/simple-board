import express from 'express';
import multer from 'multer';

import * as controller from '../controllers/file.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ 
    storage, 
    limits: { 
        fileSize: 52428800
    } 
});

router.get('/:file', controller.getFile);

router.post('/upload', upload.single('file'), controller.uploadFile);


export default router;
