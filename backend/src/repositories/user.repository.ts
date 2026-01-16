import { User, IUser } from '../db/models/User.js';

export class UserRepository {
  async create(data: {
    email: string;
    password_hash: string;
    name: string;
  }): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async deleteAll(): Promise<void> {
    await User.deleteMany({});
  }
}
