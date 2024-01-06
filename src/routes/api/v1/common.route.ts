import express from 'express';
import { decode } from '../../../middlewares/jwt';
import { handleInvalidMethod } from '../../../middlewares/invalidrequest'
import commonController from '../../../controllers/api/v1/common.controller';

const router = express.Router();

router.get('/constants',commonController.getConstants);

router.all('/constants', handleInvalidMethod);

export default router

