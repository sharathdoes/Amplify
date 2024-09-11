import express from 'express';
import  signIn  from '../controllerss/SignInController.js'; // Fixed path typo

const router = express.Router();

// Sign in a user (for `signIn`)
router.post('/signin', signIn);

// Sign in a seeker (for `UsersignIn`)

export default router;
