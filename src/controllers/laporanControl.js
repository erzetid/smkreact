import SiswaService from '../services/SiswaService.js';
import PembayaranService from '../services/PembayaranService.js';
import Classess from '../services/Classes.js';
import SekolahService from '../services/SekolahService.js';

const sekolahService = new SekolahService();
const sekolahClass = await sekolahService.lihat();
const sekolah = sekolahClass[0];

export const getControl = async (_req, res = response) => {
  try {
    const classesService = new Classess();
    const dataPembayaran = await PembayaranService.lihatSemuaPembayaran();
    const kelass = await classesService.getAllClass();
    const siswas = await SiswaService.lihatSemuaSiswa();
    const newDate = new Date();
    const tanggal = newDate.toISOString();

    const getNamaKelas = (_id) => {
      const kelas = kelass.filter((item) => {
        return item.id === _id;
      });
      if (kelas.length) return kelas[0].name;
    };

    const getNamaSiswa = (_id) => {
      const siswa = siswas.filter((item) => {
        return item.id === _id;
      });
      if (siswa.length) return siswa[0].nama;
    };
    const data = await Promise.all(
      dataPembayaran.map(async (x) => {
        const {
          _id,
          namaPembayaran,
          tahunPelajaran,
          idKelas,
          subBayar,
          transaksi: transaksiSiswa
        } = x;
        const _pembayaranService = new PembayaranService(_id);
        const { totalTransaksi } =
          await _pembayaranService.totalTransaksiPembayaran();
        const kelas = getNamaKelas(idKelas);
        const getNamaSub = (id) => {
          const result = subBayar.filter((item) => {
            return item._id.toString() === id;
          });

          return result[0].namaSub;
        };
        const transaksi = transaksiSiswa.map((item) => {
          const { _id, idSub, idSiswa, bayar, tanggalBayar } = item;
          const namaSub = getNamaSub(idSub);
          const namaSiswa = getNamaSiswa(idSiswa);
          return { _id, namaSub, namaSiswa, bayar, tanggalBayar };
        });
        return {
          sekolah,
          _id,
          tanggal,
          namaPembayaran,
          tahunPelajaran,
          kelas,
          totalTransaksi,
          transaksi
        };
      })
    );
    if (!data.length) {
      return res.status(400).json({
        status: 'success',
        message: `Data masih kosong.`
      });
    }
    res.status(200).json({ status: 'success', message: 'Laporan', data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getControlByIdAndSiswa = async (req, res = response) => {
  try {
    const { _id, idSiswa } = req.query;
    const classesService = new Classess();
    const pembayaranService = new PembayaranService(_id);
    const dataPembayaran = await pembayaranService.lihatPembayaranId();
    const kelass = await classesService.getAllClass();
    const siswas = await SiswaService.lihatSemuaSiswa();
    const newDate = new Date();
    const tanggal = newDate.toISOString();

    const getNamaKelas = (_id) => {
      const kelas = kelass.filter((item) => {
        return item.id === _id;
      });
      if (kelas.length) return kelas[0].name;
    };

    const getNamaSiswa = (_id) => {
      const siswa = siswas.filter((item) => {
        return item.id === _id;
      });
      if (siswa.length) return siswa[0].nama;
    };
    const data = await Promise.all(
      dataPembayaran.map((x) => {
        const {
          _id,
          namaPembayaran,
          tahunPelajaran,
          idKelas,
          subBayar,
          transaksi
        } = x;

        const kelas = getNamaKelas(idKelas);
        const getNamaSub = (id) => {
          const result = subBayar.filter((item) => {
            return item._id.toString() === id;
          });

          return result[0].namaSub;
        };
        const transaksiSiswa = transaksi.filter((item) => {
          return item.idSiswa === idSiswa;
        });
        const namaSiswa = getNamaSiswa(idSiswa);
        const riwayatTransaksi = transaksiSiswa.map((item) => {
          const { _id, idSub, bayar, tanggalBayar } = item;
          const namaSub = getNamaSub(idSub);
          return { bayar, namaSub, tanggalBayar };
        });
        let totalTransaksi = 0;
        if (transaksiSiswa.length) {
          totalTransaksi = transaksiSiswa[0].bayar;
          if (transaksiSiswa.length > 1) {
            totalTransaksi = transaksiSiswa.reduce((a, b) => a.bayar + b.bayar);
          }
          return {
            sekolah,
            _id,
            tanggal,
            namaPembayaran,
            tahunPelajaran,
            kelas,
            namaSiswa,
            totalTransaksi,
            riwayatTransaksi
          };
        }
        return res.status(400).json({
          status: 'success',
          message: `Transaksi siswa tidak ditemukan.`
        });
      })
    );
    if (!data.length) {
      return res.status(400).json({
        status: 'success',
        message: `Id pembayaran tidak ditemukan.`
      });
    }
    res.status(200).json({ status: 'success', message: 'Laporan', data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getControlById = async (req, res = response) => {
  try {
    const { _id } = req.query;
    const classesService = new Classess();
    const pembayaranService = new PembayaranService(_id);
    const dataPembayaran = await pembayaranService.lihatPembayaranId();
    const kelass = await classesService.getAllClass();
    const siswas = await SiswaService.lihatSemuaSiswa();
    const newDate = new Date();
    const tanggal = newDate.toISOString();

    const getNamaKelas = (_id) => {
      const kelas = kelass.filter((item) => {
        return item.id === _id;
      });
      if (kelas.length) return kelas[0].name;
    };

    const getNamaSiswa = (_id) => {
      const siswa = siswas.filter((item) => {
        return item.id === _id;
      });
      if (siswa.length) return siswa[0].nama;
    };
    const data = await Promise.all(
      dataPembayaran.map(async (x) => {
        const {
          _id,
          namaPembayaran,
          tahunPelajaran,
          idKelas,
          subBayar,
          transaksi: transaksiSiswa
        } = x;
        const _pembayaranService = new PembayaranService(_id);
        const { totalTransaksi } =
          await _pembayaranService.totalTransaksiPembayaran();
        const kelas = getNamaKelas(idKelas);
        const getNamaSub = (id) => {
          const result = subBayar.filter((item) => {
            return item._id.toString() === id;
          });

          return result[0].namaSub;
        };
        const transaksi = transaksiSiswa.map((item) => {
          const { _id, idSub, idSiswa, bayar, tanggalBayar } = item;
          const namaSub = getNamaSub(idSub);
          const namaSiswa = getNamaSiswa(idSiswa);
          return { _id, namaSub, namaSiswa, bayar, tanggalBayar };
        });
        return {
          sekolah,
          _id,
          tanggal,
          namaPembayaran,
          tahunPelajaran,
          kelas,
          totalTransaksi,
          transaksi
        };
      })
    );
    if (!data.length) {
      return res.status(400).json({
        status: 'success',
        message: `Id pembayaran tidak ditemukan.`
      });
    }
    res.status(200).json({ status: 'success', message: 'Laporan', data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getControlByTanggal = async (req, res = response) => {
  try {
    const payload = req.query;
    const data = await PembayaranService.sLihatTanggal(
      payload.startDate,
      payload.endDate
    );
    res.status(200).json({
      status: 'success',
      message: 'Laporan berhasil dimuat.',
      data: { sekolah, ...data[0] }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
      data
    });
  }
};

export const getControlByIdAndTanggal = async (req, res = response) => {
  try {
    const payload = req.query;
    const classesService = new Classess();
    const kelass = await classesService.getAllClass();
    const siswas = await SiswaService.lihatSemuaSiswa();
    const pembayaranService = new PembayaranService(payload._id);
    const dataPembayaran = await pembayaranService.lihatPembayaranId();

    const getNamaKelas = (id) => {
      const kelas = kelass.filter((item) => {
        return item.id === id;
      });
      if (kelas.length) return kelas[0].name;
    };

    const getNamaSiswa = (idSiswa) => {
      const siswa = siswas.filter((item) => {
        return item.id === idSiswa;
      });
      if (siswa.length) return siswa[0].nama;
    };

    const getNamaSub = (idSub) => {
      const subBayar = dataPembayaran[0].subBayar.filter((item) => {
        return item.id === idSub;
      });
      if (subBayar.length) return subBayar[0].namaSub;
    };

    const dataArr = await PembayaranService.sLihatByIdTanggal(
      payload._id,
      payload.startDate,
      payload.endDate
    );

    const data = dataArr.map((item) => {
      const kelas = getNamaKelas(item.idKelas);
      const transaksi = item.transaksi.map((x) => {
        const namaSiswa = getNamaSiswa(x.siswa);
        const namaSub = getNamaSub(x.idSub);
        const _data = { ...x, namaSub, namaSiswa };
        return _data;
      });
      const _data = { sekolah, ...item, kelas, transaksi };
      return _data;
    });

    res
      .status(200)
      .json({ status: 'success', message: 'Laporan berhasil dimuat.', data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getDashboard = async (req, res = response) => {
  try {
    const { tahunPelajaran } = req.query;
    const siswaTahunIni = await SiswaService.lihatSemuaSiswaTahun(
      tahunPelajaran
    );
    const siswas = await SiswaService.lihatSemuaSiswa();
    const semuaSiswa = await SiswaService.lihatSemuaSiswa();
    const semuaTransaksi = await PembayaranService.totalSemuaTransaksi();
    const transaksiBulanini =
      await PembayaranService.totalSemuaTransaksiBulanIni();
    const dataTransaksi = await PembayaranService.lihatSemuaTransaksiTerakhir();
    const getNamaSiswa = (_id) => {
      const siswa = siswas.filter((item) => {
        return item.id === _id;
      });
      if (siswa.length) return siswa[0].nama;
    };
    if (!dataTransaksi.length) {
      return res.status(200).json({
        status: 'success',
        message: 'Laporan berhasil dimuat.',
        data: {
          semuaTransaksi,
          transaksiBulanini,
          semuaSiswa: semuaSiswa.length,
          siswaTahunIni: siswaTahunIni.length,
          transaksi: null
        }
      });
    }
    const transaksi = await Promise.all(
      dataTransaksi[0].transaksi.map(async (x) => {
        const { idSiswa, bayar, tanggalBayar } = x;
        const namaSiswa = getNamaSiswa(idSiswa);
        const tanggal = new Date(tanggalBayar).toLocaleDateString();
        return {
          namaSiswa,
          bayar,
          tanggal
        };
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'Laporan berhasil dimuat.',
      data: {
        semuaTransaksi,
        transaksiBulanini,
        semuaSiswa: semuaSiswa.length,
        siswaTahunIni: siswaTahunIni.length,
        transaksi
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
      data
    });
  }
};
export const getBar = async (req, res = response) => {
  try {
    const { selectTahun } = req.query;
    const tahun = (tahun = new Date().getFullYear()) => {
      var date = new Date(tahun, 0, 1);
      var months = [];
      for (var i = 0; i < 12; i++) {
        const startDate = new Date(date.getFullYear(), date.getMonth() + i, 1);
        const endDate = new Date(
          date.getFullYear(),
          date.getMonth() + 1 + i,
          0
        );
        const bulan = { startDate, endDate };
        months.push(bulan);
      }
      return months;
    };
    const bar = await Promise.all(
      tahun(selectTahun).map(async (item) => {
        const data = await PembayaranService.sLihatTanggal(
          item.startDate,
          item.endDate
        );
        if (!data.length) {
          return 0;
        }
        return data[0].totalTransaksi;
      })
    );

    res.status(200).json({
      status: 'success',
      message: 'Laporan berhasil dimuat.',
      bar
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request',
      data
    });
  }
};
