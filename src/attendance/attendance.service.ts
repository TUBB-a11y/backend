import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class AttendanceService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createAttendance(data: {
    Attendance_ID: number;
    Member_ID: number;
    Attendance_Date: string;
    Time_In: string;
    Time_Out?: string;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO Attendance (Attendance_ID, Member_ID, Attendance_Date, Time_In, Time_Out) VALUES (?, ?, ?, ?, ?)',
      [
        data.Attendance_ID,
        data.Member_ID,
        data.Attendance_Date,
        data.Time_In,
        data.Time_Out || null,
      ],
    );
    return await this.findById(data.Attendance_ID);
  }

  async findById(Attendance_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT Attendance_ID, Member_ID, Attendance_Date, Time_In, Time_Out FROM Attendance WHERE Attendance_ID = ?',
      [Attendance_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Attendance record with ID ${Attendance_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT Attendance_ID, Member_ID, Attendance_Date, Time_In, Time_Out FROM Attendance',
    );
    return rows;
  }

  async updateAttendance(
    Attendance_ID: number,
    partial: {
      Member_ID?: number;
      Attendance_Date?: string;
      Time_In?: string;
      Time_Out?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.Member_ID !== undefined) {
      fields.push('Member_ID = ?');
      values.push(partial.Member_ID);
    }
    if (partial.Attendance_Date !== undefined) {
      fields.push('Attendance_Date = ?');
      values.push(partial.Attendance_Date);
    }
    if (partial.Time_In !== undefined) {
      fields.push('Time_In = ?');
      values.push(partial.Time_In);
    }
    if (partial.Time_Out !== undefined) {
      fields.push('Time_Out = ?');
      values.push(partial.Time_Out);
    }

    if (fields.length === 0) return await this.findById(Attendance_ID);

    values.push(Attendance_ID);
    const sql = `UPDATE Attendance SET ${fields.join(', ')} WHERE Attendance_ID = ?`;

    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Attendance record with ID ${Attendance_ID} not found`);
    }

    return await this.findById(Attendance_ID);
  }

  async deleteAttendance(Attendance_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Attendance WHERE Attendance_ID = ?',
      [Attendance_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Attendance record with ID ${Attendance_ID} not found`);
    }
    return true;
  }
}