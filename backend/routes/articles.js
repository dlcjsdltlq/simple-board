import express from 'express';
import * as authMiddleware from '../middlewares/auth.js';
import * as articleController from '../controllers/article.js';

const router = express.Router();

router.post('/write', authMiddleware.verifyToken, articleController.writeArticle);
router.post('/delete', authMiddleware.verifyToken, articleController.deleteArticle);
router.post('/modify', authMiddleware.verifyToken, articleController.modifyArticle);
router.post('/vote', authMiddleware.verifyToken, articleController.voteArticle);

router.get('/getlist', articleController.listArticle);
router.get('/view/:articleId', articleController.viewArticle);

export default router;