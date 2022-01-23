import express from 'express';
import { query } from 'express-validator';
import { excelPembayaran, excelSiswa } from '../controllers/excelControl.js';
import { validateInput } from '../middlewares/validator.js';

const router = express.Router();

router.get(
  '/siswa',
  [
    query('idSiswa', 'Id siswa tidak boleh kosong.').notEmpty(),
    validateInput,
    query('idPembayaran', 'Id pembayaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  excelSiswa
);

router.get(
  '/pembayaran',
  [
    query('idPembayaran', 'Id pembayaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  excelPembayaran
);

export default router;
