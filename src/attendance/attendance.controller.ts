import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  // Get all attendance records (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.attendanceService.getAll();
  }

  // Get single attendance record by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.attendanceService.findById(+id);
  }

  // Create attendance record (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      Attendance_ID: number;
      Member_ID: number;
      Attendance_Date: string; // or Date
      Time_In: string;         // or string time format
      Time_Out?: string;       // optional since TIME can be NULL
    },
  ) {
    return this.attendanceService.createAttendance(body);
  }

  // Update attendance record (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.attendanceService.updateAttendance(+id, body);
  }

  // Delete attendance record (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.attendanceService.deleteAttendance(+id);
  }
}