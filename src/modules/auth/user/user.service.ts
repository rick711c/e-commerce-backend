import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/cerateUser.dto';
import * as bcrypt from 'bcrypt';
import { ErrorMessages } from 'src/lib/enums/errorMessages.enum';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './interface/jwtPayload.interface';


@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      createUserDto.enPassword = await this.hashPassword(
        createUserDto.password,
      );
      return this.userRepository.registerUser(createUserDto);
    } catch (err) {
      throw err;
    }
  }

  async login(username: string, password: string) {
    try {
      //finding the user with the given username
      const userDetails = await this.findOne(username);
      if (!userDetails) {
        throw new HttpException(
          ErrorMessages.INVALID_CREDENTIAL,
          HttpStatus.NOT_FOUND,
        );
      }

      //compare the password
      const isPasswordsMatch: boolean = await bcrypt.compare(
        password,
        userDetails.enPassword,
      );
      if(!isPasswordsMatch) {
        throw new HttpException(ErrorMessages.WRONG_PASSWORD,HttpStatus.UNAUTHORIZED);
      }

      //issue jwt token on successful login
      const payload:JwtPayload ={
        userId: userDetails.userId,
        username: userDetails.username,
      }
      const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });
      return token;
    } catch (err) {
      throw err;
    }
  }

  async findOne(username: string) {
    try {
      return this.userRepository.findOne(username);
    } catch (err) {
      throw err;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds to generate
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
