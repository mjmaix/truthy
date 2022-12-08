import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UniqueValidatorPipe } from 'src/common/pipes/unique-validator.pipe';
import { EmailTemplateController } from 'src/email-template/email-template.controller';
import { EmailTemplateRepository } from 'src/email-template/email-template.repository';
import { EmailTemplateService } from 'src/email-template/email-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplateRepository]), forwardRef(() => AuthModule)],
  exports: [EmailTemplateService],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService, UniqueValidatorPipe],
})
export class EmailTemplateModule {}
