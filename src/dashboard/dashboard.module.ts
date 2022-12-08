import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DashboardController } from 'src/dashboard/dashboard.controller';
import { DashboardService } from 'src/dashboard/dashboard.service';

@Module({
  controllers: [DashboardController],
  imports: [AuthModule],
  providers: [DashboardService],
})
export class DashboardModule {}
