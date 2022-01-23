import { siswaMongo } from '../libs/dbConnect.js';
import { nanoid } from 'nanoid';
import PembayaranService from './PembayaranService.js';

export default class SiswaService {
  constructor(id) {
    this.id = id;
  }

  static async tambahSiswa({
    nisn,
    nis,
    nama,
    kotaLahir,
    tanggalLahir,
    tahunPelajaran
  }) {
    const id = nanoid(12);
    const siswaBaru = siswaMongo({
      id,
      nisn,
      nis,
      nama,
      kotaLahir,
      tanggalLahir,
      tahunPelajaran
    });
    const result = await siswaBaru.save();

    return result;
  }

  static async lihatSiswa(content) {
    const result = await siswaMongo.find(content);

    return result;
  }

  static async lihatSemuaSiswa() {
    const result = await siswaMongo.find();

    return result;
  }

  static async lihatSemuaSiswaTahun(tahun) {
    try {
      const result = await siswaMongo.aggregate([
        // De-normalize arrays (mengeluarkan sub dokumen menjadi mandiri)
        { $unwind: '$kelas' },
        {
          $match: {
            'kelas.tahunPelajaran': tahun
          }
        }
      ]);
      return result;
    } catch (error) {}
  }

  static async hapusBanyak(data) {
    const result = await Promise.all(
      data.map(async (item) => {
        const deleteData = await siswaMongo.deleteOne({ id: item.id });

        return deleteData.deletedCount;
      })
    );
    return result.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
  }

  static async hapusBanyakKelas(data) {
    // console.log(data);
    const result = await Promise.all(
      data.map(async (item) => {
        const cekTransaksiSiswaDanSub =
          await PembayaranService.sLihatTransaksiSiswaByKelas(
            item.kelas.idKelas,
            item.id
          );
        if (!cekTransaksiSiswaDanSub) {
          const result = await siswaMongo.findOneAndUpdate(
            { id: item.id, 'kelas.tahunPelajaran': item.kelas.tahunPelajaran },
            { $pull: { kelas: item.kelas } }
          );
          return result;
        }
      })
    );
    const resultMap = result.map((x) => {
      let berhasil = 0;
      let gagal = 0;
      if (!x) {
        gagal++;
      } else {
        berhasil++;
      }
      return { gagal, berhasil };
    });
    return resultMap.reduce((a, b) => ({
      gagal: a.gagal + b.gagal,
      berhasil: a.berhasil + b.berhasil
    }));
  }

  static async lihatKelasEksisSiswa(id) {
    const result = await siswaMongo.find({
      'kelas.idKelas': id
    });

    return result;
  }

  static async lihatTpEksisSiswa(tp) {
    const result = await siswaMongo.find({
      'kelas.tahunPelajaran': tp
    });

    return result;
  }

  async lihatSiswaId() {
    const result = await siswaMongo.find({ id: this.id });

    return result;
  }

  async editSiswa({
    nisn,
    nis,
    nama,
    kotaLahir,
    tanggalLahir,
    tahunPelajaran
  }) {
    const result = await siswaMongo.findOneAndUpdate(
      { id: this.id },
      { $set: { nisn, nis, nama, kotaLahir, tanggalLahir, tahunPelajaran } }
    );

    return result;
  }

  async editKelas(idKelasSekarang, kelas) {
    const result = await siswaMongo.findOneAndUpdate(
      { id: this.id, 'kelas.idKelas': idKelasSekarang },
      {
        $set: {
          'kelas.$': kelas
        }
      }
    );
    return result;
  }

  async hapusSiswa() {
    const result = await siswaMongo.deleteOne({ id: this.id });

    return result;
  }

  async tambahKelas(kelas) {
    const result = await siswaMongo.findOneAndUpdate(
      { id: this.id },
      { $push: { kelas } }
    );

    return result;
  }

  async hapusKelas(kelas) {
    const result = await siswaMongo.findOneAndUpdate(
      { id: this.id, 'kelas.tahunPelajaran': kelas.tahunPelajaran },
      { $pull: { kelas } }
    );

    return result;
  }

  async lihatKelasSiswaId(kelas) {
    const result = await siswaMongo.find({
      id: this.id,
      'kelas.idKelas': kelas.idKelas
    });

    return result;
  }

  async lihatKelasSiswaTp(kelas) {
    const result = await siswaMongo.find({
      id: this.id,
      'kelas.tahunPelajaran': kelas.tahunPelajaran
    });

    return result;
  }

  static async lihatSiswaTahun(tahunPelajaran) {
    try {
      const result = await siswaMongo.find({
        'kelas.tahunPelajaran': tahunPelajaran
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async sLihatTanggal(startDate, endDate) {
    try {
      const result = await siswaMongo.find({
        tanggalLahir: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async insertMany(data) {
    try {
      const result = await siswaMongo.insertMany(data);

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
