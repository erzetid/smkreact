import Classess from '../services/Classes.js';
import SiswaService from '../services/SiswaService.js';

const classes = new Classess();
const postController = async (req, res = response) => {
  try {
    const { name, level, major } = req.body;
    const checkClasses = await classes.getClasses(req.body);
    if (checkClasses.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Kelas ${name} sudah tersedia.`
      });
    }
    const data = await classes.addClassLevel(name, level, major);
    return res.status(201).json({
      status: 'success',
      message: 'Kelas baru berhasil disimpan',
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
const putController = async (req, res = response) => {
  try {
    const { id, name, level, major } = req.body;

    const checkIdClasses = await classes.getClasses({ id });
    if (!checkIdClasses.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Id tidak ditemukan.'
      });
    }
    const checkClasses = await classes.getClasses({ name, level, major });
    if (checkClasses.length > 0 && checkClasses[0].id !== id) {
      return res.status(400).json({
        status: 'error',
        message: `Kelas ${name} sudah tersedia.`
      });
    }
    const data = await classes.updateClasses(id, name, level, major);
    return res.status(200).json({
      status: 'success',
      message: 'Kelas berhasil diedit.',
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
const getController = async (req, res = response) => {
  try {
    const { name, level, major } = req.body;
    const data = await classes.getAllClass();
    res.status(200).json({
      status: 'success',
      message: 'Data berhasil diunduh.',
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
const deleteController = async (req, res = response) => {
  try {
    const { id } = await req.params;
    const data = await SiswaService.lihatKelasEksisSiswa(id);
    if (data.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Gagal dihapus karena kelas sedang dipakai siswa.'
      });
    }
    const { deletedCount } = await classes.deleteClass(id);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Kelas tidak ditemukan.'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Kelas berhasil dihapus.'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export { postController, putController, getController, deleteController };
