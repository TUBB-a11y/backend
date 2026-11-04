import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class MembershipService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createMembership(data: {
    membership_ID: number;
    member_ID: number;
    membership_Type: string;
    Start_Date: string;
    End_Date: string;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO Membership (membership_ID, member_ID, membership_Type, Start_Date, End_Date) VALUES (?, ?, ?, ?, ?)',
      [
        data.membership_ID,
        data.member_ID,
        data.membership_Type,
        data.Start_Date,
        data.End_Date,
      ],
    );
    return await this.findById(data.membership_ID);
  }

  async findById(membership_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT membership_ID, member_ID, membership_Type, Start_Date, End_Date FROM Membership WHERE membership_ID = ?',
      [membership_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Membership with ID ${membership_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT membership_ID, member_ID, membership_Type, Start_Date, End_Date FROM Membership',
    );
    return rows;
  }

  async updateMembership(
    membership_ID: number,
    partial: {
      member_ID?: number;
      membership_Type?: string;
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
    if (partial.membership_Type !== undefined) {
      fields.push('membership_Type = ?');
      values.push(partial.membership_Type);
    }
    if (partial.Start_Date !== undefined) {
      fields.push('Start_Date = ?');
      values.push(partial.Start_Date);
    }
    if (partial.End_Date !== undefined) {
      fields.push('End_Date = ?');
      values.push(partial.End_Date);
    }

    if (fields.length === 0) return await this.findById(membership_ID);

    values.push(membership_ID);
    const sql = `UPDATE Membership SET ${fields.join(', ')} WHERE membership_ID = ?`;

    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Membership with ID ${membership_ID} not found`);
    }

    return await this.findById(membership_ID);
  }

  async deleteMembership(membership_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM Membership WHERE membership_ID = ?',
      [membership_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Membership with ID ${membership_ID} not found`);
    }
    return true;
  }
}