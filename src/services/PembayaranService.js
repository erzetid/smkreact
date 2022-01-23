import { ObjectId, pembayaranMongo } from '../libs/dbConnect.js';

export default class PembayaranService {
  constructor(id) {
    this._id = id;
  }

  static async tambahPembayaran(payload) {
    const pembayaran = pembayaranMongo(payload);
    const result = await pembayaran.save();

    return result;
  }

  static async lihatSemuaPembayaran() {
    const result = pembayaranMongo.find();
    return result;
  }

  static async lihatPembayaran(payload) {
    try {
      const result = await pembayaranMongo.find({ ...payload });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async lihatPembayaranById() {
    const result = pembayaranMongo.findOne({ _id: this._id });
    return result;
  }

  async lihatPembayaranId() {
    const result = pembayaranMongo.find({ _id: this._id });
    return result;
  }

  static async sHapusPembayaranById(_id) {
    const result = pembayaranMongo.deleteOne({ _id });
    return result;
  }

  async hapusPembayaranById() {
    const result = pembayaranMongo.deleteOne({ _id: this._id });
    return result;
  }

  async editPembayaran(pembayaran) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { _id: this._id },
      { $set: pembayaran }
    );

    return result;
  }

  async tambahSubBayar(subBayar) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { _id: this._id },
      { $push: subBayar }
    );

    return result;
  }

  static async sEditSubBayar(subBayar) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { 'subBayar._id': subBayar._id },
      {
        $set: {
          'subBayar.$': subBayar
        }
      }
    );
    return result;
  }

  static async sHapusSubBayar(_id) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { 'subBayar._id': _id },
      { $pull: { subBayar: { _id } } }
    );
    return result;
  }

  static async sLihatSubBayarById(_id) {
    const result = await pembayaranMongo.findOne({ 'subBayar._id': _id });
    return result;
  }
  static async sLihatSubBayarDiTransaksi(_id) {
    const result = await pembayaranMongo.findOne({ 'transaksi.idSub': _id });
    return result;
  }

  async tambahTransaksi(transaksi) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { _id: this._id },
      { $push: transaksi }
    );

    return result;
  }

  static async sHapusTransaksi(_id) {
    const result = await pembayaranMongo.findOneAndUpdate(
      { 'transaksi._id': _id },
      { $pull: { transaksi: { _id } } }
    );
    return result;
  }

  async totalSubBayar(idSub) {
    try {
      const pembayaran = await pembayaranMongo.findOne({
        _id: this._id,
        'subBayar._id': idSub
      });

      if (pembayaran) {
        const result = await pembayaran.subBayar.filter((item) => {
          return item._id.toString() === idSub;
        });

        return result[0].total;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async totalTransaksiPerSubDanSiswa(idSub, idSiswa) {
    try {
      const result = await pembayaranMongo.aggregate([
        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$transaksi' },

        // Match again to filter the array elements
        {
          $match: {
            'transaksi.idSub': idSub,
            'transaksi.idSiswa': idSiswa
          }
        },

        // Group on the "_id" for the "key" you want, or "null" for all
        {
          $group: {
            _id: null,
            totalTransaksi: { $sum: '$transaksi.bayar' }
          }
        }
      ]);
      if (!result.length) {
        return { totalTransaksi: 0 };
      }
      return result[0];
    } catch (error) {
      console.log(error);
    }
  }

  async totalTransaksiPembayaran() {
    try {
      const result = await pembayaranMongo.aggregate([
        { $match: { _id: ObjectId(this._id) } },

        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$transaksi' },
        // Group on the "_id" for the "key" you want, or "null" for all
        {
          $group: {
            _id: this._id,
            totalTransaksi: { $sum: '$transaksi.bayar' },
            obj: { $push: '$namaPembayaran' }
          }
        }
      ]);
      if (!result.length) {
        return { totalTransaksi: 0 };
      }
      return {
        _id: this._id,
        totalTransaksi: result[0].totalTransaksi,
        namaPembayaran: result[0].obj[0]
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async totalSemuaTransaksi() {
    try {
      const result = await pembayaranMongo.aggregate([
        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$transaksi' },
        // Group on the "_id" for the "key" you want, or "null" for all
        {
          $group: {
            _id: this._id,
            totalTransaksi: { $sum: '$transaksi.bayar' }
          }
        }
      ]);
      if (!result.length) {
        return 0;
      }
      return result[0].totalTransaksi;
    } catch (error) {
      console.log(error);
    }
  }

  static async totalSemuaTransaksiBulanIni() {
    try {
      const date = new Date();
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const result = await pembayaranMongo.aggregate([
        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$transaksi' },
        {
          $match: {
            'transaksi.tanggalBayar': {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: this._id,
            totalTransaksi: { $sum: '$transaksi.bayar' }
          }
        }
      ]);
      if (!result.length) {
        return 0;
      }
      return result[0].totalTransaksi;
    } catch (error) {
      console.log(error);
    }
  }

  async totalTransaksiSubPembayaran(idSub) {
    try {
      const result = await pembayaranMongo.aggregate([
        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$transaksi' },
        // Group on the "_id" for the "key" you want, or "null" for all
        {
          $match: {
            'transaksi.idSub': idSub
          }
        },
        {
          $group: {
            _id: this._id,
            totalTransaksi: { $sum: '$transaksi.bayar' },
            obj: { $push: '$namaPembayaran' }
          }
        }
      ]);
      if (!result.length) {
        return { totalTransaksi: 0 };
      }
      return {
        _id: this._id,
        totalTransaksi: result[0].totalTransaksi,
        namaPembayaran: result[0].obj[0]
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatTransaksiSiswaByKelas(idKelas, idSiswa) {
    try {
      const result = await pembayaranMongo.findOne({
        idKelas,
        'transaksi.idSiswa': idSiswa
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatTransaksiSiswaByTahunMasuk(tahunPelajaran, idSiswa) {
    try {
      const result = await pembayaranMongo.findOne({
        idKelas: 'null',
        tahunPelajaran,
        'transaksi.idSiswa': idSiswa
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatTransaksiSiswaBySub(idSub, idSiswa) {
    try {
      const result = await pembayaranMongo.aggregate([
        { $unwind: '$transaksi' },
        { $match: { 'transaksi.idSub': idSub, 'transaksi.idSiswa': idSiswa } },
        { $project: { transaksi: '$transaksi' } }
      ]);

      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async totalHarusDibayar() {
    //id master pembayaran
    try {
      const result = await pembayaranMongo.aggregate([
        { $match: { _id: ObjectId(this._id) } },
        { $unwind: '$subBayar' },
        {
          $group: {
            _id: false,
            totalsubBayar: { $sum: '$subBayar.total' }
          }
        }
      ]);
      if (!result.length) {
        return 0;
      }
      return result[0].totalsubBayar;
    } catch (error) {
      console.log(error);
    }
  }
  async totalYangDibayar(idSiswa) {
    //id master pembayaran
    try {
      const result = await pembayaranMongo.aggregate([
        { $match: { _id: ObjectId(this._id) } },
        { $unwind: '$transaksi' },
        {
          $match: {
            'transaksi.idSiswa': idSiswa
          }
        },
        {
          $group: {
            _id: false,
            total: { $sum: '$transaksi.bayar' }
          }
        }
      ]);

      if (!result.length) {
        return 0;
      }

      return result[0].total;
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatTanggal(startDate, endDate) {
    try {
      const result = await pembayaranMongo.aggregate([
        { $unwind: '$transaksi' },
        {
          $match: {
            'transaksi.tanggalBayar': {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: false,
            totalTransaksi: { $sum: '$transaksi.bayar' },
            data: {
              $push: {
                namaPembayaran: '$namaPembayaran',
                idKelas: '$idKelas',
                tahunPelajaran: '$tahunPelajaran',
                transaksi: '$transaksi'
              }
            }
          }
        }
      ]);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatByIdTanggal(_id, startDate, endDate) {
    try {
      const result = await pembayaranMongo.aggregate([
        {
          $match: { _id: ObjectId(_id) }
        },
        { $unwind: '$transaksi' },
        {
          $match: {
            'transaksi.tanggalBayar': {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            namaPembayaran: { $first: '$namaPembayaran' },
            idKelas: { $first: '$idKelas' },
            tahunPelajaran: { $first: '$tahunPelajaran' },
            totalTransaksi: { $sum: '$transaksi.bayar' },
            transaksi: { $push: '$transaksi' }
          }
        }
      ]);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async lihatSemuaTransaksiTerakhir() {
    try {
      const result = await pembayaranMongo.aggregate([
        { $unwind: '$transaksi' },
        { $sort: { 'transaksi.tanggalBayar': -1 } },
        { $limit: 10 },
        {
          $group: {
            _id: null,
            transaksi: { $push: '$transaksi' }
          }
        }
      ]);

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
