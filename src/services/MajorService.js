import { majorMongo, ClassesLevels } from '../libs/dbConnect.js';

export default class MajorService {
  async addMajor(major, code) {
    const newMajor = majorMongo({ major, code });
    const query = await newMajor.save();

    return query;
  }

  async getAllMajor() {
    const result = await majorMongo.find();

    return result;
  }

  async getById(code) {
    const result = await majorMongo.find({ code });

    return result;
  }

  async getClassByCode(code) {
    const result = await ClassesLevels.find({ major: code });

    return result;
  }

  async deleteMajor(code) {
    const result = await majorMongo.deleteOne({ code });
    return result;
  }
}
