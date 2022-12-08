import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UniqueValidatorPipe } from 'src/common/pipes/unique-validator.pipe';
import { PermissionRepository } from 'src/permission/permission.repository';
import { PermissionsController } from 'src/permission/permissions.controller';
import { PermissionsService } from 'src/permission/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionRepository]), AuthModule],
  exports: [PermissionsService],
  controllers: [PermissionsController],
  providers: [PermissionsService, UniqueValidatorPipe],
})
export class PermissionsModule {}
