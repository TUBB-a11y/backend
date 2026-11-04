import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { MembersModule } from './memberx/member.module';
import { MembershipModule } from './membership/membership.module';
import { PaymentModule } from './payment/payment.module';
import { TrainerModule } from './trainer/trainer.module';
import { WorkoutModule } from './workout/workout.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, MembersModule, MembershipModule, PaymentModule, TrainerModule, WorkoutModule, AttendanceModule],
})
export class AppModule {}