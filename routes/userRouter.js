import express from 'express';
import { login, register } from '../controllers/userController.js';
import { nameChecker, passChecker } from '../middlewares/helpers.js';

const userrouter = express.Router();

userrouter.post('/login', nameChecker, passChecker, login);
userrouter.post('/register', nameChecker, passChecker, register);


export { userrouter }
