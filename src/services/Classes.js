import { ClassesLevels } from '../libs/dbConnect.js';
import { nanoid } from 'nanoid';

export default class Classess {
  async addClassLevel(name, level, major) {
    const id = nanoid(9);
    const newClass = ClassesLevels({ id, name, level, major });
    const query = await newClass.save();

    return query;
  }

  async updateClasses(id, name, level, major) {
    const result = await ClassesLevels.updateOne(
      { id },
      { $set: { name, level, major } }
    );

    return result;
  }

  async getAllClass() {
    const result = await ClassesLevels.find();

    return result;
  }

  static async sGetAllClass() {
    const result = await ClassesLevels.find();

    return result;
  }

  async deleteClass(id) {
    const result = await ClassesLevels.deleteOne({ id });
    return result;
  }

  async getClasses(body) {
    const result = await ClassesLevels.find(body);

    return result;
  }
}
