import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(data: {
    payment_ID: number;
    member_ID: number;
    membership_ID: number;
    payment_type: string;
    payment_date: string;
    amount: number;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO Payment (payment_ID, member_ID, membership_ID, payment_type, payment_date, amount) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.payment_ID,
        data.member_ID,
        data.membership_ID,
        data.payment_type,
        data.payment_date,
        data.amount,
      ],
    );
    return await this.findById(data.payment_ID);
  }

  async findById(payment_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_ID, member_ID, membership_ID, payment_type, payment_date, amount FROM Payment WHERE payment_ID = ?',
      [payment_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Payment with ID ${payment_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_ID, member_ID, membership_ID, payment_type, payment_date, amount FROM Payment',
    );
    return rows;
  }

  async updatePayment(
    payment_ID: number,
    partial: {
      member_ID?: number;
      membership_ID?: number;
      payment_type?: string;
      payment_date?: string;
      amount?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.member_ID !== undefined) {
      fields.push('member_ID = ?');
      values.push(partial.member_ID);
    }
    if (partial.membership_ID !== undefined) {
      fields.push('membership_ID = ?');
      values.push(partial.membership_ID);
    }
    if (partial.payment_type !== undefined) {
      fields.push('payment_type = ?');
      values.push(partial.payment_type);
    }
    if (partial.payment_date !== undefined) {
      fields.push('payment_date = ?');
      values.push(partial.payment_date);
    }
    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }

    if (fields.length === 0) return await this.findById(payment_ID);

    values.push(payment_ID);
    const sql = `UPDATE Payment SET ${fields.join(', ')} WHERE payment_ID = ?`;

    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Payment with ID ${payment_ID} not found`);
    }

    return await this.findById(payment_ID);
  }

  async deletePayment(payment_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Payment WHERE payment_ID = ?',
      [payment_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Payment with ID ${payment_ID} not found`);
    }
    return true;
  }
}