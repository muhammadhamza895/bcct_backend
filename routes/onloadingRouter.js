import express from 'express';

// Helpers
import { quantityVerification } from '../middlewares/helpers.js';
import { materialVerifier } from '../middlewares/documentsVerifier.js';

// Controllers
import { createOnloading } from '../controllers/onloadingController.js';

const onloadingRouter = express.Router();

// Routes
onloadingRouter.post('/create-onloading',quantityVerification, materialVerifier, createOnloading);

export { onloadingRouter };