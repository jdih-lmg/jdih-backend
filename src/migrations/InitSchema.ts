import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1699999999999 implements MigrationInterface {
  name = 'InitSchema1699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // roles
    await queryRunner.query(`
      CREATE TABLE roles (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL
      ) ENGINE=InnoDB;
    `);

    // users
    await queryRunner.query(`
      CREATE TABLE users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role_id BIGINT UNSIGNED NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL,
        CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // menus
    await queryRunner.query(`
      CREATE TABLE menus (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        slug VARCHAR(150) NOT NULL,
        parent_id BIGINT UNSIGNED NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL,
        CONSTRAINT fk_menus_parent FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // actions
    await queryRunner.query(`
      CREATE TABLE actions (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL
      ) ENGINE=InnoDB;
    `);

    // role_menu_permissions
    await queryRunner.query(`
      CREATE TABLE role_menu_permissions (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        role_id BIGINT UNSIGNED NOT NULL,
        menu_id BIGINT UNSIGNED NOT NULL,
        action_id BIGINT UNSIGNED NOT NULL,
        is_allowed BOOLEAN NOT NULL DEFAULT TRUE,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL,
        CONSTRAINT fk_rmp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        CONSTRAINT fk_rmp_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
        CONSTRAINT fk_rmp_action FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // document_categories
    await queryRunner.query(`
      CREATE TABLE document_categories (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL
      ) ENGINE=InnoDB;
    `);

    // documents
    await queryRunner.query(`
      CREATE TABLE documents (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        number VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        subject TEXT,
        abstract TEXT,
        keywords VARCHAR(255),
        status ENUM('draft','verified','published','archived') NOT NULL DEFAULT 'draft',
        category_id BIGINT UNSIGNED NULL,
        publisher VARCHAR(150),
        signed_by VARCHAR(150),
        date_signed DATE,
        effective_date DATE,
        file_url VARCHAR(255),
        verification_date DATETIME(6) NULL,
        verified_by BIGINT UNSIGNED NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL,
        CONSTRAINT fk_documents_category FOREIGN KEY (category_id) REFERENCES document_categories(id) ON DELETE SET NULL,
        CONSTRAINT fk_documents_verified_by FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    // document_versions
    await queryRunner.query(`
      CREATE TABLE document_versions (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        document_id BIGINT UNSIGNED NOT NULL,
        version_number INT NOT NULL,
        file_url VARCHAR(255),
        notes TEXT,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        created_by BIGINT UNSIGNED NULL,
        updated_at DATETIME(6) NULL,
        updated_by BIGINT UNSIGNED NULL,
        deleted_at DATETIME(6) NULL,
        deleted_by BIGINT UNSIGNED NULL,
        CONSTRAINT fk_doc_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // audit_logs
    await queryRunner.query(`
      CREATE TABLE audit_logs (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(100) NOT NULL,
        entity_id BIGINT UNSIGNED NOT NULL,
        old_data JSON,
        new_data JSON,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS document_versions`);
    await queryRunner.query(`DROP TABLE IF EXISTS documents`);
    await queryRunner.query(`DROP TABLE IF EXISTS document_categories`);
    await queryRunner.query(`DROP TABLE IF EXISTS role_menu_permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS actions`);
    await queryRunner.query(`DROP TABLE IF EXISTS menus`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles`);
  }
}
