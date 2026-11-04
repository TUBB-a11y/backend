import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}