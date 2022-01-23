import express from 'express';
import { check } from 'express-validator';
import { validateInput } from '../middlewares/validator.js';
import {
  getController,
  getIdController,
  postController,
  deleteController,
} from '../controllers/major.js';

const router = express.Router();

router.post(
  '/',
  [
    check('major', 'Jurusan tidak boleh kosong.').notEmpty(),
    check('code', 'Kode jurusan tidak boleh kosong.').notEmpty(),
    validateInput,
  ],
  postController
);
router.get('/', getController);
router.get('/:code', getIdController);
router.delete('/:code', deleteController);

export default router;
