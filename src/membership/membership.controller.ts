import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('memberships')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  // Get all memberships (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.membershipService.getAll();
  }

  // Get single membership by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.membershipService.findById(+id);
  }

  // Create membership (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      membership_ID: number;
      member_ID: number;
      membership_Type: string;
      Start_Date: string; // or Date
      End_Date: string;   // or Date
    },
  ) {
    return this.membershipService.createMembership(body);
  }

  // Update membership (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.membershipService.updateMembership(+id, body);
  }

  // Delete membership (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membershipService.deleteMembership(+id);
  }
}