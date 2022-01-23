import { userModel } from '../libs/dbConnect.js';
import express from 'express';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const login = async (req, res) => {
  userModel.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        const validPass = bcrypt.compare(req.body.password, user.password);
        if (!validPass)
          return res.status(401).send('Username or Password is wrong');

        // Create and assign token
        let payload = { id: user._id, user_type_id: user.user_type_id };
        const token = jwt.sign(payload, process.env.KEY_APP);

        res.status(200).header('auth-token', token).send({ token: token });
      } else {
        res.status(401).send('Access Forbidden');
      }
    }
  });
};

export const verifyUserToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send('Access Denied / Unauthorized request');

  try {
    token = token.split(' ')[1]; // Remove Bearer from string
    console.log(token);

    if (token === 'null' || !token)
      return res.status(401).send('Unauthorized request');

    let verifiedUser = jwt.verify(token, process.env.KEY_APP); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).send('Unauthorized request');

    req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

router.post('/login', login);
router.post('/get', verifyUserToken);
export default router;
