import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RefreshTokenRepository } from 'src/refresh-token/refresh-token.repository';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([RefreshTokenRepository])],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
  controllers: [],
})
export class RefreshTokenModule {}
