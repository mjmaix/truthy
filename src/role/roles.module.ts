import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UniqueValidatorPipe } from 'src/common/pipes/unique-validator.pipe';
import { PermissionsModule } from 'src/permission/permissions.module';
import { RoleRepository } from 'src/role/role.repository';
import { RolesController } from 'src/role/roles.controller';
import { RolesService } from 'src/role/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository]), AuthModule, PermissionsModule],
  exports: [],
  controllers: [RolesController],
  providers: [RolesService, UniqueValidatorPipe],
})
export class RolesModule {}
