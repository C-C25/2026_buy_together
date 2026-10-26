import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from '../auth/dto/auth.register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepo: Repository<UsersEntity>,
  ) {}

  async createUser(dto: AuthRegisterDto) {
    const existsUserEmail = await this.userRepo.exists({
      where: { email: dto.email },
    });

    if (existsUserEmail) {
      throw new BadRequestException('사용중인 이메일 입니다');
    }

    const existsUserNickname = await this.userRepo.exists({
      where: { nickname: dto.nickname },
    });

    if (existsUserNickname) {
      throw new BadRequestException('사용중인 닉네임 입니다.');
    }

    const newUser = this.userRepo.create({
      email: dto.email,
      password: dto.password,
      nickname: dto.nickname,
    });

    const user = await this.userRepo.save(newUser);

    return user;
  }

  async validateUserWithEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        point: true,
        email: true,
        password: true,
        nickname: true,
      },
    });

    return user;
  }
}
