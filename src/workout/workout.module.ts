import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
  exports: [WorkoutService],
})
export class WorkoutModule {}