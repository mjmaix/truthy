import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import config from 'src/config';
import { EmailTemplateModule } from 'src/email-template/email-template.module';
import { MailProcessor } from 'src/mail/mail.processor';
import { MailService } from 'src/mail/mail.service';

const mailConfig = config.get('mail');
const redisConfig = config.get('redis');

@Module({
  imports: [
    EmailTemplateModule,
    BullModule.registerQueueAsync({
      name: mailConfig.queueName,
      useFactory: () => ({
        redis: {
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
          retryStrategy(times) {
            return Math.min(times * 50, 2000);
          },
        },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST || mailConfig.host,
          port: process.env.MAIL_PORT || mailConfig.port,
          secure: mailConfig.secure,
          ignoreTLS: mailConfig.ignoreTLS,
          auth: {
            user: process.env.MAIL_USER || mailConfig.user,
            pass: process.env.MAIL_PASS || mailConfig.pass,
          },
        },
        defaults: {
          from: `"${process.env.MAIL_FROM || mailConfig.from}" <${process.env.MAIL_FROM || mailConfig.fromMail}>`,
        },
        preview: mailConfig.preview,
        template: {
          dir: __dirname + '/templates/email/layouts/',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
