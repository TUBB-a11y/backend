import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TrainerController],
  providers: [TrainerService],
  exports: [TrainerService],
})
export class TrainerModule {}