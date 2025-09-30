import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdmin1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // insert roles
    await queryRunner.query(`
      INSERT INTO roles (name, description, created_at)
      VALUES ('admin', 'Administrator', NOW()), ('user', 'Regular user', NOW())
    `);

    // Ambil id role admin
    const roleRows = (await queryRunner.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`,
    )) as Array<{ id: number }>;
    const adminRole = roleRows[0];

    // Hash password default
    const hash = await bcrypt.hash('admin123', 10);

    // Insert user admin ke kolom password_hash & role_id
    await queryRunner.query(
      `INSERT INTO users (name, email, password_hash, role_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      ['Administrator', 'admin@jdih.local', hash, adminRole.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hapus user admin & roles terkait (tidak ada tabel user_roles)
    await queryRunner.query(`DELETE FROM users WHERE email = 'admin@jdih.local'`);
    await queryRunner.query(`DELETE FROM roles WHERE name IN ('admin', 'user')`);
  }
}
