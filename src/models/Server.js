import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import classesRoute from '../routes/classes.js';
import majorRoute from '../routes/major.js';
import siswaRoute from '../routes/siswaRoute.js';
import sekolahRoute from '../routes/sekolahRoute.js';
import pembayaranRoute from '../routes/pembayaranRoute.js';
import laporanRoute from '../routes/laporanRoute.js';
import exportRoute from '../routes/exportRoute.js';
import auth, { verifyUserToken } from '../routes/auth.js';
import path from 'path';

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.httpServer = createServer(this.app);
    // eslint-disable-next-line no-undef
    this.port = process.env.PORT || 3001;
    this.paths = {
      homepage: '/',
      classes: '/api/classes',
      major: '/api/major',
      siswa: '/api/siswa',
      sekolah: '/api/sekolah',
      pembayaran: '/api/pembayaran',
      laporan: '/api/laporan',
      export: '/api/export'
    };
    this.view = {
      static: path.join(path.resolve(), './build'),
      public: path.join(path.resolve(), './build/index.html')
    };

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      return next();
    });
    this.app.use(express.static(this.view.static));
  }

  routes() {
    this.app.use((err, req, res, next) => {
      console.log(err);
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.status(400).json({ status: 'error', message: err.message }); // Bad request
      }
      next();
    });
    this.app.use(this.paths.classes, verifyUserToken, classesRoute);
    this.app.use(this.paths.major, majorRoute);
    this.app.use(this.paths.siswa, siswaRoute);
    this.app.use(this.paths.sekolah, sekolahRoute);
    this.app.use(this.paths.pembayaran, pembayaranRoute);
    this.app.use(this.paths.laporan, laporanRoute);
    this.app.use(this.paths.export, exportRoute);
    this.app.use('/api/auth/', auth);
    this.app.get(this.paths.homepage, (_req, res) => {
      res.sendFile(this.view.public);
    });
    this.app.use('*', (req, res) => {
      res.status(404).json({
        status: 'error',
        message: 'Not Found'
      });
    });
  }

  listen() {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}

export default Server;
