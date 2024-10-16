import express from 'express';
import SeekerController from '../controllerss/TestController.js'
const router = express.Router();

// Sign in a user (for `signIn`)

// Sign in a seeker (for `UsersignIn`)
router.post('/Usersignin', SeekerController.signIn);
router.post('/tookTest',SeekerController.tookTest);
router.post('/didhe',SeekerController.checkTestStatus);

export default router;
