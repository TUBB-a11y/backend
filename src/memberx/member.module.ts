import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MembersService } from './member.service';
import { MembersController } from './member.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}