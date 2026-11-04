import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Get all payments (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.paymentService.getAll();
  }

  // Get single payment by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.paymentService.findById(+id);
  }

  // Create payment (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      payment_ID: number;
      member_ID: number;
      membership_ID: number;
      payment_type: string;
      payment_date: string; // or Date
      amount: number;
    },
  ) {
    return this.paymentService.createPayment(body);
  }

  // Update payment (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.paymentService.updatePayment(+id, body);
  }

  // Delete payment (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentService.deletePayment(+id);
  }
}