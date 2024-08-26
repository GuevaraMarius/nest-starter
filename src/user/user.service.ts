import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  userRepository: any;
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
  async updateProfile(userId: number, updateProfileDto: any): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If user wants to update password, hash the new password
    if (updateProfileDto.password) {
      updateProfileDto.password = bcrypt.hashSync(
        updateProfileDto.password,
        10,
      );
    }

    // Update the user profile with the provided data
    Object.assign(user, updateProfileDto);
    return await this.userRepository.save(user);
  }
}
