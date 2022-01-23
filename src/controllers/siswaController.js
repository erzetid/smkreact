import SiswaService from '../services/SiswaService.js';
import PembayaranService from '../services/PembayaranService.js';
import excelJS from 'exceljs';
import path from 'path';
import { nanoid } from 'nanoid';

export const postControl = async (req, res = response) => {
  try {
    const { nisn, nis } = req.body;
    const cekNisn = await SiswaService.lihatSiswa({ nisn });
    const cekNis = await SiswaService.lihatSiswa({ nis });

    if (cekNisn.length) {
      return res.status(400).json({
        status: 'error',
        message: `NISN ${nisn} sudah dipakai ${cekNisn[0].nama}`
      });
    }
    if (cekNis.length) {
      return res.status(400).json({
        status: 'error',
        message: `NIS ${nis} sudah dipakai ${cekNis[0].nama}`
      });
    }
    const data = await SiswaService.tambahSiswa(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Siswa berhasil ditambahkan.',
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

export const putControl = async (req, res = response) => {
  try {
    const { id, nisn, nis } = req.body;
    const siswaService = new SiswaService(id);
    const cekSiswa = await siswaService.lihatSiswaId();
    const cekNisn = await SiswaService.lihatSiswa({ nisn });
    const cekNis = await SiswaService.lihatSiswa({ nis });
    // console.log(cekNisn.length);
    if (!cekSiswa.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Id siswa tidak ditemukan.'
      });
    }
    if (cekNisn.length) {
      if (cekSiswa[0].nisn !== nisn) {
        return res.status(400).json({
          status: 'error',
          message: `NISN ${nisn} sudah digunakan ${cekNisn[0].nama}.`
        });
      }
    }
    if (cekNis.length) {
      if (cekSiswa[0].nis !== nis) {
        return res.status(400).json({
          status: 'error',
          message: `NIS ${nis} sudah digunakan ${cekNis[0].nama}.`
        });
      }
    }
    const data = await siswaService.editSiswa(req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Siswa berhasil diperbarui.',
      data
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getControl = async (req, res = response) => {
  try {
    const data = await SiswaService.lihatSemuaSiswa();
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

export const getIdControl = async (req, res = response) => {
  try {
    const { id } = req.params;
    const siswaService = new SiswaService(id);
    const data = await siswaService.lihatSiswaId();
    if (!data.length) {
      return res.status(404).json({
        status: 'success',
        message: 'Siswa tidak ditemukan.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Siswa berhasil dimuat.',
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

export const deleteControl = async (req, res = response) => {
  try {
    const { id } = await req.params;
    const siswaService = new SiswaService(id);
    const cekSiswa = await siswaService.lihatSiswaId();

    if (cekSiswa[0].kelas.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Gagal hapus karena siswa sudah mempunyai kelas.'
      });
    }

    const { deletedCount } = await siswaService.hapusSiswa();
    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Siswa tidak ditemukan.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Siswa berhasil dihapus.'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const deletesControl = async (req, res = response) => {
  try {
    const data = req.body;
    const jumlah = await SiswaService.hapusBanyak(data);

    if (!jumlah) {
      return res.status(404).json({
        status: 'error',
        message: 'Tidak ada siswa yang dihapus.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: `${jumlah} Siswa berhasil dihapus.`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const postClassControl = async (req, res = response) => {
  try {
    const { id, idKelas, tahunPelajaran } = req.body;
    const siswaService = new SiswaService(id);
    const cekSiswa = await siswaService.lihatKelasSiswaId({
      idKelas,
      tahunPelajaran
    });
    const cekTahun = await siswaService.lihatKelasSiswaTp({
      tahunPelajaran
    });
    if (cekTahun.length) {
      return res.status(400).json({
        status: 'error',
        message:
          'Tidak bisa menambahkan kelas karena siswa sudah mempunyai kelas lain di tahun pelajaran ' +
          tahunPelajaran
      });
    }
    if (cekSiswa.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Siswa pernah berada dikelas ini.'
      });
    }
    const data = await siswaService.tambahKelas({
      idKelas,
      tahunPelajaran
    });
    return res.status(201).json({
      status: 'success',
      message: 'Kelas berhasil ditambahkan ke siswa',
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
export const postsClassControl = async (req, res = response) => {
  try {
    const payload = req.body;
    const message = await Promise.all(
      // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
      payload.map(async (x) => {
        const { id, idKelas, tahunPelajaran } = x;
        const siswaService = new SiswaService(id);
        const siswa = await siswaService.lihatSiswaId();
        const cekSiswa = await siswaService.lihatKelasSiswaId({
          idKelas,
          tahunPelajaran
        });
        const cekTahun = await siswaService.lihatKelasSiswaTp({
          tahunPelajaran
        });
        if (cekTahun.length) {
          return {
            status: 'warn',
            message: `${siswa[0].nama} tidak bisa menambahkan kelas karena sudah mempunyai kelas lain di tahun pelajaran ${tahunPelajaran}`
          };
        }
        if (cekSiswa.length) {
          return {
            status: 'warn',
            message: `${siswa[0].nama} pernah berada dikelas ini.`
          };
        }
        const data = await siswaService.tambahKelas({
          idKelas,
          tahunPelajaran
        });
        if (!data.nama) {
          return {
            status: 'warn',
            message: `Kelas gagal ditambahkan ke ${siswa[0].nama}`
          };
        }
        return {
          status: 'success',
          message: `Kelas berhasil ditambahkan ke ${siswa[0].nama}`,
          data
        };
      })
    );
    return res.status(201).json({
      status: 'success',
      message
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const putsClassControl = async (req, res = response) => {
  try {
    const message = await Promise.all(
      req.body.map(async (x) => {
        const { id, idKelas, tahunPelajaran } = x;
        const kelas = x.kelas;
        const siswaService = new SiswaService(id);
        const siswa = await siswaService.lihatSiswaId();
        const cekIdKelasSekarang = await SiswaService.lihatSiswa({
          id,
          'kelas.idKelas': idKelas,
          'kelas.tahunPelajaran': tahunPelajaran
        });
        const cekIdKelasEksis = await siswaService.lihatKelasSiswaId(kelas);

        const cekTransaksiSiswaDanSub =
          await PembayaranService.sLihatTransaksiSiswaByKelas(idKelas, id);

        if (cekTransaksiSiswaDanSub) {
          return res.status(400).json({
            status: 'warn',
            message: `${siswa[0].nama} sudah ada aktifitas transaksi dikelas ini.`
          });
        }

        if (!cekIdKelasSekarang.length) {
          return {
            status: 'warn',
            message: 'Kelas sekarang tidak diketahui.'
          };
        }

        if (tahunPelajaran !== kelas.tahunPelajaran) {
          return {
            status: 'warn',
            message:
              'Tahun pelajaran kelas harus sama dengan tahun pelajran yang aktif.'
          };
        }

        if (cekIdKelasEksis.length) {
          return {
            status: 'warn',
            message: `${siswa[0].nama} sudah berada dikelas ini.`
          };
        }

        const data = await siswaService.editKelas(idKelas, kelas);
        if (!data.nama) {
          return {
            status: 'warn',
            message: `${siswa[0].nama} gagal pindah kelas.`
          };
        }

        return {
          status: 'success',
          message: `${siswa[0].nama} berhasil pindah kelas.`,
          data
        };
      })
    );
    return res.status(201).json({
      status: 'success',
      message
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const deleteClassControl = async (req, res = response) => {
  try {
    const { id, idKelas, tahunPelajaran } = req.body;
    const siswaService = new SiswaService(id);

    // const cekSiswa = await siswaService.lihatKelasSiswaId({
    //   idKelas
    // });

    const cekTransaksiSiswaDanSub =
      await PembayaranService.sLihatTransaksiSiswaByKelas(idKelas, id);

    if (cekTransaksiSiswaDanSub) {
      return res.status(400).json({
        status: 'warn',
        message: 'Siswa sudah ada aktifitas transaksi dikelas ini.'
      });
    }

    const cekTransaksiSiswaDanTahun =
      await PembayaranService.sLihatTransaksiSiswaByTahunMasuk(idKelas, id);
    if (cekTransaksiSiswaDanTahun) {
      return res.status(400).json({
        status: 'warn',
        message: 'Siswa sudah ada aktifitas transaksi dikelas ini.'
      });
    }
    const data = await siswaService.hapusKelas({
      idKelas,
      tahunPelajaran
    });

    if (!data) {
      return res.status(400).json({
        status: 'warn',
        message: 'Kelas tidak diketahui.'
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Kelas berhasil dihapus dari siswa',
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
export const deletesClassControl = async (req, res = response) => {
  try {
    const data = req.body;
    const jumlah = await SiswaService.hapusBanyakKelas(data);
    if (!jumlah) {
      return res.status(404).json({
        status: 'error',
        message: 'Tidak ada kelas siswa yang dihapus.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: `${jumlah.berhasil} Siswa berhasil dihapus, ${jumlah.gagal} gagal`
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
export const putClassControl = async (req, res = response) => {
  try {
    const { id, idKelas, tahunPelajaran } = req.body;
    const kelas = req.body.kelas;
    const siswaService = new SiswaService(id);
    const cekIdKelasSekarang = await SiswaService.lihatSiswa({
      id,
      'kelas.idKelas': idKelas,
      'kelas.tahunPelajaran': tahunPelajaran
    });
    const cekIdKelasEksis = await siswaService.lihatKelasSiswaId(kelas);
    const cekTransaksiSiswaDanSub =
      await PembayaranService.sLihatTransaksiSiswaByKelas(idKelas, id);

    if (cekTransaksiSiswaDanSub) {
      return res.status(400).json({
        status: 'error',
        message: 'Siswa sudah ada aktifitas transaksi dikelas ini.'
      });
    }

    if (!cekIdKelasSekarang.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Kelas sekarang tidak diketahui.'
      });
    }

    if (tahunPelajaran !== kelas.tahunPelajaran) {
      return res.status(400).json({
        status: 'error',
        message:
          'Tahun pelajaran kelas harus sama dengan tahun pelajran yang aktif.'
      });
    }

    if (cekIdKelasEksis.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Siswa sudah berada dikelas ini.'
      });
    }

    const data = await siswaService.editKelas(idKelas, kelas);
    if (!data.nama) {
      return {
        status: 'error',
        message: `Siswa gagal pindah kelas.`
      };
    }

    return res.status(200).json({
      status: 'success',
      message: 'Siswa berhasil pindah kelas.'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};

export const getClassIdControl = async (req, res = response) => {
  try {
    const { id } = req.params;
    const data = await SiswaService.lihatKelasEksisSiswa(id);
    if (!data.length) {
      return res.status(404).json({
        status: 'success',
        message: 'Kelas tidak ditemukan.'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Kelas ditemukan.',
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
export const getTpControl = async (req, res = response) => {
  try {
    const { tahunPelajaran } = req.body;
    const siswaArr = await SiswaService.lihatSiswaTahun(tahunPelajaran);
    if (!siswaArr.length) {
      return res.status(400).json({
        status: 'warn',
        message: `Data siswa tahun <b>${tahunPelajaran}</b> masih kosong`
      });
    }
    const data = siswaArr.map((x) => {
      let kelasSekarang = {};
      const { _id, id, nis, nisn, nama, kotaLahir, tanggalLahir, kelas } = x;
      if (kelas.length) {
        const filterKelas = kelas.filter((item) => {
          return item.tahunPelajaran === tahunPelajaran;
        });
        kelasSekarang = filterKelas[0];
      }
      const _data = {
        _id,
        id,
        nis,
        nisn,
        nama,
        kotaLahir,
        tanggalLahir,
        kelas: kelasSekarang
      };
      return _data;
    });
    // console.log(data);
    return res.status(200).json({
      status: 'success',
      message: `Data siswa tahun <b>${tahunPelajaran}</b> berhasil dimuat.`,
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

export const uploadContoller = async (req, res = response) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json('Please upload an excel file!');
    }
    const paths = path.join(path.resolve(), './src/uploads/');
    const workbook = new excelJS.Workbook();
    await workbook.xlsx.readFile(paths + 'users.xlsx');
    const ws = workbook.getWorksheet(1);
    const objresult = [];
    const objheaders = [];
    ws.eachRow(function (row, rowNumber) {
      var currentobj = {};
      row.eachCell(
        {
          includeEmpty: true
        },
        function (cell, colNumber) {
          if (rowNumber == 1) {
            objheaders.push(cell.value.replace(/\s/g, ''));
          } else {
            currentobj[objheaders[colNumber - 1]] =
              cell.value == null ? '' : cell.value;
          }
        }
      );
      if (rowNumber != 1) {
        objresult.push(currentobj);
      }
    });
    // console.log(objresult);
    const obj = objresult.map((x) => {
      const id = nanoid(12);
      const {
        NISN: nisn,
        NIS: nis,
        Nama: nama,
        TempatLahir: kotaLahir,
        TanggalLahir,
        TahunMasuk: tahunPelajaran
      } = x;

      const tanggalLahir = Date(TanggalLahir);

      return {
        id,
        nisn,
        nis,
        nama,
        kotaLahir,
        tanggalLahir,
        tahunPelajaran
      };
    });
    const tam = await SiswaService.insertMany(obj);
    // console.log(tam);
    return res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred trying to process your request'
    });
  }
};
