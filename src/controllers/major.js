import MajorService from '../services/MajorService.js';

const majors = new MajorService();
const postController = async (req, res = response) => {
  try {
    const { major, code } = req.body;
    const checkMajor = await majors.getById(code);
    if (checkMajor.length > 0) {
      return res.status(400).json({
        status: 'success',
        message: 'Kode jurusan sudah tersedia.',
      });
    }
    const data = await majors.addMajor(major, code);
    return res.status(201).json({
      status: 'success',
      message: 'Jurusan baru berhasil disimpan.',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
    });
  }
};
const getController = async (req, res = response) => {
  try {
    const data = await majors.getAllMajor();
    return res.status(200).json({
      status: 'success',
      message: 'Data berhasil diunduh.',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
    });
  }
};
const getIdController = async (req, res = response) => {
  try {
    const { code } = await req.params;
    const data = await majors.getById(code);
    if (!data.length) {
      return res.status(404).json({
        status: 'success',
        message: 'Jurusan tidak ditemukan.',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Data berhasil diunduh.',
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
    });
  }
};
const deleteController = async (req, res = response) => {
  try {
    const { code } = await req.params;
    const checkClassByCode = await majors.getClassByCode(code);
    if (checkClassByCode.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Tidak dapat mengahapus karena jurusan sedang dipakai.',
      });
    }
    const { deletedCount } = await majors.deleteMajor(code);
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Jurusan tidak ditemukan.',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Jurusan berhasil dihapus.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
    });
  }
};

export { postController, getController, getIdController, deleteController };
