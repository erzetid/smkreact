import PembayaranService from '../services/PembayaranService.js';
import SiswaService from '../services/SiswaService.js';

export const postControl = async (req, res = response) => {
  try {
    const tanggalSekarang = new Date();
    const payload = req.body;
    //menambahkan tanggal pembuatan
    payload.tanggalPembuatan = tanggalSekarang.toISOString();
    const data = await PembayaranService.tambahPembayaran(payload);

    if (!data.namaPembayaran) {
      //menghapus pembayaran by _id jika gagal
      await PembayaranService.sHapusPembayaranById(data._id);
      return res.status(400).json({
        status: 'error',
        message: 'Gagal menambahkan pembayaran.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menyimpan pembayaran ${data.namaPembayaran}`
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
    const tanggalSekarang = new Date();
    const { _id, namaPembayaran, tahunPelajaran, idKelas } = req.body;
    const pembayaranService = new PembayaranService(_id);
    const pembayaran = await pembayaranService.lihatPembayaranById();
    const payload = {
      namaPembayaran,
      tahunPelajaran,
      idKelas,
      tanggalPembuatan: tanggalSekarang.toISOString()
    };

    //pengecekan transaksi harus kosong
    if (pembayaran) {
      if (pembayaran.transaksi.length) {
        return res.status(400).json({
          status: 'error',
          message: `Gagal memperbarui pembayaran, ${pembayaran.namaPembayaran} sudah ada aktifitas transaksi.`
        });
      }
    }
    const data = await pembayaranService.editPembayaran(payload);
    if (!data) {
      return res.status(400).json({
        status: 'error',
        message: `Gagal memperbarui pembayaran.`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui pembayaran ${data.namaPembayaran}.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const deleteControl = async (req, res = response) => {
  try {
    const { _id } = await req.params;
    const pembayaranService = new PembayaranService(_id);
    const pembayaran = await pembayaranService.lihatPembayaranById();

    //pengecekan transaksi harus kosong
    if (pembayaran) {
      if (pembayaran.transaksi.length) {
        return res.status(400).json({
          status: 'error',
          message: `Gagal hapus pembayaran, ${pembayaran.namaPembayaran} sudah ada aktifitas transaksi.`
        });
      }
    }

    const { deletedCount } = await pembayaranService.hapusPembayaranById();
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Id pembayaran tidak ditemukan.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pembayaran berhasil dihapus.'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getControl = async (req, res = response) => {
  try {
    const data = await PembayaranService.lihatSemuaPembayaran();
    return res.status(200).json({
      status: 'success',
      message: 'Pembayaran berhasil dimuat.',
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

export const getIdControl = async (req, res = response) => {
  try {
    const { _id } = await req.params;
    const pembayaranService = new PembayaranService(_id);
    const data = await pembayaranService.lihatPembayaranById();

    if (!data) {
      return res.status(400).json({
        status: 'error',
        message: 'Pembayaran tidak ditemukan.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Pembayaran berhasil dimuat.',
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

export const postSubControl = async (req, res = response) => {
  try {
    const { _id, namaSub, total } = req.body;
    const payload = { subBayar: { namaSub, total } };
    const pembayaranService = new PembayaranService(_id);
    const data = await pembayaranService.tambahSubBayar(payload);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Id pembayaran tidak ditemukan.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menyimpan sub pembayaran.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const putSubControl = async (req, res = response) => {
  try {
    const payload = req.body;

    //pengecekan transaksi harus kosong
    const subBayar = await PembayaranService.sLihatSubBayarDiTransaksi(
      payload._id
    );
    if (subBayar) {
      return res.status(400).json({
        status: 'error',
        message: `Gagal memperbarui sub pembayaran, karena sudah ada aktifitas transaksi.`
      });
    }

    const data = await PembayaranService.sEditSubBayar(payload);
    if (!data) {
      return res.status(400).json({
        status: 'error',
        message:
          'Gagal memperbarui sub pembayaran, id sub pembayaran tidak diketahui.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui sub pembayaran.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const deleteSubControl = async (req, res = response) => {
  try {
    const { _id } = req.params;

    //pengecekan transaksi harus kosong
    const subBayar = await PembayaranService.sLihatSubBayarDiTransaksi(_id);
    if (subBayar) {
      return res.status(400).json({
        status: 'error',
        message: `Gagal menghapus sub pembayaran, karena sudah ada aktifitas transaksi.`
      });
    }
    const data = await PembayaranService.sHapusSubBayar(_id);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Id sub pembayaran tidak ditemukan.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menghapus sub pembayaran.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const postTransaksiControl = async (req, res = response) => {
  try {
    const tanggalBayar = new Date();
    const { _id, idSub, idSiswa, bayar } = req.body;
    const payload = {
      transaksi: {
        idSub,
        idSiswa,
        bayar,
        tanggalBayar: tanggalBayar.toISOString()
      }
    };

    if (bayar < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Bayar tidak boleh 0.'
      });
    }
    const pembayaranService = new PembayaranService(_id);
    const transaksiPerSiswadanSub =
      await pembayaranService.totalTransaksiPerSubDanSiswa(idSub, idSiswa);
    const { totalTransaksi } = transaksiPerSiswadanSub;
    const totalBayarDanTransaksi = bayar + totalTransaksi;
    const totalSubBayar = await pembayaranService.totalSubBayar(idSub);
    const siswa = await SiswaService.lihatSiswa({ id: idSiswa });
    const subBayar = await PembayaranService.sLihatSubBayarById(idSub);
    // console.log(transaksiPerSiswadanSub);
    if (!totalSubBayar) {
      return res.status(400).json({
        status: 'error',
        message: 'Sub pembayaran tidak cocok dengan master pembayaran'
      });
    }
    // validasi siswa
    if (!siswa.length) {
      return res.status(404).json({
        status: 'error',
        message: 'Id siswa tidak diketahui.'
      });
    }
    //validasi subBayar
    if (!subBayar) {
      return res.status(404).json({
        status: 'error',
        message: 'Id sub pembayaran tidak diketahui.'
      });
    }

    //validasi lunas
    if (totalSubBayar === totalTransaksi) {
      return res.status(400).json({
        status: 'error',
        message: 'Sub pembayaran sudah lunas'
      });
    }
    if (totalSubBayar < totalBayarDanTransaksi) {
      return res.status(400).json({
        status: 'error',
        message: 'Jumlah bayar melebihi jumlah sub pembayaran.'
      });
    }

    const data = await pembayaranService.tambahTransaksi(payload);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Id pembayaran tidak ditemukan.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menambahkan transaksi.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const deleteTransaksiControl = async (req, res = response) => {
  try {
    const { _id } = req.params;
    const data = await PembayaranService.sHapusTransaksi(_id);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Id transaksi tidak ditemukan.'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Berhasil menghapus transaksi.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const play = async (req, res = response) => {
  try {
    const payload = req.query;
    const play = await PembayaranService.sLihatTanggal(
      payload.startDate,
      payload.endDate
    );
    // console.log(play);
    return res.status(200).json({
      status: 'success',
      message: `Playground. jskjskjg`,
      play
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
      play
    });
  }
};

export const getTotalPembayaranId = async (req, res = response) => {
  try {
    const { _id } = req.params;

    const pembayaranService = new PembayaranService(_id);
    const totalTransaksiPembayaran =
      await pembayaranService.totalTransaksiPembayaran();
    if (!totalTransaksiPembayaran.totalTransaksi) {
      return res.status(400).json({
        status: 'success',
        message: 'Pembayaran belum ada transaksi.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Berhasil memuat data pembayaran',
      data: totalTransaksiPembayaran
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
