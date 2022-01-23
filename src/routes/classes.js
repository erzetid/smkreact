import express from 'express';
import { check } from 'express-validator';
import { validateInput } from '../middlewares/validator.js';
import {
  postController,
  putController,
  getController,
  deleteController
} from '../controllers/classes.js';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Nama tidak boleh kosong.').notEmpty(),
    check('level', 'Tingkat harus dengan nomerik.').notEmpty().isNumeric(),
    check('major', 'Jurusan tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  postController
);

router.put(
  '/',
  [
    check('id', 'Id tidak boleh kosong.').notEmpty(),
    check('name', 'Nama tidak boleh kosong.').notEmpty(),
    check('level', 'Tingkat harus dengan nomerik.').notEmpty().isNumeric(),
    check('major', 'Jurusan tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  putController
);

router.get('/', getController);
router.delete('/:id', deleteController);

export default router;
