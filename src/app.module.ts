import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from 'config';
import { WinstonModule } from 'nest-winston';
import { CookieResolver, HeaderResolver, I18nJsonParser, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { join } from 'path';
import { AppController } from 'src/app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CustomThrottlerGuard } from 'src/common/guard/custom-throttle.guard';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { I18nExceptionFilterPipe } from 'src/common/pipes/i18n-exception-filter.pipe';
import * as ormConfig from 'src/config/ormconfig';
import * as throttleConfig from 'src/config/throttle-config';
import winstonConfig from 'src/config/winston';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { EmailTemplateModule } from 'src/email-template/email-template.module';
import { MailModule } from 'src/mail/mail.module';
import { PermissionsModule } from 'src/permission/permissions.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { RolesModule } from 'src/role/roles.module';
import { TwofaModule } from 'src/twofa/twofa.module';

const appConfig = config.get('app');

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRootAsync({
      useFactory: () => throttleConfig,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ormConfig,
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
