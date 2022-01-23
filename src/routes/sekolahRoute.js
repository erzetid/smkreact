import express from 'express';
import { check } from 'express-validator';
import { validateInput } from '../middlewares/validator.js';
import {
  deleteTpControl,
  getControl,
  getTpControl,
  postTpControl,
  putControl,
  putTpControl,
} from '../controllers/sekolahController.js';

const router = express.Router();
router.get('/', getControl);
router.get('/tp', getTpControl);
router.put(
  '/',
  [
    check('_id', 'Id tidak boleh kosong.').notEmpty(),
    check('namaSekolah', 'Nama sekolah tidak boleh kosong.').notEmpty(),
    check('email', 'Email tidak boleh kosong').notEmpty(),
    check('telepon', 'Telepon tidak boleh kosong.').notEmpty(),
    check('alamatSekolah', 'Alamat tidak boleh kosong.').notEmpty(),
    check('logo', 'Logo tidak boleh kosong.').notEmpty(),
    validateInput,
  ],
  putControl
);
router.post(
  '/tp',
  [
    check('_id', 'Id tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    validateInput,
  ],
  postTpControl
);
router.put(
  '/tp',
  [
    check('_id', 'Id tidak boleh kosong.').notEmpty(),
    check(
      'tahunPelajaranSekarang',
      'Tahun pelajaran tidak boleh kosong.'
    ).notEmpty(),
    validateInput,
  ],
  putTpControl
);
router.delete(
  '/tp',
  [
    check('_id', 'Id tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    validateInput,
  ],
  deleteTpControl
);
export default router;
