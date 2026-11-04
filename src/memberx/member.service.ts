import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class MembersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createMember(data: {
    member_ID: number;
    First_Name: string;
    Last_Name: string;
    Contact_Number?: string;
    Email?: string;
  }) {
    await this.pool().execute<OkPacket>(
      'INSERT INTO memberx (member_ID, First_Name, Last_Name, Contact_Number, Email) VALUES (?, ?, ?, ?, ?)',
      [
        data.member_ID,
        data.First_Name,
        data.Last_Name,
        data.Contact_Number || null,
        data.Email || null,
      ],
    );
    return await this.findById(data.member_ID);
  }

  async findById(member_ID: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_ID, First_Name, Last_Name, Contact_Number, Email FROM memberx WHERE member_ID = ?',
      [member_ID],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Member with ID ${member_ID} not found`);
    }
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_ID, First_Name, Last_Name, Contact_Number, Email FROM memberx',
    );
    return rows;
  }

  async updateMember(
    member_ID: number,
    partial: {
      First_Name?: string;
      Last_Name?: string;
      Contact_Number?: string;
      Email?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.First_Name !== undefined) {
      fields.push('First_Name = ?');
      values.push(partial.First_Name);
    }
    if (partial.Last_Name !== undefined) {
      fields.push('Last_Name = ?');
      values.push(partial.Last_Name);
    }
    if (partial.Contact_Number !== undefined) {
      fields.push('Contact_Number = ?');
      values.push(partial.Contact_Number);
    }
    if (partial.Email !== undefined) {
      fields.push('Email = ?');
      values.push(partial.Email);
    }

    if (fields.length === 0) return await this.findById(member_ID);

    values.push(member_ID);
    const sql = `UPDATE memberx SET ${fields.join(', ')} WHERE member_ID = ?`;
    
    const [res] = await this.pool().execute<OkPacket>(sql, values);
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Member with ID ${member_ID} not found`);
    }

    return await this.findById(member_ID);
  }

  async deleteMember(member_ID: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM memberx WHERE member_ID = ?',
      [member_ID],
    );
    if (res.affectedRows === 0) {
      throw new NotFoundException(`Member with ID ${member_ID} not found`);
    }
    return true;
  }
}