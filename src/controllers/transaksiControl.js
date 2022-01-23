import SiswaService from '../services/SiswaService.js';
import PembayaranService from '../services/PembayaranService.js';

export const getControlTransaksi = async (req, res = response) => {
  try {
    const payload = req.query;
    const dataArr = await PembayaranService.lihatSemuaPembayaran();
    const transaksiSiswaArr = dataArr.filter((item) => {
      return (
        // tahunPelajaran masuk siswa
        item.tahunPelajaran === payload.tahunPelajaran && item.idKelas === 'all'
      );
    });
    const siswaService = new SiswaService(payload.idSiswa);
    const siswa = await siswaService.lihatSiswaId();

    const filterByKelas = siswa[0].kelas.map((kelasSiswa) => {
      const _p = dataArr.filter((_pembayaran) => {
        return (
          _pembayaran.tahunPelajaran === kelasSiswa.tahunPelajaran &&
          kelasSiswa.idKelas === _pembayaran.idKelas
        );
      });
      return _p;
    });
    const concate = transaksiSiswaArr.concat(filterByKelas[0]);
    let transaksiSiswa = [];
    if (concate[0] !== undefined) {
      transaksiSiswa = concate;
    }

    const data = await Promise.all(
      transaksiSiswa.map(async (x) => {
        if (x) {
          const {
            _id,
            namaPembayaran,
            tahunPelajaran,
            idKelas,
            tanggalPembuatan
          } = x;

          const pembayaranService = new PembayaranService(x._id.toString());
          const totalHarusDibayar = await pembayaranService.totalHarusDibayar();
          const totalYangDibayar = await pembayaranService.totalYangDibayar(
            payload.idSiswa
          );

          const transaksiSiswa = await Promise.all(
            x.subBayar.map(async (item) => {
              const { totalTransaksi } =
                await pembayaranService.totalTransaksiPerSubDanSiswa(
                  item._id.toString(),
                  payload.idSiswa
                );
              const _transaksi = {
                idSiswa: payload.idSiswa,
                idSub: item._id,
                nama: item.namaSub,
                dibayar: totalTransaksi,
                total: item.total,
                kekurangan: item.total - totalTransaksi
              };
              return _transaksi;
            })
          );

          let keterangan = 'Belum lunas';
          if (totalHarusDibayar <= totalYangDibayar) {
            keterangan = 'Lunas';
          }

          const array = {
            _id,
            namaPembayaran,
            tahunPelajaran,
            idKelas,
            tanggalPembuatan,
            transaksiSiswa,
            keterangan
          };
          return array;
        }
      })
    );
    return res.status(200).json({
      status: 'success',
      message: 'Data siswa berhasil dimuat.',
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
export const postControlTransaksi = async (req, res = response) => {
  try {
    const { idSiswa, idSub } = req.body;

    const dataArr = await PembayaranService.sLihatTransaksiSiswaBySub(
      idSub,
      idSiswa
    );

    const payload = await PembayaranService.sLihatSubBayarById(idSub);

    const data = dataArr.map((x) => {
      const _data = x.transaksi;
      _data.idPembayaran = x._id;
      return _data;
    });
    return res.status(200).json({
      status: 'success',
      message: `Data sub pembayaran berhasil dimuat.`,
      data,
      payload: { _id: payload._id, idSiswa, idSub }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const deleteControlTransaksi = async (req, res = response) => {
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
export const getPembayaranByTahun = async (req, res = response) => {
  try {
    const payload = req.query;
    const dataArr = await PembayaranService.lihatPembayaran(payload);
    const data = dataArr.map((x) => {
      const { _id, namaPembayaran, tahunPelajaran, idKelas, tanggalPembuatan } =
        x;
      return {
        _id,
        namaPembayaran,
        tahunPelajaran,
        idKelas,
        tanggalPembuatan
      };
    });

    return res.status(200).json({
      status: 'success',
      message: `Playground.`,
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
