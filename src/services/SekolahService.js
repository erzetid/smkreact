import { pengaturanSekolahMongo } from '../libs/dbConnect.js';

export default class SekolahService {
  async lihat() {
    const result = await pengaturanSekolahMongo.find();
    return result;
  }
  static async sLihat() {
    const result = await pengaturanSekolahMongo.find();
    return result;
  }
  async editSekolah(sekolah) {
    try {
      const cekSekolah = await pengaturanSekolahMongo.find();
      if (cekSekolah.length) {
        const result = await pengaturanSekolahMongo.findOneAndUpdate(
          { _id: sekolah._id },
          { $set: sekolah }
        );

        return result;
      }
      const sekolahMongo = pengaturanSekolahMongo(sekolah);
      const result = await sekolahMongo.save();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async setTpSekolah({ _id, tahunPelajaranSekarang }) {
    try {
      const result = await pengaturanSekolahMongo.findOneAndUpdate(
        { _id },
        { $set: { tahunPelajaranSekarang } }
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async tambahTahunPelajaran({ _id, tahunPelajaran }) {
    const result = await pengaturanSekolahMongo.findOneAndUpdate(
      { _id },
      { $push: { tahunPelajaran } }
    );

    return result;
  }
  async lihatTahunPelajaran(tahunPelajaran) {
    const result = await pengaturanSekolahMongo.find({ tahunPelajaran });
    return result;
  }
  async hapusTahunPelajaran({ _id, tahunPelajaran }) {
    const result = await pengaturanSekolahMongo.findOneAndUpdate(
      { _id },
      { $pull: { tahunPelajaran } }
    );

    return result;
  }
  static async simpan() {
    const data = {
      namaSekolah: '',
      email: '',
      telepon: '',
      alamatSekolah: '',
      tahunPelajaran: [],
      logo: '',
      tahunPelajaranSekarang: ''
    };
    try {
      const newClass = pengaturanSekolahMongo({ ...data });
      const query = await newClass.save();

      return query;
    } catch (error) {
      console.log(error);
    }
  }
}
