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
AUTO_INCREMENT = 10;
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
AUTO_INCREMENT = 91;
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
AUTO_INCREMENT = 9;
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
AUTO_INCREMENT = 9;
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
AUTO_INCREMENT = 19;
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
AUTO_INCREMENT = 11;
-- -------------------------------------------------------------


-- CREATE TABLE "news" -----------------------------------------
CREATE TABLE `news`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`title` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`slug` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`content` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`thumbnail_url` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`author_id` BigInt( 0 ) UNSIGNED NULL DEFAULT NULL,
	`published_at` DateTime NULL DEFAULT NULL,
	`is_published` TinyInt( 1 ) NULL DEFAULT 0,
	`created_at` DateTime NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DateTime NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` DateTime NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `slug` UNIQUE( `slug` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 6;
-- -------------------------------------------------------------


-- CREATE TABLE "news_categories" ------------------------------
CREATE TABLE `news_categories`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`name` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`slug` VarChar( 100 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	`description` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
	`created_at` DateTime NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DateTime NULL ON UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` DateTime NULL DEFAULT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `slug` UNIQUE( `slug` ),
	CONSTRAINT `uq_news_categories_slug` UNIQUE( `slug` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 7;
-- -------------------------------------------------------------


-- CREATE TABLE "news_category_relations" ----------------------
CREATE TABLE `news_category_relations`( 
	`id` BigInt( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`news_id` BigInt( 0 ) UNSIGNED NOT NULL,
	`category_id` BigInt( 0 ) UNSIGNED NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `uq_news_category` UNIQUE( `news_id`, `category_id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 9;
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
AUTO_INCREMENT = 182;
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
AUTO_INCREMENT = 5;
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
AUTO_INCREMENT = 18;
-- -------------------------------------------------------------


-- CREATE TABLE "visitor_stats" --------------------------------
CREATE TABLE `visitor_stats`( 
	`id` Int( 0 ) UNSIGNED AUTO_INCREMENT NOT NULL,
	`ip_address` VarChar( 45 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
	`user_agent` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
	`visited_at` DateTime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci
ENGINE = InnoDB;
-- -------------------------------------------------------------


-- Dump data of "actions" ----------------------------------
BEGIN;

INSERT INTO `actions`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'create', 'Membuat data baru', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'read', 'Melihat data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'update', 'Mengubah data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'delete', 'Menghapus data', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '5', 'verify', 'Memverifikasi dokumen', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '6', 'publish', 'Mempublikasikan konten', '2025-10-20 09:05:43.000000', NULL, NULL, NULL, NULL, NULL ),
( '9', 'manage', 'Mengorganisir data', '2025-10-21 07:57:46.950838', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "audit_logs" -------------------------------
-- ---------------------------------------------------------


-- Dump data of "document_categories" ----------------------
BEGIN;

INSERT INTO `document_categories`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Peraturan Pemerintah', 'Dokumen resmi yang dikeluarkan oleh pemerintah pusat.', '2025-10-21 09:49:15.000000', '1', NULL, NULL, NULL, NULL ),
( '2', 'Peraturan Daerah', 'Dokumen yang ditetapkan oleh pemerintah daerah.', '2025-10-21 09:49:15.000000', '1', NULL, NULL, NULL, NULL ),
( '3', 'Keputusan Menteri', 'Keputusan yang dikeluarkan oleh menteri terkait bidang tertentu.', '2025-10-21 09:49:15.000000', '1', NULL, NULL, NULL, NULL ),
( '4', 'Instruksi Presiden', 'Perintah langsung dari presiden kepada kementerian/lembaga terkait.', '2025-10-21 09:49:15.000000', '1', NULL, NULL, NULL, NULL ),
( '5', 'Surat Edaran', 'Surat pemberitahuan resmi kepada instansi terkait.', '2025-10-21 09:49:15.000000', '1', NULL, NULL, NULL, NULL ),
( '9', 'Peraturen Produsen Minuman', 'Peraturan tentang produsen minuman di kabupaten Lamongan.', '2025-10-23 03:57:22.459936', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "document_versions" ------------------------
BEGIN;

INSERT INTO `document_versions`(`id`,`document_id`,`version_number`,`file_url`,`notes`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', '1', '1', '/uploads/docs/pp-air-v1.pdf', 'Draft awal peraturan', '2025-10-21 09:50:53.000000', '3', NULL, NULL, NULL, NULL ),
( '2', '1', '2', '/uploads/docs/pp-air-v2.pdf', 'Perubahan pasal 5 & 7', '2025-10-21 09:50:53.000000', '3', NULL, NULL, NULL, NULL ),
( '3', '1', '3', '/uploads/docs/pp-air-v3.pdf', 'Versi final setelah verifikasi', '2025-10-21 09:50:53.000000', '2', NULL, NULL, NULL, NULL ),
( '4', '2', '1', '/uploads/docs/perda-kebersihan-v1.pdf', 'Rancangan awal', '2025-10-21 09:50:53.000000', '4', NULL, NULL, NULL, NULL ),
( '5', '2', '2', '/uploads/docs/perda-kebersihan-v2.pdf', 'Revisi berdasarkan masukan DPRD', '2025-10-21 09:50:53.000000', '4', NULL, NULL, NULL, NULL ),
( '6', '3', '1', '/uploads/docs/kmk-rumah-sakit-v1.pdf', 'Draf awal keputusan', '2025-10-21 09:50:53.000000', '4', NULL, NULL, NULL, NULL ),
( '7', '4', '1', '/uploads/docs/inpres-listrik-v1.pdf', 'Instruksi awal', '2025-10-21 09:50:53.000000', '1', NULL, NULL, NULL, NULL ),
( '8', '4', '2', '/uploads/docs/inpres-listrik-v2.pdf', 'Perbaikan tanggal implementasi', '2025-10-21 09:50:53.000000', '1', NULL, NULL, NULL, NULL ),
( '9', '5', '1', '/uploads/docs/se-desa-v1.pdf', 'Versi awal surat edaran', '2025-10-21 09:50:53.000000', '3', NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "documents" --------------------------------
BEGIN;

INSERT INTO `documents`(`id`,`title`,`number`,`type`,`year`,`subject`,`abstract`,`keywords`,`status`,`category_id`,`publisher`,`signed_by`,`date_signed`,`effective_date`,`file_url`,`verification_date`,`verified_by`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Peraturan Pemerintah tentang Pengelolaan Air', 'PP-01/2023', 'Peraturan Pemerintah', '2023', 'Mengatur tata kelola sumber daya air nasional.', 'Peraturan ini mengatur hak, kewajiban, dan sanksi dalam pengelolaan air di Indonesia.', 'air, sumber daya, PP', 'published', '1', 'Sekretariat Negara', 'Presiden Republik Indonesia', '2023-01-15', '2023-02-01', '/uploads/docs/pp-air-2023.pdf', '2023-01-20 09:00:00.000000', '2', '2025-10-21 09:49:56.000000', '3', NULL, NULL, NULL, NULL ),
( '2', 'Peraturan Daerah Kota Bandung tentang Kebersihan', 'PERDA-02/2024', 'Peraturan Daerah', '2024', 'Kewajiban warga dalam menjaga kebersihan lingkungan.', 'Peraturan ini bertujuan menciptakan lingkungan bersih dan sehat di wilayah Kota Bandung.', 'kebersihan, lingkungan, bandung', 'verified', '2', 'Pemerintah Kota Bandung', 'Walikota Bandung', '2024-03-10', '2024-04-01', '/uploads/docs/perda-kebersihan.pdf', '2024-03-20 08:30:00.000000', '2', '2025-10-21 09:49:56.000000', '4', NULL, NULL, NULL, NULL ),
( '3', 'Keputusan Menteri Kesehatan tentang Standar Rumah Sakit', 'KMK-03/2025', 'Keputusan Menteri', '2025', 'Menetapkan standar pelayanan dan fasilitas rumah sakit.', 'Dokumen ini menjadi pedoman utama akreditasi rumah sakit nasional.', 'kesehatan, rumah sakit, standar', 'archived', '3', 'Kementerian Kesehatan', 'Menteri Kesehatan', NULL, '2025-10-21', NULL, '2025-10-21 19:12:40.896000', '2', '2025-10-21 09:49:56.000000', '4', NULL, NULL, NULL, NULL ),
( '4', 'Instruksi Presiden tentang Penggunaan Kendaraan Listrik', 'INPRES-01/2025', 'Instruksi Presiden', '2025', 'Penggunaan kendaraan listrik di instansi pemerintahan.', 'Instruksi ini mewajibkan setiap instansi untuk mulai menggunakan kendaraan listrik pada 2026.', 'kendaraan listrik, energi, inpres', 'verified', '4', 'Sekretariat Kabinet', 'Presiden Republik Indonesia', '2025-01-05', '2025-01-10', '/uploads/docs/inpres-kendaraan.pdf', '2025-01-07 10:00:00.000000', '2', '2025-10-21 09:49:56.000000', '1', NULL, NULL, NULL, NULL ),
( '5', 'Surat Edaran Menteri Dalam Negeri tentang Administrasi Desa', 'SE-01/2024', 'Surat Edaran', '2024', 'Administrasi desa dan transparansi keuangan desa.', 'Mendorong transparansi dalam pengelolaan dana desa.', 'desa, administrasi, keuangan', 'published', '5', 'Kemendagri', 'Menteri Dalam Negeri', '2024-02-20', '2024-03-01', '/uploads/docs/se-admin-desa.pdf', '2024-02-25 09:15:00.000000', '2', '2025-10-21 09:49:56.000000', '3', NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "menus" ------------------------------------
BEGIN;

INSERT INTO `menus`(`id`,`name`,`slug`,`parent_id`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Dashboard', 'dashboard', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'Dokumen', 'dokumen', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '3', 'Berita', 'berita', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '4', 'Dokumen Kategori', 'dokumen-kategori', '2', '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '5', 'Dokumen Versi', 'dokumen-versi', '2', '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '6', 'Pengguna', 'pengguna', NULL, '2025-10-20 09:06:16.000000', NULL, NULL, NULL, NULL, NULL ),
( '7', 'Roles Management', 'roles', NULL, '2025-10-21 07:57:46.921478', NULL, NULL, NULL, NULL, NULL ),
( '8', 'Audit Logs', 'audit-logs', NULL, '2025-10-21 08:28:24.682103', NULL, NULL, NULL, NULL, NULL ),
( '9', 'Statistik Pengunjung', 'visitor-stats', NULL, '2025-10-23 04:06:57.000000', NULL, NULL, NULL, NULL, NULL ),
( '10', 'Kategori Berita', 'berita-kategori', NULL, '2025-10-23 10:06:25.902141', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "news" -------------------------------------
BEGIN;

INSERT INTO `news`(`id`,`title`,`slug`,`content`,`thumbnail_url`,`author_id`,`published_at`,`is_published`,`created_at`,`updated_at`,`deleted_at`) VALUES 
( '1', 'RUU Perlindungan Data Pribadi Disahkan', 'ruu-perlindungan-data-pribadi-disahkan', 'Pemerintah secara resmi mengesahkan RUU Perlindungan Data Pribadi menjadi undang-undang...', 'https://example.com/thumbs/pdp.jpg', '3', '2025-10-23 12:54:33', '1', '2025-10-23 12:54:33', '2025-10-23 12:54:33', NULL ),
( '2', 'Peraturan Daerah Kota Surabaya Tentang Sampah Digital', 'perda-surabaya-sampah-digital', 'Pemerintah Kota Surabaya mengeluarkan perda baru mengenai pengelolaan sampah digital...', 'https://example.com/thumbs/perda-surabaya.jpg', '3', '2025-10-23 12:54:33', '1', '2025-10-23 12:54:33', '2025-10-23 12:54:33', NULL ),
( '3', 'Putusan MK Tentang Kewenangan Mahkamah Konstitusi', 'putusan-mk-kewenangan', 'Mahkamah Konstitusi memutuskan perluasan kewenangannya terkait sengketa hasil pemilihan legislatif...', 'https://example.com/thumbs/mk.jpg', '3', NULL, '0', '2025-10-23 12:54:33', '2025-10-23 12:54:33', NULL ),
( '4', 'UU Nomor 5 Tahun 2025 Tentang Tata Pemerintahan Daerah', 'uu-5-2025-tata-pemerintahan-daerah', 'Dewan Perwakilan Rakyat telah mengesahkan UU No. 5 Tahun 2025 tentang Tata Pemerintahan Daerah...', 'https://example.com/thumbs/uu5-2025.jpg', '3', '2025-10-23 12:54:33', '1', '2025-10-23 12:54:33', '2025-10-23 12:54:33', NULL ),
( '5', 'Kasus Korupsi Dana Hibah Ditangani KPK', 'kasus-korupsi-dana-hibah-ditangani-kpk', 'Komisi Pemberantasan Korupsi (KPK) menahan dua pejabat atas dugaan korupsi dana hibah daerah...', 'https://example.com/thumbs/kpk.jpg', '3', '2025-10-23 12:54:33', '1', '2025-10-23 12:54:33', '2025-10-23 12:54:33', NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "news_categories" --------------------------
BEGIN;

INSERT INTO `news_categories`(`id`,`name`,`slug`,`description`,`created_at`,`updated_at`,`deleted_at`) VALUES 
( '1', 'Hukum Tata Negara', 'hukum-tata-negara', 'Kategori berita seputar hukum ketatanegaraan.', '2025-10-23 12:53:56', '2025-10-23 12:53:56', NULL ),
( '2', 'Peraturan Daerah', 'peraturan-daerah', 'Berita mengenai perda dan kebijakan daerah.', '2025-10-23 12:53:56', '2025-10-23 12:53:56', NULL ),
( '3', 'Peradilan dan Yurisprudensi', 'peradilan-yurisprudensi', 'Informasi tentang peradilan dan putusan penting.', '2025-10-23 12:53:56', '2025-10-23 12:53:56', NULL ),
( '4', 'Perundang-undangan', 'perundang-undangan', 'Update tentang undang-undang terbaru.', '2025-10-23 12:53:56', '2025-10-23 12:53:56', NULL ),
( '5', 'Hukum Pidana', 'hukum-pidana', 'Berita dan analisis hukum pidana terkini.', '2025-10-23 12:53:56', '2025-10-23 12:53:56', NULL ),
( '6', 'Test Hukum Edited', 'test-hukum Edited', 'Kategori berita seputar testing hukum tata negara Edited', '2025-10-27 04:54:58', '2025-10-27 04:57:51', NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "news_category_relations" ------------------
BEGIN;

INSERT INTO `news_category_relations`(`id`,`news_id`,`category_id`) VALUES 
( '2', '1', '1' ),
( '1', '1', '4' ),
( '3', '2', '2' ),
( '4', '3', '1' ),
( '5', '3', '3' ),
( '7', '4', '2' ),
( '6', '4', '4' ),
( '8', '5', '5' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "role_menu_permissions" --------------------
BEGIN;

INSERT INTO `role_menu_permissions`(`id`,`role_id`,`menu_id`,`action_id`,`is_allowed`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '64', '2', '5', '2', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '65', '2', '4', '2', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '66', '2', '2', '2', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '67', '2', '5', '5', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '68', '2', '4', '5', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '69', '2', '2', '5', '1', '2025-10-23 04:39:10.853211', NULL, NULL, NULL, NULL, NULL ),
( '71', '3', '5', '1', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '72', '3', '4', '1', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '73', '3', '2', '1', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '74', '3', '5', '2', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '75', '3', '4', '2', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '76', '3', '2', '2', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '77', '3', '5', '3', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '78', '3', '4', '3', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '79', '3', '2', '3', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '80', '3', '5', '4', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '81', '3', '4', '4', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '82', '3', '2', '4', '1', '2025-10-23 04:39:33.434524', NULL, NULL, NULL, NULL, NULL ),
( '86', '4', '3', '1', '1', '2025-10-23 04:39:47.557264', NULL, NULL, NULL, NULL, NULL ),
( '87', '4', '3', '2', '1', '2025-10-23 04:39:47.557264', NULL, NULL, NULL, NULL, NULL ),
( '88', '4', '3', '3', '1', '2025-10-23 04:39:47.557264', NULL, NULL, NULL, NULL, NULL ),
( '89', '4', '3', '6', '1', '2025-10-23 04:39:47.557264', NULL, NULL, NULL, NULL, NULL ),
( '93', '4', '9', '2', '1', '2025-10-23 04:39:47.583911', NULL, NULL, NULL, NULL, NULL ),
( '101', '4', '10', '1', '1', '2025-10-23 10:35:23.044539', NULL, NULL, NULL, NULL, NULL ),
( '102', '4', '10', '2', '1', '2025-10-23 10:35:23.044539', NULL, NULL, NULL, NULL, NULL ),
( '103', '4', '10', '3', '1', '2025-10-23 10:35:23.044539', NULL, NULL, NULL, NULL, NULL ),
( '104', '4', '10', '4', '1', '2025-10-23 10:35:23.044539', NULL, NULL, NULL, NULL, NULL ),
( '112', '1', '1', '9', '1', '2025-10-27 05:56:36.402540', NULL, NULL, NULL, NULL, NULL ),
( '113', '1', '1', '6', '1', '2025-10-27 05:56:36.409842', NULL, NULL, NULL, NULL, NULL ),
( '114', '1', '1', '5', '1', '2025-10-27 05:56:36.414773', NULL, NULL, NULL, NULL, NULL ),
( '115', '1', '1', '4', '1', '2025-10-27 05:56:36.421601', NULL, NULL, NULL, NULL, NULL ),
( '116', '1', '1', '3', '1', '2025-10-27 05:56:36.426630', NULL, NULL, NULL, NULL, NULL ),
( '117', '1', '1', '2', '1', '2025-10-27 05:56:36.430992', NULL, NULL, NULL, NULL, NULL ),
( '118', '1', '1', '1', '1', '2025-10-27 05:56:36.436725', NULL, NULL, NULL, NULL, NULL ),
( '119', '1', '2', '9', '1', '2025-10-27 05:56:36.442629', NULL, NULL, NULL, NULL, NULL ),
( '120', '1', '2', '6', '1', '2025-10-27 05:56:36.448132', NULL, NULL, NULL, NULL, NULL ),
( '121', '1', '2', '5', '1', '2025-10-27 05:56:36.453414', NULL, NULL, NULL, NULL, NULL ),
( '122', '1', '2', '4', '1', '2025-10-27 05:56:36.459177', NULL, NULL, NULL, NULL, NULL ),
( '123', '1', '2', '3', '1', '2025-10-27 05:56:36.464474', NULL, NULL, NULL, NULL, NULL ),
( '124', '1', '2', '2', '1', '2025-10-27 05:56:36.469800', NULL, NULL, NULL, NULL, NULL ),
( '125', '1', '2', '1', '1', '2025-10-27 05:56:36.476671', NULL, NULL, NULL, NULL, NULL ),
( '126', '1', '3', '9', '1', '2025-10-27 05:56:36.481848', NULL, NULL, NULL, NULL, NULL ),
( '127', '1', '3', '6', '1', '2025-10-27 05:56:36.488667', NULL, NULL, NULL, NULL, NULL ),
( '128', '1', '3', '5', '1', '2025-10-27 05:56:36.493859', NULL, NULL, NULL, NULL, NULL ),
( '129', '1', '3', '4', '1', '2025-10-27 05:56:36.498342', NULL, NULL, NULL, NULL, NULL ),
( '130', '1', '3', '3', '1', '2025-10-27 05:56:36.503585', NULL, NULL, NULL, NULL, NULL ),
( '131', '1', '3', '2', '1', '2025-10-27 05:56:36.509232', NULL, NULL, NULL, NULL, NULL ),
( '132', '1', '3', '1', '1', '2025-10-27 05:56:36.514680', NULL, NULL, NULL, NULL, NULL ),
( '133', '1', '6', '9', '1', '2025-10-27 05:56:36.521264', NULL, NULL, NULL, NULL, NULL ),
( '134', '1', '6', '6', '1', '2025-10-27 05:56:36.527190', NULL, NULL, NULL, NULL, NULL ),
( '135', '1', '6', '5', '1', '2025-10-27 05:56:36.530745', NULL, NULL, NULL, NULL, NULL ),
( '136', '1', '6', '4', '1', '2025-10-27 05:56:36.536606', NULL, NULL, NULL, NULL, NULL ),
( '137', '1', '6', '3', '1', '2025-10-27 05:56:36.542699', NULL, NULL, NULL, NULL, NULL ),
( '138', '1', '6', '2', '1', '2025-10-27 05:56:36.546864', NULL, NULL, NULL, NULL, NULL ),
( '139', '1', '6', '1', '1', '2025-10-27 05:56:36.551567', NULL, NULL, NULL, NULL, NULL ),
( '140', '1', '7', '9', '1', '2025-10-27 05:56:36.556883', NULL, NULL, NULL, NULL, NULL ),
( '141', '1', '7', '6', '1', '2025-10-27 05:56:36.563251', NULL, NULL, NULL, NULL, NULL ),
( '142', '1', '7', '5', '1', '2025-10-27 05:56:36.569280', NULL, NULL, NULL, NULL, NULL ),
( '143', '1', '7', '4', '1', '2025-10-27 05:56:36.575274', NULL, NULL, NULL, NULL, NULL ),
( '144', '1', '7', '3', '1', '2025-10-27 05:56:36.579783', NULL, NULL, NULL, NULL, NULL ),
( '145', '1', '7', '2', '1', '2025-10-27 05:56:36.584934', NULL, NULL, NULL, NULL, NULL ),
( '146', '1', '7', '1', '1', '2025-10-27 05:56:36.591173', NULL, NULL, NULL, NULL, NULL ),
( '147', '1', '8', '9', '1', '2025-10-27 05:56:36.595752', NULL, NULL, NULL, NULL, NULL ),
( '148', '1', '8', '6', '1', '2025-10-27 05:56:36.601129', NULL, NULL, NULL, NULL, NULL ),
( '149', '1', '8', '5', '1', '2025-10-27 05:56:36.607292', NULL, NULL, NULL, NULL, NULL ),
( '150', '1', '8', '4', '1', '2025-10-27 05:56:36.611942', NULL, NULL, NULL, NULL, NULL ),
( '151', '1', '8', '3', '1', '2025-10-27 05:56:36.615613', NULL, NULL, NULL, NULL, NULL ),
( '152', '1', '8', '2', '1', '2025-10-27 05:56:36.621751', NULL, NULL, NULL, NULL, NULL ),
( '153', '1', '8', '1', '1', '2025-10-27 05:56:36.626889', NULL, NULL, NULL, NULL, NULL ),
( '154', '1', '9', '9', '1', '2025-10-27 05:56:36.630982', NULL, NULL, NULL, NULL, NULL ),
( '155', '1', '9', '6', '1', '2025-10-27 05:56:36.635791', NULL, NULL, NULL, NULL, NULL ),
( '156', '1', '9', '5', '1', '2025-10-27 05:56:36.640630', NULL, NULL, NULL, NULL, NULL ),
( '157', '1', '9', '4', '1', '2025-10-27 05:56:36.644448', NULL, NULL, NULL, NULL, NULL ),
( '158', '1', '9', '3', '1', '2025-10-27 05:56:36.648170', NULL, NULL, NULL, NULL, NULL ),
( '159', '1', '9', '2', '1', '2025-10-27 05:56:36.653290', NULL, NULL, NULL, NULL, NULL ),
( '160', '1', '9', '1', '1', '2025-10-27 05:56:36.658190', NULL, NULL, NULL, NULL, NULL ),
( '161', '1', '4', '9', '1', '2025-10-27 05:56:36.662693', NULL, NULL, NULL, NULL, NULL ),
( '162', '1', '4', '6', '1', '2025-10-27 05:56:36.666438', NULL, NULL, NULL, NULL, NULL ),
( '163', '1', '4', '5', '1', '2025-10-27 05:56:36.671540', NULL, NULL, NULL, NULL, NULL ),
( '164', '1', '4', '4', '1', '2025-10-27 05:56:36.675759', NULL, NULL, NULL, NULL, NULL ),
( '165', '1', '4', '3', '1', '2025-10-27 05:56:36.679372', NULL, NULL, NULL, NULL, NULL ),
( '166', '1', '4', '2', '1', '2025-10-27 05:56:36.682888', NULL, NULL, NULL, NULL, NULL ),
( '167', '1', '4', '1', '1', '2025-10-27 05:56:36.688081', NULL, NULL, NULL, NULL, NULL ),
( '168', '1', '5', '9', '1', '2025-10-27 05:56:36.692317', NULL, NULL, NULL, NULL, NULL ),
( '169', '1', '5', '6', '1', '2025-10-27 05:56:36.695775', NULL, NULL, NULL, NULL, NULL ),
( '170', '1', '5', '5', '1', '2025-10-27 05:56:36.699634', NULL, NULL, NULL, NULL, NULL ),
( '171', '1', '5', '4', '1', '2025-10-27 05:56:36.704604', NULL, NULL, NULL, NULL, NULL ),
( '172', '1', '5', '3', '1', '2025-10-27 05:56:36.708783', NULL, NULL, NULL, NULL, NULL ),
( '173', '1', '5', '2', '1', '2025-10-27 05:56:36.712160', NULL, NULL, NULL, NULL, NULL ),
( '174', '1', '5', '1', '1', '2025-10-27 05:56:36.715631', NULL, NULL, NULL, NULL, NULL ),
( '175', '1', '10', '1', '1', '2025-10-27 05:56:36.721195', NULL, NULL, NULL, NULL, NULL ),
( '176', '1', '10', '2', '1', '2025-10-27 05:56:36.725717', NULL, NULL, NULL, NULL, NULL ),
( '177', '1', '10', '3', '1', '2025-10-27 05:56:36.729326', NULL, NULL, NULL, NULL, NULL ),
( '178', '1', '10', '4', '1', '2025-10-27 05:56:36.732741', NULL, NULL, NULL, NULL, NULL ),
( '179', '1', '10', '5', '1', '2025-10-27 05:56:36.738368', NULL, NULL, NULL, NULL, NULL ),
( '180', '1', '10', '6', '1', '2025-10-27 05:56:36.743338', NULL, NULL, NULL, NULL, NULL ),
( '181', '1', '10', '9', '1', '2025-10-27 05:56:36.747121', NULL, NULL, NULL, NULL, NULL );
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
( '3', 'Petugas Dokumen', 'dokumen@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '3', '2025-10-20 09:09:03.000000', NULL, '2025-10-21 07:54:11.000000', NULL, NULL, NULL ),
( '4', 'Petugas Konten', 'konten@jdih.go.id', '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q', '4', '2025-10-20 09:09:03.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "visitor_stats" ----------------------------
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


-- CREATE INDEX "fk_news_author" -------------------------------
CREATE INDEX `fk_news_author` USING BTREE ON `news`( `author_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "fk_news_relation_category" --------------------
CREATE INDEX `fk_news_relation_category` USING BTREE ON `news_category_relations`( `category_id` );
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


-- CREATE INDEX "idx_ip_address" -------------------------------
CREATE INDEX `idx_ip_address` USING BTREE ON `visitor_stats`( `ip_address` );
-- -------------------------------------------------------------


-- CREATE INDEX "idx_visited_at" -------------------------------
CREATE INDEX `idx_visited_at` USING BTREE ON `visitor_stats`( `visited_at` );
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


-- CREATE LINK "fk_news_author" --------------------------------
ALTER TABLE `news`
	ADD CONSTRAINT `fk_news_author` FOREIGN KEY ( `author_id` )
	REFERENCES `users`( `id` )
	ON DELETE Set NULL
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_news_relation_category" ---------------------
ALTER TABLE `news_category_relations`
	ADD CONSTRAINT `fk_news_relation_category` FOREIGN KEY ( `category_id` )
	REFERENCES `news_categories`( `id` )
	ON DELETE Cascade
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "fk_news_relation_news" -------------------------
ALTER TABLE `news_category_relations`
	ADD CONSTRAINT `fk_news_relation_news` FOREIGN KEY ( `news_id` )
	REFERENCES `news`( `id` )
	ON DELETE Cascade
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


