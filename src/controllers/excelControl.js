import SiswaService from '../services/SiswaService.js';
import PembayaranService from '../services/PembayaranService.js';
import excelJS from 'exceljs';
import path from 'path';
import ClassesService from '../services/Classes.js';
import SekolahService from '../services/SekolahService.js';
import { formatRp } from '../libs/formatRp.js';

export const excel = async (req, res = response) => {
  // Definisikan data
  // Sample data
  const User = [
    {
      fname: 'Amir',
      lname: 'Mustafa',
      email: 'amir@gmail.com',
      gender: 'Male'
    },
    {
      fname: 'Ashwani',
      lname: 'Kumar',
      email: 'ashwani@gmail.com',
      gender: 'Male'
    },
    {
      fname: 'Nupur',
      lname: 'Shah',
      email: 'nupur@gmail.com',
      gender: 'Female'
    },
    {
      fname: 'Himanshu',
      lname: 'Mewari',
      email: 'himanshu@gmail.com',
      gender: 'Male'
    },
    {
      fname: 'Vankayala',
      lname: 'Sirisha',
      email: 'sirisha@gmail.com',
      gender: 'Female'
    }
  ];

  const workbook = new excelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet('Kelas'); // New Worksheet
  const paths = path.join(path.resolve(), './src/downloads'); // Path to download excel
  // Column for data in excel. key must match data key
  worksheet.columns = [
    { header: 'S no.', key: 's_no', width: 10 },
    { header: 'First Name', key: 'fname', width: 10 },
    { header: 'Last Name', key: 'lname', width: 10 },
    { header: 'Email Id', key: 'email', width: 10 },
    { header: 'Gender', key: 'gender', width: 10 }
  ];
  // Looping through User data
  let counter = 1;
  User.forEach((user) => {
    user.s_no = counter;
    worksheet.addRow(user); // Add data in worksheet
    counter++;
  });
  // Making first line in excel bold
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });
  try {
    await workbook.xlsx.writeFile(`${paths}/users.xlsx`).then(() => {
      res.download(`${paths}/users.xlsx`);
    });
  } catch (err) {
    console.log(err);

    res.send({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

export const excelSiswa = async (req, res = response) => {
  try {
    const { idSiswa, idPembayaran } = req.query;
    const siswaService = new SiswaService(idSiswa);
    const siswa = await siswaService.lihatSiswaId();
    if (!siswa.length) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Siswa tidak ditemukan' });
    }

    const pembayaranService = new PembayaranService(idPembayaran);
    const pembayaran = await pembayaranService.lihatPembayaranId();
    if (!pembayaran.length) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Pembayaran tidak ditemukan' });
    }

    const kelas = await ClassesService.sGetAllClass();
    const getNamaKelas = (_id) => {
      const _kelas = kelas.filter((item) => {
        return item.id === _id;
      });
      if (_kelas.length) return _kelas[0].name;
    };

    const sekolah = await SekolahService.sLihat();

    const data = pembayaran.map((item) => {
      const { namaPembayaran, transaksi, tahunPelajaran, idKelas, subBayar } =
        item;
      const kelas = getNamaKelas(idKelas);

      const riwayat = subBayar.map((x) => {
        const _filterTransaksi = transaksi.filter(
          (f) => f.idSiswa === siswa[0].id && f.idSub === x._id.toString()
        );
        const _transaksi = _filterTransaksi.map((x) => {
          const { bayar, tanggalBayar } = x;
          return {
            bayar: formatRp(bayar),
            tanggalBayar: tanggalBayar.toLocaleDateString()
          };
        });
        let totalDibayar = 0;
        if (_filterTransaksi.length) {
          totalDibayar = _filterTransaksi[0].bayar;
          if (_filterTransaksi.length > 1) {
            const jumlahTransaksi = _filterTransaksi.reduce((a, b) => ({
              bayar: a.bayar + b.bayar
            }));
            totalDibayar = jumlahTransaksi.bayar;
          }
        }
        return {
          namaSub: x.namaSub,
          jumlah: formatRp(x.total),
          _transaksi,
          totalDibayar: formatRp(totalDibayar)
        };
      });

      const filterTransaksi = transaksi.filter(
        (f) => f.idSiswa === siswa[0].id
      );
      let keterangan = 'Belum lunas';
      let totalDibayar = 0;
      if (filterTransaksi.length) {
        totalDibayar = filterTransaksi[0].bayar;
        if (filterTransaksi.length > 1) {
          const jumlahTransaksi = filterTransaksi.reduce((a, b) => ({
            bayar: a.bayar + b.bayar
          }));
          totalDibayar = jumlahTransaksi.bayar;
        }
      }

      let totalSubBayar = 0;
      if (subBayar.length) {
        totalSubBayar = subBayar[0].total;
        if (subBayar.length > 1) {
          const _totalSubBayar = subBayar.reduce((a, b) => ({
            total: a.total + b.total
          }));
          totalSubBayar = _totalSubBayar.total;
        }
      }

      if (totalDibayar >= totalSubBayar) {
        keterangan = 'Lunas';
      }

      return {
        namaSiswa: siswa[0].nama,
        tahunPelajaran,
        kelas,
        namaPembayaran,
        keterangan,
        riwayat,
        totalDibayar: formatRp(totalDibayar),
        totalSubBayar: formatRp(totalSubBayar)
      };
    });

    if (data[0].kelas === undefined) {
      data[0].kelas = '';
    }
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet(siswa[0].nama); // New Worksheet
    const paths = path.join(path.resolve(), './src/downloads'); // Path to download excel
    worksheet.columns = [
      { header: 'Jenis Pembayaran', key: 'namaSub', width: 20 },
      { header: 'Jumlah', key: 'jumlah', width: 16 },
      { header: 'Terbayar', key: 'totalDibayar', width: 16 },
      { key: 'bayar', width: 16 },
      { key: 'tanggalBayar', width: 15 }
    ];

    worksheet.getRow(1).values = ['', '', ''];
    worksheet.getRow(1).values = [
      'Nama Sekolah',
      `: ${sekolah[0].namaSekolah}`
    ];
    worksheet.getRow(2).values = ['Nama Siswa', `: ${data[0].namaSiswa}`];
    worksheet.getRow(3).values = ['Kelas', `: ${data[0].kelas}`];
    worksheet.getRow(4).values = [
      'Tahun Pelajaran',
      `: ${data[0].tahunPelajaran}`
    ];
    worksheet.getRow(5).values = [
      'Nama Pembayaran',
      `: ${data[0].namaPembayaran}`
    ];
    worksheet.getRow(6).values = ['Keterangan', `: ${data[0].keterangan}`];

    worksheet.getRow(8).values = ['Jenis Pembayaran', 'Jumlah', 'Terbayar'];

    data[0].riwayat.forEach((_r) => {
      worksheet.addRow(_r); // Add data in worksheet
      _r = _r._transaksi.forEach((_t) => {
        worksheet.addRow(_t);
      });
    });

    worksheet.mergeCells('D8:E8');
    worksheet.getCell('D8:E8').value = 'Riwayat';
    worksheet.getCell('D8:E8').alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.getCell('D9').value = 'Jumlah';
    worksheet.getCell('E9').value = 'Tanggal';
    worksheet.getCell('D9').alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.getCell('E9').alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.getRow(8).eachCell((cell) => {
      cell.font = { bold: true };
    });
    worksheet.addRow();
    worksheet.addRow({
      namaSub: 'Total',
      jumlah: data[0].totalSubBayar,
      totalDibayar: data[0].totalDibayar
    });
    worksheet.mergeCells(`C${worksheet.rowCount}:E${worksheet.rowCount}`);
    worksheet.addRow();
    worksheet.addRow({
      bayar: `Brebes, ${new Date().toLocaleDateString()}`
    });
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow({
      bayar: sekolah[0].kepsek
    });
    await workbook.xlsx.writeFile(`${paths}/pembayaran-siswa.xlsx`).then(() => {
      res.download(`${paths}/pembayaran-siswa.xlsx`);
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

export const excelPembayaran = async (req, res = response) => {
  try {
    const { idPembayaran } = req.query;
    const pembayaranService = new PembayaranService(idPembayaran);
    const pembayaran = await pembayaranService.lihatPembayaranId();
    if (!pembayaran.length) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Pembayaran tidak ditemukan' });
    }

    let siswaBayar = [];
    const { idKelas, tahunPelajaran, namaPembayaran, subBayar } = pembayaran[0];
    if (idKelas === 'all') {
      const siswaService = await SiswaService.lihatSiswa({ tahunPelajaran });
      siswaBayar = siswaService;
    } else {
      const siswaService = await SiswaService.lihatSiswa({
        'kelas.tahunPelajaran': tahunPelajaran,
        'kelas.idKelas': idKelas
      });
      siswaBayar = siswaService;
    }
    if (!siswaBayar.length) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Siswa tidak ditemukan' });
    }
    const kelas = await ClassesService.sGetAllClass();
    const getNamaKelas = (_id) => {
      const _kelas = kelas.filter((item) => {
        return item.id === _id;
      });
      if (_kelas.length) return _kelas[0].name;
    };

    let totalSubBayar = 0;
    if (pembayaran[0].subBayar.length) {
      totalSubBayar = pembayaran[0].subBayar[0].total;
      if (pembayaran[0].subBayar.length > 1) {
        const _totalSubBayar = pembayaran[0].subBayar.reduce((a, b) => ({
          total: a.total + b.total
        }));
        totalSubBayar = _totalSubBayar.total;
      }
    }

    const siswa = siswaBayar.map((item) => {
      const { id, nama, nis, nisn } = item;
      const filterTransaksi = pembayaran[0].transaksi.filter(
        (f) => f.idSiswa === id
      );
      let keterangan = 'Belum lunas';
      let totalDibayar = 0;
      if (filterTransaksi.length) {
        totalDibayar = filterTransaksi[0].bayar;
        if (filterTransaksi.length > 1) {
          const jumlahTransaksi = filterTransaksi.reduce((a, b) => ({
            bayar: a.bayar + b.bayar
          }));
          totalDibayar = jumlahTransaksi.bayar;
        }
      }

      if (totalDibayar >= totalSubBayar) {
        keterangan = 'Lunas';
      }
      let kekurangan = totalSubBayar - totalDibayar;
      if (kekurangan === 0) {
        kekurangan = `${formatRp(kekurangan)}`;
      } else {
        kekurangan = `- ${formatRp(kekurangan)}`;
      }
      return {
        nama,
        nis,
        nisn,
        totalDibayar: formatRp(totalDibayar),
        kekurangan,
        keterangan
      };
    });

    const data = {
      namaPembayaran,
      kelas: getNamaKelas(idKelas),
      tahunPelajaran,
      subBayar,
      totalSubBayar,
      siswa
    };

    // Esport downloads
    const sekolah = await SekolahService.sLihat();
    const workbook = new excelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet(namaPembayaran); // New Worksheet
    const paths = path.join(path.resolve(), './src/downloads'); // Path to download excel
    worksheet.columns = [
      { header: 'No', key: 's_no', width: 5 },
      { header: 'NIS', key: 'nis', width: 12 },
      { header: 'NISN', key: 'nisn', width: 10 },
      { header: 'Nama', key: 'nama', width: 25 },
      { header: 'Terbayar', key: 'totalDibayar', width: 16 },
      { header: 'Kekurangan', key: 'kekurangan', width: 16 },
      { header: 'Keterangan', key: 'keterangan', width: 12 }
    ];

    // return console.log(data);
    worksheet.getRow(1).values = ['', '', '', '', '', '', ''];
    worksheet.getRow(1).values = [
      'Nama Sekolah',
      '',
      `: ${sekolah[0].namaSekolah}`
    ];
    if (data.kelas === undefined) {
      data.kelas = '';
    }
    worksheet.getRow(2).values = ['Kelas', '', `: ${data.kelas}`];
    worksheet.getRow(3).values = ['Tahun Pelajaran', '', `: ${tahunPelajaran}`];
    worksheet.getRow(4).values = ['Nama Pembayaran', '', `: ${namaPembayaran}`];

    worksheet.getRow(6).values = [
      'No',
      'NIS',
      'NISN',
      'Nama',
      'Terbayar',
      'Kekurangan',
      'Keterangan'
    ];
    worksheet.getRow(6).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });
    let counter = 1;
    data.siswa.forEach((_r) => {
      _r.s_no = counter;
      worksheet.addRow(_r);
      counter++;
    });
    worksheet.addRow();
    worksheet.addRow({ s_no: 'Sub Pembayaran :' });
    data.subBayar.forEach((_s) => {
      worksheet.addRow({ nisn: _s.namaSub });
    });
    worksheet.addRow();
    worksheet.addRow({
      kekurangan: `Brebes, ${new Date().toLocaleDateString()}`
    });
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow();
    worksheet.addRow({
      kekurangan: sekolah[0].kepsek
    });
    await workbook.xlsx.writeFile(`${paths}/pembayaran.xlsx`).then(() => {
      res.download(`${paths}/pembayaran.xlsx`);
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};
