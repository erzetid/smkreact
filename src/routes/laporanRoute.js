import express from 'express';
import { check } from 'express-validator';
import {
  getBar,
  getControl,
  getControlById,
  getControlByIdAndSiswa,
  getControlByIdAndTanggal,
  getControlByTanggal,
  getDashboard
} from '../controllers/laporanControl.js';
import { validateInput } from '../middlewares/validator.js';
const router = express.Router();

router.get('/q', getControlById);
router.get('/s', getControlByIdAndSiswa);
router.get('/t', getControlByTanggal);
router.get('/i', getControlByIdAndTanggal);
router.get('/', getControl);
router.get('/dashboard', getDashboard);
router.get('/bar', getBar);

export default router;
