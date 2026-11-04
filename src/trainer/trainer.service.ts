import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class TrainerService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createTrainer(data: {
    trainer_ID: number;
    trainer_name: string;
    contact_num: string;
    trainer_type: string;
    Start_Date: string;
    End_Date: string;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO trainer (trainer_ID, trainer_name, contact_num, trainer_type, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.trainer_ID,
        data.trainer_name,
        data.contact_num,
        data.trainer_type,
        data.Start_Date,
        data.End_Date,
      ],
    );
    return await this.findById(data.trainer_ID);
  }

  async findById(trainer_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_ID, trainer_name, contact_num, trainer_type, Start_Date, End_Date FROM trainer WHERE trainer_ID = ?',
      [trainer_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Trainer with ID ${trainer_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT trainer_ID, trainer_name, contact_num, trainer_type, Start_Date, End_Date FROM trainer',
    );
    return rows;
  }

  async updateTrainer(
    trainer_ID: number,
    partial: {
      trainer_name?: string;
      contact_num?: string;
      trainer_type?: string;
      Start_Date?: string;
      End_Date?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.trainer_name !== undefined) {
      fields.push('trainer_name = ?');
      values.push(partial.trainer_name);
    }
    if (partial.contact_num !== undefined) {
      fields.push('contact_num = ?');
      values.push(partial.contact_num);
    }
    if (partial.trainer_type !== undefined) {
      fields.push('trainer_type = ?');
      values.push(partial.trainer_type);
    }
    if (partial.Start_Date !== undefined) {
      fields.push('Start_Date = ?');
      values.push(partial.Start_Date);
    }
    if (partial.End_Date !== undefined) {
      fields.push('End_Date = ?');
      values.push(partial.End_Date);
    }

    if (fields.length === 0) return await this.findById(trainer_ID);

    values.push(trainer_ID);
    const sql = `UPDATE trainer SET ${fields.join(', ')} WHERE trainer_ID = ?`;

    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Trainer with ID ${trainer_ID} not found`);
    }

    return await this.findById(trainer_ID);
  }

  async deleteTrainer(trainer_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM trainer WHERE trainer_ID = ?',
      [trainer_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Trainer with ID ${trainer_ID} not found`);
    }
    return true;
  }
}