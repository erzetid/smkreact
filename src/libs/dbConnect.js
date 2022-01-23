import mongoose from 'mongoose';
import 'dotenv/config';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose
  .connect(process.env.MONGO, options)
  .then(() => console.log('mongoDB Connected'))
  .catch((err) => console.log(err));

const classesSchema = new mongoose.Schema({
  id: String,
  name: String,
  level: Number,
  major: String
});
const ClassesLevels = mongoose.model('class', classesSchema);

const majorSchema = new mongoose.Schema({
  major: String,
  code: String
});
const majorMongo = mongoose.model('major', majorSchema);

const siswaSchema = new mongoose.Schema({
  id: String,
  nis: String,
  nisn: String,
  nama: String,
  kotaLahir: String,
  tanggalLahir: Date,
  tahunPelajaran: String,
  kelas: [
    {
      idKelas: String,
      tahunPelajaran: String
    }
  ]
});
const siswaMongo = mongoose.model('siswas', siswaSchema);

const pembayaranSchema = new mongoose.Schema({
  namaPembayaran: String,
  tahunPelajaran: String,
  idKelas: String,
  subBayar: [
    {
      namaSub: String,
      total: Number
    }
  ],
  /*
  #info siswa
  1. Tampung id sub
  2. Lalu cari idSub dengan idSiswa
    ---------------------------------------------------------------------
    |Pembayaran 1     | sub 1         | 20.000   | 50.000   |-30.000    |
    |                 | sub 2         | 30.000   | 50.000   |-20.000    |
    |                 | sub 3         | 50.000   | 50.000   |Sub Lunas  |
    ---------------------------------------------------------------------
    |Pembayaran 2     | sub 1         | 20.000   | 50.000   |-30.000    |
    |                 | sub 2         | 30.000   | 50.000   |-20.000    |
    |                 | sub 3         | 50.000   | 50.000   |Sub Lunas  |
    ---------------------------------------------------------------------

  # Report
  */
  transaksi: [
    {
      idSub: String,
      idSiswa: String,
      bayar: Number,
      tanggalBayar: Date
    }
  ],
  tanggalPembuatan: Date
});
const pembayaranMongo = mongoose.model('pembayarans', pembayaranSchema);

const playSchema = new mongoose.Schema({
  tanggal: Date
});
const playMongo = mongoose.model('plays', playSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userModel = mongoose.model('users', userSchema);

const pengaturanSekolahSchema = new mongoose.Schema({
  namaSekolah: String,
  email: String,
  telepon: String,
  alamatSekolah: String,
  tahunPelajaran: [],
  logo: String,
  tahunPelajaranSekarang: String,
  kepsek: String
});
const pengaturanSekolahMongo = mongoose.model(
  'pengaturanSekolahs',
  pengaturanSekolahSchema
);
const ObjectId = mongoose.Types.ObjectId;

export {
  ObjectId,
  ClassesLevels,
  majorMongo,
  siswaMongo,
  pembayaranMongo,
  pengaturanSekolahMongo,
  playMongo,
  userModel
};
