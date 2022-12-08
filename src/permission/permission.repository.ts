import { classToPlain, plainToClass } from 'class-transformer';
import { BaseRepository } from 'src/common/repository/base.repository';
import { RoutePayloadInterface } from 'src/config/permission-config';
import { PermissionEntity } from 'src/permission/entities/permission.entity';
import { Permission } from 'src/permission/serializer/permission.serializer';
import { EntityRepository } from 'typeorm';

@EntityRepository(PermissionEntity)
export class PermissionRepository extends BaseRepository<PermissionEntity, Permission> {
  async syncPermission(permissionsList: RoutePayloadInterface[]): Promise<void> {
    await this.createQueryBuilder('permission')
      .insert()
      .into(PermissionEntity)
      .values(permissionsList)
      .orIgnore()
      .execute();
  }

  transform(model: PermissionEntity, transformOption = {}): Permission {
    return plainToClass(Permission, classToPlain(model, transformOption), transformOption);
  }

  transformMany(models: PermissionEntity[], transformOption = {}): Permission[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
