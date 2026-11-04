import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workouts')
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  // Get all workouts (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.workoutService.getAll();
  }

  // Get single workout by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.workoutService.findById(+id);
  }

  // Create workout (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      workout_ID: number;
      member_ID: number;
      trainer_ID: number;
      work_out_name: string;
      workout_type: string;
      Start_Date: string; // or Date
      End_Date: string;   // or Date
    },
  ) {
    return this.workoutService.createWorkout(body);
  }

  // Update workout (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.workoutService.updateWorkout(+id, body);
  }

  // Delete workout (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.workoutService.deleteWorkout(+id);
  }
}