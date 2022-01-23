import express from 'express';
import multer from 'multer';
import { check } from 'express-validator';
import { validateInput } from '../middlewares/validator.js';
import {
  getControl,
  postControl,
  postClassControl,
  getIdControl,
  putControl,
  putClassControl,
  deleteControl,
  deletesControl,
  deleteClassControl,
  deletesClassControl,
  postsClassControl,
  putsClassControl,
  getClassIdControl,
  getTpControl,
  uploadContoller
} from '../controllers/siswaController.js';

const router = express.Router();

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
  ) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};
const storage = multer.diskStorage({
  destination: './src/uploads/',
  filename: function (req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
    cb(null, 'users.xlsx');
  }
});
const uploadMidd = multer({
  storage: storage,
  fileFilter: excelFilter
});

router.post(
  '/',
  [
    check('nisn', 'NISN tidak boleh kosong.').notEmpty(),
    check('nis', 'NIS tidak boleh kosong.').notEmpty(),
    check('nama', 'Nama tidak boleh kosong.').notEmpty(),
    check('kotaLahir', 'Kota lahir tidak boleh kosong.').notEmpty(),
    check('tanggalLahir', 'Tanggal lahir tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun masuk tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  postControl
);
router.post(
  '/kelas',
  [
    check('id', 'Id tidak boleh kosong.').notEmpty(),
    check('idKelas', 'Id kelas tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  postClassControl
);
router.put(
  '/',
  [
    check('id', 'Id siswa tidak boleh kosong.').notEmpty(),
    check('nisn', 'NISN tidak boleh kosong.').notEmpty(),
    check('nis', 'NIS tidak boleh kosong.').notEmpty(),
    check('nama', 'Nama tidak boleh kosong.').notEmpty(),
    check('kotaLahir', 'Kota lahir tidak boleh kosong.').notEmpty(),
    check('tanggalLahir', 'Tanggal lahir tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  putControl
);
router.put(
  '/kelas',
  [
    check('id', 'Id tidak boleh kosong.').notEmpty(),
    check('idKelas', 'Id kelas tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  putClassControl
);
router.delete(
  '/kelas',
  [
    check('id', 'Id tidak boleh kosong.').notEmpty(),
    check('idKelas', 'Id kelas tidak boleh kosong.').notEmpty(),
    check('tahunPelajaran', 'Tahun pelajaran tidak boleh kosong.').notEmpty(),
    validateInput
  ],
  deleteClassControl
);
router.post('/kelass', postsClassControl);
router.put('/kelass', putsClassControl);
router.delete('/kelass', deletesClassControl);
router.get('/', getControl);
router.get('/:id', getIdControl);
router.get('/kelas/:id', getClassIdControl);
router.post('/tahun', getTpControl);
router.delete('/:id', deleteControl);
router.delete('/', deletesControl);
router.post('/upload', uploadMidd.single('siswa'), uploadContoller);

export default router;
