import SekolahService from '../services/SekolahService.js';
import SiswaService from '../services/SiswaService.js';

export const getControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const data = await sekolahService.lihat();
    if (!data.length) {
      const _data = await SekolahService.simpan();
      return res.status(200).json({
        status: 'success',
        message: 'Data sekolah berhasil dimuat.',
        data: _data
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Data sekolah berhasil dimuat.',
      data: data[0]
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const getTpControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const data = await sekolahService.lihat();
    if (!data.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Data sekolah tidak ditemukan.'
      });
    }
    const { _id, tahunPelajaranSekarang, logo } = data[0];
    const tahunPelajaran = data[0].tahunPelajaran.map((tahunPelajaran) => {
      const result = { tahunPelajaran };

      return result;
    });
    return res.status(200).json({
      status: 'success',
      message: 'Data tahun pelajaran berhasil dimuat.',
      data: { _id, tahunPelajaranSekarang, tahunPelajaran, logo }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const putControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const data = await sekolahService.editSekolah(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Sekolah berhasil diedit.',
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
export const postTpControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const cekTahunPelajaran = await sekolahService.lihatTahunPelajaran(
      req.body.tahunPelajaran
    );
    if (cekTahunPelajaran.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Tahun pelajaran sudah tersedia.'
      });
    }
    const data = await sekolahService.tambahTahunPelajaran(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Tahun pelajaran berhasil ditambahkan.',
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
export const deleteTpControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const cekTahunPelajaran = await sekolahService.lihatTahunPelajaran(
      req.body.tahunPelajaran
    );
    const cekTpEksisSiswa = await SiswaService.lihatTpEksisSiswa(
      req.body.tahunPelajaran
    );
    if (cekTpEksisSiswa.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Tahun pelajaran sedang/sudah dipakai siswa.'
      });
    }
    if (!cekTahunPelajaran.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Tahun pelajaran tidak diketahui.'
      });
    }
    if (
      cekTahunPelajaran[0].tahunPelajaranSekarang === req.body.tahunPelajaran
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Tahun pelajaran sedang dipakai saat ini.'
      });
    }
    const data = await sekolahService.hapusTahunPelajaran(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Tahun pelajaran berhasil dihapus.',
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
export const putTpControl = async (req, res = response) => {
  try {
    const sekolahService = new SekolahService();
    const cekTahunPelajaran = await sekolahService.lihatTahunPelajaran(
      req.body.tahunPelajaranSekarang
    );
    if (!cekTahunPelajaran.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Tahun pelajaran tidak diketahui.'
      });
    }
    const data = await sekolahService.editSekolah(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Tahun pelajaran berhasil diset.',
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
