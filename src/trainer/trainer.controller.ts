import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trainers')
export class TrainerController {
  constructor(private trainerService: TrainerService) {}

  // Get all trainers (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.trainerService.getAll();
  }

  // Get single trainer by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.trainerService.findById(+id);
  }

  // Create trainer (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      trainer_ID: number;
      trainer_name: string;
      contact_num: string;
      trainer_type: string;
      Start_Date: string; // or Date
      End_Date: string;   // or Date
    },
  ) {
    return this.trainerService.createTrainer(body);
  }

  // Update trainer (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.trainerService.updateTrainer(+id, body);
  }

  // Delete trainer (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.trainerService.deleteTrainer(+id);
  }
}