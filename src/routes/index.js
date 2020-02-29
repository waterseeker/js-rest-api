import express from 'express';
import userRouter from './user';
import logoutRouter from './logout';
import authenticateRouter from './authenticate';
import articlesRouter from './articles';

const router = express.Router();

router.use('/articles', articlesRouter);
router.use('/authenticate', authenticateRouter);
router.use('/logout', logoutRouter);
router.use('/user', userRouter);

export default router;
