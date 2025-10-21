-- Valentina Studio --
-- MySQL dump --
-- ---------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
-- ---------------------------------------------------------


-- CREATE TABLE "actions" --------------------------------------
CREATE TABLE `actions`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 8;
-- -------------------------------------------------------------


-- CREATE TABLE "audit_logs" -----------------------------------
CREATE TABLE `audit_logs`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`user_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`action` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`entity` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`entity_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`old_data` JSON NULL DEFAULT NULL,
	`new_data` JSON NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 4;
-- -------------------------------------------------------------


-- CREATE TABLE "document_categories" --------------------------
CREATE TABLE `document_categories`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 7;
-- -------------------------------------------------------------


-- CREATE TABLE "document_versions" ----------------------------
CREATE TABLE `document_versions`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`document_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`version_number` Int( 0 ) NOT NULL,
	`file_url` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`notes` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 4;
-- -------------------------------------------------------------


-- CREATE TABLE "documents" ------------------------------------
CREATE TABLE `documents`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`title` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`number` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`type` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`year` Int( 0 ) NOT NULL,
	`subject` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`abstract` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`keywords` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`status` Enum( 'draft', 'verified', 'published', 'archived' ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'draft',
	`category_id` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`publisher` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`signed_by` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`date_signed` Date NULL DEFAULT NULL,
	`effective_date` Date NULL DEFAULT NULL,
	`file_url` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`verification_date` DateTime NULL DEFAULT NULL,
	`verified_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 6;
-- -------------------------------------------------------------


-- CREATE TABLE "menus" ----------------------------------------
CREATE TABLE `menus`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`slug` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`parent_id` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 4;
-- -------------------------------------------------------------


-- CREATE TABLE "role_menu_permissions" ------------------------
CREATE TABLE `role_menu_permissions`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`role_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`menu_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`action_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`is_allowed` TinyInt( 1 ) NOT NULL DEFAULT 1,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 19;
-- -------------------------------------------------------------


-- CREATE TABLE "roles" ----------------------------------------
CREATE TABLE `roles`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 2;
-- -------------------------------------------------------------


-- CREATE TABLE "users" ----------------------------------------
CREATE TABLE `users`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`email` VarChar( 150 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`password_hash` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`role_id` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
	`created_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`updated_at` DateTime NULL DEFAULT NULL,
	`updated_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`deleted_at` DateTime NULL DEFAULT NULL,
	`deleted_by` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `email` UNIQUE( `email` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 17;
-- -------------------------------------------------------------


-- Dump data of "actions" ----------------------------------
BEGIN;

INSERT INTO `actions`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'create', 'Membuat data baru', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'read', 'Melihat data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'update', 'Mengubah data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'delete', 'Menghapus data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '5', 'verify', 'Memverifikasi dokumen', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '6', 'publish', 'Mempublikasikan konten', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "audit_logs" -------------------------------
BEGIN;

INSERT INTO `audit_logs`(`id`,`user_id`,`action`,`entity`,`entity_id`,`old_data`,`new_data`,`created_at`) VALUES 
( '5', '1', 'LOGIN', 'Auth', '1', NULL, '{"ip": "::1", "user_agent": "insomnia/11.5.0"}', '2025-10-21 03:02:37.310394' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "document_categories" ----------------------
BEGIN;

INSERT INTO `document_categories`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Peraturan Daerah', 'Kategori untuk Perda dan turunannya', '2025-10-07 08:00:14.163062', NULL, NULL, NULL, NULL, NULL ),
( '2', 'Peraturan Bupati', 'Kategori untuk Perbup dan turunannya', '2025-10-07 08:00:50.217063', NULL, NULL, NULL, NULL, NULL ),
( '3', 'Test Category Edit', 'Testing kategori Edit', '2025-10-08 05:55:10.563214', NULL, '2025-10-08 05:56:58.000000', NULL, NULL, NULL ),
( '4', 'Test', 'Testing Cat', '2025-10-08 05:57:36.756715', NULL, '2025-10-17 02:39:29.000000', NULL, NULL, '9' ),
( '5', 'Peraturen Hukum Efisien', 'Peraturan Tentang Hukum Efisiensi Kabupaten.', '2025-10-12 11:22:28.969865', NULL, '2025-10-12 18:23:25.174000', NULL, NULL, NULL ),
( '6', 'Peraturen Pondok Pesantren Fix', 'Peraturan tentang pondok pesantren di kabupaten Lamongan.', '2025-10-16 14:23:30.747138', '1', '2025-10-17 02:40:43.000000', '9', NULL, '9' ),
( '7', 'Peraturen Produsen Minuman Herbal', 'Peraturan tentang produsen minuman herbal di kabupaten Lamongan.', '2025-10-17 09:38:28.376759', '1', '2025-10-17 10:10:33.000000', '1', NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "document_versions" ------------------------
BEGIN;

INSERT INTO `document_versions`(`id`,`document_id`,`version_number`,`file_url`,`notes`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', '4', '2', 'https://contoh.example.pdf', 'versi awal amandemen', '2025-10-07 05:18:43.489573', NULL, NULL, NULL, NULL, NULL ),
( '2', '4', '4', 'https://contoh.example.pdf', 'perubahan pasal 5', '2025-10-07 07:56:39.583100', NULL, NULL, NULL, NULL, NULL ),
( '3', '3', '1', 'https://expamle.com/file/peraturan2-VII-2025.pdf', 'Initial version edit', '2025-10-13 04:02:31.511751', NULL, '2025-10-13 11:33:31.000000', NULL, NULL, NULL ),
( '4', '3', '1', 'https://contoh.example.pdf', 'Peraturan contoh example', '2025-10-13 11:20:47.484674', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "documents" --------------------------------
BEGIN;

INSERT INTO `documents`(`id`,`title`,`number`,`type`,`year`,`subject`,`abstract`,`keywords`,`status`,`category_id`,`publisher`,`signed_by`,`date_signed`,`effective_date`,`file_url`,`verification_date`,`verified_by`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '3', 'Peraturan Bupati No. 1 Tahun 2025', '1', 'Peraturan Bupati', '2025', 'Pengelolaan Sampah', 'Peraturan ini mengatur tentang pengelolaan sampah di wilayah Kabupaten Edited.', 'sampah, lingkungan, kebersihan', 'draft', NULL, 'Bagian Hukum', 'Bupati', '2025-01-15', '2025-02-01', 'https://example.com/files/perbup-1-2025.pdf', '2025-01-20 17:00:00.000000', '1', '2025-10-07 03:11:06.302179', NULL, '2025-10-07 03:19:55.000000', NULL, '2025-10-07 03:19:55.000000', NULL ),
( '4', 'Peraturan Bupati No. 1 Tahun 2025', '1', 'Peraturan Bupati', '2025', 'Pengelolaan Sampah Edited', 'Peraturan ini mengatur tentang pengelolaan sampah di wilayah Kabupaten Edited.', 'sampah, lingkungan, kebersihan', 'draft', NULL, 'Bagian Hukum', 'Bupati', '2025-01-15', '2025-02-01', 'https://example.com/files/perbup-1-2025.pdf', '2025-01-20 17:00:00.000000', '1', '2025-10-07 03:25:25.017494', NULL, '2025-10-07 03:27:02.000000', NULL, NULL, NULL ),
( '5', 'Peraturan Bupati No. 23 Tahun 2025', '2', 'Peraturan Bupati', '2025', 'Pajak Restaurant', 'Peraturan ini mengatur tentang pajak restaurant di Kabupaten.', 'restaurant, pajak, makanan', 'draft', NULL, 'Bagian Hukum', 'Bupati', '2025-01-15', '2025-02-01', 'https://example.com/files/perbup-2-2025.pdf', '2025-09-20 07:00:00.000000', '9', '2025-10-07 06:20:50.073744', NULL, '2025-10-07 06:49:31.000000', NULL, NULL, NULL ),
( '6', 'PerBup No. 17 Tahun 2025', '3', 'Peraturan Bupati', '2025', 'Pajak Tanah Edited', 'Peraturan ini mengatur tentang pajak tanah di Kabupaten.', 'restaurant, pajak, makanan', 'draft', NULL, 'Bagian Hukum', 'Bupati', '2025-01-20', '2025-02-01', 'https://example.com/files/perbup-2-2025.pdf', '2025-01-21 07:00:00.000000', '9', '2025-10-07 06:23:54.979766', NULL, '2025-10-07 06:32:40.000000', NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "menus" ------------------------------------
BEGIN;

INSERT INTO `menus`(`id`,`name`,`slug`,`parent_id`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Dashboard', 'dashboard', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'Dokumen', 'dokumen', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'Berita', 'berita', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'Kategori', 'kategori', '2', '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '5', 'Jenis Dokumen', 'jenis-dokumen', '2', '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '6', 'Pengguna', 'pengguna', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "role_menu_permissions" --------------------
BEGIN;

INSERT INTO `role_menu_permissions`(`id`,`role_id`,`menu_id`,`action_id`,`is_allowed`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '20', '1', '5', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '21', '1', '4', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '22', '1', '6', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '23', '1', '3', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '24', '1', '2', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '25', '1', '1', '1', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '26', '1', '5', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '27', '1', '4', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '28', '1', '6', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '29', '1', '3', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '30', '1', '2', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '31', '1', '1', '2', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '32', '1', '5', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '33', '1', '4', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '34', '1', '6', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '35', '1', '3', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '36', '1', '2', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '37', '1', '1', '3', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '38', '1', '5', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '39', '1', '4', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '40', '1', '6', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '41', '1', '3', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '42', '1', '2', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '43', '1', '1', '4', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '44', '1', '5', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '45', '1', '4', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '46', '1', '6', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '47', '1', '3', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '48', '1', '2', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '49', '1', '1', '5', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '50', '1', '5', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '51', '1', '4', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '52', '1', '6', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '53', '1', '3', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '54', '1', '2', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '55', '1', '1', '6', '1', '2025-10-20 09:06:48.000000', NULL, NULL, NULL, NULL, NULL ),
( '83', '2', '2', '5', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '84', '2', '2', '2', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '85', '2', '4', '5', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '86', '2', '4', '2', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '87', '2', '5', '5', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '88', '2', '5', '2', '1', '2025-10-20 09:07:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '90', '3', '5', '1', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '91', '3', '4', '1', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '92', '3', '2', '1', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '93', '3', '5', '2', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '94', '3', '4', '2', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '95', '3', '2', '2', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '96', '3', '5', '3', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '97', '3', '4', '3', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '98', '3', '2', '3', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '99', '3', '5', '4', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '100', '3', '4', '4', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '101', '3', '2', '4', '1', '2025-10-20 09:07:13.000000', NULL, NULL, NULL, NULL, NULL ),
( '105', '4', '3', '1', '1', '2025-10-20 09:07:22.000000', NULL, NULL, NULL, NULL, NULL ),
( '106', '4', '3', '2', '1', '2025-10-20 09:07:22.000000', NULL, NULL, NULL, NULL, NULL ),
( '107', '4', '3', '3', '1', '2025-10-20 09:07:22.000000', NULL, NULL, NULL, NULL, NULL ),
( '108', '4', '3', '4', '1', '2025-10-20 09:07:22.000000', NULL, NULL, NULL, NULL, NULL ),
( '109', '4', '3', '6', '1', '2025-10-20 09:07:22.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "roles" ------------------------------------
BEGIN;

INSERT INTO `roles`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'admin', 'Administrator dengan akses penuh', '2025-10-20 09:03:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'verifikator', 'Memverifikasi dokumen hukum', '2025-10-20 09:03:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'petugas_dokumen', 'Mengelola dokumen hukum', '2025-10-20 09:03:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'petugas_konten', 'Mengelola konten berita & informasi', '2025-10-20 09:03:43.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "users" ------------------------------------
BEGIN;

INSERT INTO `users`(`id`,`name`,`email`,`password_hash`,`role_id`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Admin JDIH', 'admin@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '1', '2025-10-20 09:09:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'Verifikator JDIH', 'verifikator@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '2', '2025-10-20 09:09:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'Petugas Dokumen', 'dokumen@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '3', '2025-10-20 09:09:03.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'Petugas Konten', 'konten@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '4', '2025-10-20 09:09:03.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- CREATE INDEX "fk_audit_logs_user" ---------------------------
CREATE INDEX `fk_audit_logs_user` USING BTREE ON `audit_logs`( `user_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_doc_versions_document" ---------------------
CREATE INDEX `fk_doc_versions_document` USING BTREE ON `document_versions`( `document_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_documents_category" ------------------------
CREATE INDEX `fk_documents_category` USING BTREE ON `documents`( `category_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_documents_verified_by" ---------------------
CREATE INDEX `fk_documents_verified_by` USING BTREE ON `documents`( `verified_by` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_menus_parent" ------------------------------
CREATE INDEX `fk_menus_parent` USING BTREE ON `menus`( `parent_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_rmp_action" --------------------------------
CREATE INDEX `fk_rmp_action` USING BTREE ON `role_menu_permissions`( `action_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_rmp_menu" ----------------------------------
CREATE INDEX `fk_rmp_menu` USING BTREE ON `role_menu_permissions`( `menu_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_rmp_role" ----------------------------------
CREATE INDEX `fk_rmp_role` USING BTREE ON `role_menu_permissions`( `role_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_users_role" --------------------------------
CREATE INDEX `fk_users_role` USING BTREE ON `users`( `role_id` );
-- -------------------------------------------------------------


-- CREATE LINK "fk_audit_logs_user" ----------------------------
ALTER TABLE `audit_logs`
	ADD CONSTRAINT `fk_audit_logs_user` FOREIGN KEY ( `user_id` )
	REFERENCES `users`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_documents_category" -------------------------
ALTER TABLE `documents`
	ADD CONSTRAINT `fk_documents_category` FOREIGN KEY ( `category_id` )
	REFERENCES `document_categories`( `id` )
	ON DELETE Set NULL
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_documents_verified_by" ----------------------
ALTER TABLE `documents`
	ADD CONSTRAINT `fk_documents_verified_by` FOREIGN KEY ( `verified_by` )
	REFERENCES `users`( `id` )
	ON DELETE Set NULL
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_doc_versions_document" ----------------------
ALTER TABLE `document_versions`
	ADD CONSTRAINT `fk_doc_versions_document` FOREIGN KEY ( `document_id` )
	REFERENCES `documents`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_menus_parent" -------------------------------
ALTER TABLE `menus`
	ADD CONSTRAINT `fk_menus_parent` FOREIGN KEY ( `parent_id` )
	REFERENCES `menus`( `id` )
	ON DELETE Set NULL
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_rmp_action" ---------------------------------
ALTER TABLE `role_menu_permissions`
	ADD CONSTRAINT `fk_rmp_action` FOREIGN KEY ( `action_id` )
	REFERENCES `actions`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_rmp_menu" -----------------------------------
ALTER TABLE `role_menu_permissions`
	ADD CONSTRAINT `fk_rmp_menu` FOREIGN KEY ( `menu_id` )
	REFERENCES `menus`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_rmp_role" -----------------------------------
ALTER TABLE `role_menu_permissions`
	ADD CONSTRAINT `fk_rmp_role` FOREIGN KEY ( `role_id` )
	REFERENCES `roles`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_users_role" ---------------------------------
ALTER TABLE `users`
	ADD CONSTRAINT `fk_users_role` FOREIGN KEY ( `role_id` )
	REFERENCES `roles`( `id` )
	ON DELETE Set NULL
	ON UPDATE No Action;
-- -------------------------------------------------------------


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- ---------------------------------------------------------


