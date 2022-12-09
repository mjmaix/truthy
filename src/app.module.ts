import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { CookieResolver, HeaderResolver, I18nJsonParser, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import * as path from 'path';
import { join } from 'path';
import { AppController } from 'src/app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CustomThrottlerGuard } from 'src/common/guard/custom-throttle.guard';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { I18nExceptionFilterPipe } from 'src/common/pipes/i18n-exception-filter.pipe';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { EmailTemplateModule } from 'src/email-template/email-template.module';
import { MailModule } from 'src/mail/mail.module';
import { PermissionsModule } from 'src/permission/permissions.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { RolesModule } from 'src/role/roles.module';
import { TwofaModule } from 'src/twofa/twofa.module';
import { ConnectionOptions } from 'typeorm';
import * as winston from 'winston';
import * as WinstonCloudWatch from 'winston-cloudwatch';

import config from './config';

const appConfig = config.get('app');
const dbConfig = config.get('db');
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: () => {
        const isProduction = appConfig.stage === 'production';
        const winstonConfig = config.get('winston');
        return {
          format: winston.format.colorize(),
          exitOnError: false,
          transports: isProduction
            ? new WinstonCloudWatch({
                name: winstonConfig.name,
                awsOptions: {
                  credentials: {
                    accessKeyId: winstonConfig.awsAccessKeyId,
                    secretAccessKey: winstonConfig.awsSecretAccessKey,
                  },
                },
                logGroupName: winstonConfig.groupName,
                logStreamName: winstonConfig.streamName,
                awsRegion: winstonConfig.awsRegion,
                messageFormatter: function (item) {
                  return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta);
                },
              })
            : new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.ms(),
                  nestWinstonModuleUtilities.format.nestLike('Truthy Logger', {
                    prettyPrint: true,
                  }),
                ),
              }),
        } as WinstonModuleOptions;
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const throttleConfig = config.get('throttle');
        const redisConfig = config.get('redis');

        return {
          ttl: throttleConfig.global.ttl,
          limit: throttleConfig.global.limit,
          storage: new ThrottlerStorageRedisService({
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
          }),
        } as ThrottlerModuleOptions;
      },
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          migrationsTransactionMode: 'each',
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          logging: false,
          synchronize: false,
          migrationsRun: process.env.NODE_ENV === 'test',
          dropSchema: process.env.NODE_ENV === 'test',
          migrationsTableName: 'migrations',
          migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
          cli: {
            migrationsDir: 'src/database/migrations',
          },
        } as ConnectionOptions;
      },
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: appConfig.fallbackLanguage,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      parser: I18nJsonParser,
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang', 'locale', 'l'],
        },
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    AuthModule,
    RolesModule,
    PermissionsModule,
    MailModule,
    EmailTemplateModule,
    RefreshTokenModule,
    TwofaModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: I18nExceptionFilterPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
