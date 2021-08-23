import express from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as commentController from '../controllers/comment.js';

const router = express.Router();

router.post('/write', authMiddleware.verifyToken, commentController.writeComment);
router.post('/delete', authMiddleware.verifyToken, commentController.deleteComment);
router.post('/modify', authMiddleware.verifyToken, commentController.modifyComment);
router.post('/view', commentController.viewComments);

export default router;