import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MembersService } from './member.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  // Get all members (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.membersService.getAll();
  }

  // Get single member by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.membersService.findById(+id);
  }

  // Create member (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      member_ID: number;
      First_Name: string;
      Last_Name: string;
      Contact_Number?: string;
      Email?: string;
    },
  ) {
    return this.membersService.createMember(body);
  }

  // Update member (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.membersService.updateMember(+id, body);
  }

  // Delete member (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.deleteMember(+id);
  }
}