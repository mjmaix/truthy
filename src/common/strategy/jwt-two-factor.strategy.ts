import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
import { UserEntity } from 'src/auth/entity/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';
import config from 'src/config';
import { CustomHttpException } from 'src/exception/custom-http.exception';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: config.get('jwt').secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserEntity> {
    const { isTwoFAAuthenticated, subject } = payload;
    const user = await this.userRepository.findOne(Number(subject), {
      relations: ['role', 'role.permission'],
    });
    if (!user.isTwoFAEnabled) {
      return user;
    }
    if (isTwoFAAuthenticated) {
      return user;
    }
    throw new CustomHttpException('otpRequired', HttpStatus.FORBIDDEN, StatusCodesList.OtpRequired);
  }
}
