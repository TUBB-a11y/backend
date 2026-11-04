import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class WorkoutService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createWorkout(data: {
    workout_ID: number;
    member_ID: number;
    trainer_ID: number;
    work_out_name: string;
    workout_type: string;
    Start_Date: string;
    End_Date: string;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO workout (workout_ID, member_ID, trainer_ID, work_out_name, workout_type, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        data.workout_ID,
        data.member_ID,
        data.trainer_ID,
        data.work_out_name,
        data.workout_type,
        data.Start_Date,
        data.End_Date,
      ],
    );
    return await this.findById(data.workout_ID);
  }

  async findById(workout_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT workout_ID, member_ID, trainer_ID, work_out_name, workout_type, Start_Date, End_Date FROM workout WHERE workout_ID = ?',
      [workout_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Workout with ID ${workout_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT workout_ID, member_ID, trainer_ID, work_out_name, workout_type, Start_Date, End_Date FROM workout',
    );
    return rows;
  }

  async updateWorkout(
    workout_ID: number,
    partial: {
      member_ID?: number;
      trainer_ID?: number;
      work_out_name?: string;
      workout_type?: string;
      Start_Date?: string;
      End_Date?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.member_ID !== undefined) {
      fields.push('member_ID = ?');
      values.push(partial.member_ID);
    }
    if (partial.trainer_ID !== undefined) {
      fields.push('trainer_ID = ?');
      values.push(partial.trainer_ID);
    }
    if (partial.work_out_name !== undefined) {
      fields.push('work_out_name = ?');
      values.push(partial.work_out_name);
    }
    if (partial.workout_type !== undefined) {
      fields.push('workout_type = ?');
      values.push(partial.workout_type);
    }
    if (partial.Start_Date !== undefined) {
      fields.push('Start_Date = ?');
      values.push(partial.Start_Date);
    }
    if (partial.End_Date !== undefined) {
      fields.push('End_Date = ?');
      values.push(partial.End_Date);
    }

    if (fields.length === 0) return await this.findById(workout_ID);

    values.push(workout_ID);
    const sql = `UPDATE workout SET ${fields.join(', ')} WHERE workout_ID = ?`;

    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Workout with ID ${workout_ID} not found`);
    }

    return await this.findById(workout_ID);
  }

  async deleteWorkout(workout_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM workout WHERE workout_ID = ?',
      [workout_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Workout with ID ${workout_ID} not found`);
    }
    return true;
  }
}