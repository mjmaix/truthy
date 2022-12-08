import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import * as Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/auth/user.repository';
import { UniqueValidatorPipe } from 'src/common/pipes/unique-validator.pipe';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { JwtTwoFactorStrategy } from 'src/common/strategy/jwt-two-factor.strategy';
import { MailModule } from 'src/mail/mail.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';

const throttleConfig = config.get('throttle.login');
const redisConfig = config.get('queue');
const jwtConfig = config.get('jwt');
const LoginThrottleFactory = {
  provide: 'LOGIN_THROTTLE',
  useFactory: () => {
    const redisClient = new Redis({
      enableOfflineQueue: false,
      host: process.env.REDIS_HOST || redisConfig.host,
      port: process.env.REDIS_PORT || redisConfig.port,
      password: process.env.REDIS_PASSWORD || redisConfig.password,
    });

    return new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: throttleConfig.prefix,
      points: throttleConfig.limit,
      duration: 60 * 60 * 24 * 30, // Store number for 30 days since first fail
      blockDuration: throttleConfig.blockDuration,
    });
  },
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || jwtConfig.secret,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || jwtConfig.expiresIn,
        },
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    TypeOrmModule.forFeature([UserRepository]),
    MailModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTwoFactorStrategy, JwtStrategy, UniqueValidatorPipe, LoginThrottleFactory],
  exports: [AuthService, JwtTwoFactorStrategy, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
