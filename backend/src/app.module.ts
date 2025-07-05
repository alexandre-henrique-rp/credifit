import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [UserModule, LoansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
