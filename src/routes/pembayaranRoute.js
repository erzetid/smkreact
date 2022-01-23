import express from 'express';
import { check } from 'express-validator';
import {
  deleteControl,
  deleteSubControl,
  deleteTransaksiControl,
  getControl,
  getIdControl,
  getTotalPembayaranId,
  play,
  postControl,
  postSubControl,
  postTransaksiControl,
  putControl,
  putSubControl
} from '../controllers/pembayaranControl.js';
import {
  deleteControlTransaksi,
  getControlTransaksi,
  postControlTransaksi,
  getPembayaranByTahun
} from '../controllers/transaksiControl.js';
import { validateInput } from '../middlewares/validator.js';

const router = express.Router();

router.post(
  '/',
  [
    check('namaPembayaran', 'Nama pembayaran tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    check('idKelas', 'Kelas tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  postControl
);

router.put(
  '/',
  [
    check('_id', '_id pembayaran tidak boleh kosong.').notEmpty(),
    check('namaPembayaran', 'Nama pembayaran tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    check('idKelas', 'Kelas tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  putControl
);

router.post(
  '/sub',
  [
    check('_id', '_id pembayaran tidak boleh kosong.').notEmpty(),
    check('namaSub', 'Nama sub pembayaran tidak boleh kosong.').notEmpty(),
    check('total', 'Format total harus dengan angka.').notEmpty().isNumeric(),
    validateInput
  ],
  postSubControl
);

router.put(
  '/sub',
  [
    check('_id', '_id sub pembayaran tidak boleh kosong.').notEmpty(),
    check('namaSub', 'Nama sub pembayaran tidak boleh kosong.').notEmpty(),
    check('total', 'Format total harus dengan angka.').notEmpty().isNumeric(),
    validateInput
  ],
  putSubControl
);

router.post(
  '/transaksi',
  [
    check('_id', '_id pembayaran tidak boleh kosong.').notEmpty(),
    check('idSub', 'Id sub pembayaran tidak boleh kosong.').notEmpty(),
    check('idSiswa', 'Id siswa tidak boleh kosong.').notEmpty(),
    check('bayar', 'Format bayar harus dengan angka.').notEmpty().isNumeric(),
    validateInput
  ],
  postTransaksiControl
);

router.post(
  '/transaksi/p',
  [
    check('idSub', 'Id kelas pembayaran tidak boleh kosong.').notEmpty(),
    check('idSiswa', 'Id siswa tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  play
);

router.post(
  '/siswa',
  [
    check('idSub', 'Id kelas pembayaran tidak boleh kosong.').notEmpty(),
    check('idSiswa', 'Id siswa tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  postControlTransaksi
);

router.post(
  '/transaksi/laporan',
  [
    check('_id', '_id pembayaran tidak boleh kosong.').notEmpty(),
    check('idSub', 'Id sub pembayaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  play
);

router.get('/transaksi/p', play);

router.get('/siswa', getControlTransaksi);
router.delete('/siswa/:_id', deleteControlTransaksi);

router.get('/', getControl);
router.get('/:_id', getIdControl);
router.get('/transaksi/laporan/:_id', getTotalPembayaranId);
router.get('/transaksi/laporan', getPembayaranByTahun);
router.delete('/:_id', deleteControl);
router.delete('/sub/:_id', deleteSubControl);
router.delete('/transaksi/:_id', deleteTransaksiControl);

export default router;
