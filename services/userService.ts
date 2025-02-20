import User from "../database/models/user";

type CreateUserInput = {
  name: string;
  email: string;
  encrypted_token?: string;
  encrypted_refresh_token?: string;
  token_expires_at?: number
}

class UserService {
  async findUserByEmail (email: string) : Promise<User> {
    return await User.findOne({where:{email}})
  }

  async createUser(userData : CreateUserInput):Promise<User> {
    try {
      return await User.create(userData);
    } catch (error) {
      // 에러 처리
      throw error;
    }
  }
}

export default new UserService()
