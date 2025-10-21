-- Valentina Studio --
-- MySQL dump --
-- ---------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
-- ---------------------------------------------------------

-- CREATE TABLE "actions" --------------------------------------
CREATE TABLE `actions` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 10;
-- -------------------------------------------------------------

-- CREATE TABLE "audit_logs" -----------------------------------
CREATE TABLE `audit_logs` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `user_id` BigInt(0) UNSIGNED NOT NULL,
    `action` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `entity` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `entity_id` BigInt(0) UNSIGNED NOT NULL,
    `old_data` JSON NULL DEFAULT NULL,
    `new_data` JSON NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 23;
-- -------------------------------------------------------------

-- CREATE TABLE "document_categories" --------------------------
CREATE TABLE `document_categories` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 8;
-- -------------------------------------------------------------

-- CREATE TABLE "document_versions" ----------------------------
CREATE TABLE `document_versions` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `document_id` BigInt(0) UNSIGNED NOT NULL,
    `version_number` Int(0) NOT NULL,
    `file_url` VarChar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `notes` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 5;
-- -------------------------------------------------------------

-- CREATE TABLE "documents" ------------------------------------
CREATE TABLE `documents` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `title` VarChar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `number` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `type` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `year` Int(0) NOT NULL,
    `subject` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `abstract` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `keywords` VarChar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `status` Enum(
        'draft',
        'verified',
        'published',
        'archived'
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'draft',
    `category_id` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `publisher` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `signed_by` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `date_signed` Date NULL DEFAULT NULL,
    `effective_date` Date NULL DEFAULT NULL,
    `file_url` VarChar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `verification_date` DateTime NULL DEFAULT NULL,
    `verified_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 7;
-- -------------------------------------------------------------

-- CREATE TABLE "menus" ----------------------------------------
CREATE TABLE `menus` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `slug` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `parent_id` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 9;
-- -------------------------------------------------------------

-- CREATE TABLE "role_menu_permissions" ------------------------
CREATE TABLE `role_menu_permissions` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `role_id` BigInt(0) UNSIGNED NOT NULL,
    `menu_id` BigInt(0) UNSIGNED NOT NULL,
    `action_id` BigInt(0) UNSIGNED NOT NULL,
    `is_allowed` TinyInt(1) NOT NULL DEFAULT 1,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 146;
-- -------------------------------------------------------------

-- CREATE TABLE "roles" ----------------------------------------
CREATE TABLE `roles` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VarChar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `description` Text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 5;
-- -------------------------------------------------------------

-- CREATE TABLE "users" ----------------------------------------
CREATE TABLE `users` (
    `id` BigInt(0) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `email` VarChar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `password_hash` VarChar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    `role_id` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `created_at` DateTime NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)',
    `created_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `updated_at` DateTime NULL DEFAULT NULL,
    `updated_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    `deleted_at` DateTime NULL DEFAULT NULL,
    `deleted_by` BigInt(0) UNSIGNED NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `email` UNIQUE (`email`)
) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ENGINE = InnoDB AUTO_INCREMENT = 18;
-- -------------------------------------------------------------

-- Dump data of "actions" ----------------------------------
BEGIN;

INSERT INTO
    `actions` (
        `id`,
        `name`,
        `description`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'create',
        'Membuat data baru',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'read',
        'Melihat data',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'update',
        'Mengubah data',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'delete',
        'Menghapus data',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '5',
        'verify',
        'Memverifikasi dokumen',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '6',
        'publish',
        'Mempublikasikan konten',
        '2025-10-20 09:05:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '9',
        'manage',
        'Mengorganisir data',
        '2025-10-21 07:57:46.950838',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "audit_logs" -------------------------------
-- ---------------------------------------------------------

-- Dump data of "document_categories" ----------------------
BEGIN;

INSERT INTO
    `document_categories` (
        `id`,
        `name`,
        `description`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'Peraturan Pemerintah',
        'Dokumen resmi yang dikeluarkan oleh pemerintah pusat.',
        '2025-10-21 09:49:15.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'Peraturan Daerah',
        'Dokumen yang ditetapkan oleh pemerintah daerah.',
        '2025-10-21 09:49:15.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'Keputusan Menteri',
        'Keputusan yang dikeluarkan oleh menteri terkait bidang tertentu.',
        '2025-10-21 09:49:15.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'Instruksi Presiden',
        'Perintah langsung dari presiden kepada kementerian/lembaga terkait.',
        '2025-10-21 09:49:15.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '5',
        'Surat Edaran',
        'Surat pemberitahuan resmi kepada instansi terkait.',
        '2025-10-21 09:49:15.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "document_versions" ------------------------
BEGIN;

INSERT INTO
    `document_versions` (
        `id`,
        `document_id`,
        `version_number`,
        `file_url`,
        `notes`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        '1',
        '1',
        '/uploads/docs/pp-air-v1.pdf',
        'Draft awal peraturan',
        '2025-10-21 09:50:53.000000',
        '3',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        '1',
        '2',
        '/uploads/docs/pp-air-v2.pdf',
        'Perubahan pasal 5 & 7',
        '2025-10-21 09:50:53.000000',
        '3',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        '1',
        '3',
        '/uploads/docs/pp-air-v3.pdf',
        'Versi final setelah verifikasi',
        '2025-10-21 09:50:53.000000',
        '2',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        '2',
        '1',
        '/uploads/docs/perda-kebersihan-v1.pdf',
        'Rancangan awal',
        '2025-10-21 09:50:53.000000',
        '4',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '5',
        '2',
        '2',
        '/uploads/docs/perda-kebersihan-v2.pdf',
        'Revisi berdasarkan masukan DPRD',
        '2025-10-21 09:50:53.000000',
        '4',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '6',
        '3',
        '1',
        '/uploads/docs/kmk-rumah-sakit-v1.pdf',
        'Draf awal keputusan',
        '2025-10-21 09:50:53.000000',
        '4',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '7',
        '4',
        '1',
        '/uploads/docs/inpres-listrik-v1.pdf',
        'Instruksi awal',
        '2025-10-21 09:50:53.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '8',
        '4',
        '2',
        '/uploads/docs/inpres-listrik-v2.pdf',
        'Perbaikan tanggal implementasi',
        '2025-10-21 09:50:53.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '9',
        '5',
        '1',
        '/uploads/docs/se-desa-v1.pdf',
        'Versi awal surat edaran',
        '2025-10-21 09:50:53.000000',
        '3',
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "documents" --------------------------------
BEGIN;

INSERT INTO
    `documents` (
        `id`,
        `title`,
        `number`,
        `type`,
        `year`,
        `subject`,
        `abstract`,
        `keywords`,
        `status`,
        `category_id`,
        `publisher`,
        `signed_by`,
        `date_signed`,
        `effective_date`,
        `file_url`,
        `verification_date`,
        `verified_by`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'Peraturan Pemerintah tentang Pengelolaan Air',
        'PP-01/2023',
        'Peraturan Pemerintah',
        '2023',
        'Mengatur tata kelola sumber daya air nasional.',
        'Peraturan ini mengatur hak, kewajiban, dan sanksi dalam pengelolaan air di Indonesia.',
        'air, sumber daya, PP',
        'published',
        '1',
        'Sekretariat Negara',
        'Presiden Republik Indonesia',
        '2023-01-15',
        '2023-02-01',
        '/uploads/docs/pp-air-2023.pdf',
        '2023-01-20 09:00:00.000000',
        '2',
        '2025-10-21 09:49:56.000000',
        '3',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'Peraturan Daerah Kota Bandung tentang Kebersihan',
        'PERDA-02/2024',
        'Peraturan Daerah',
        '2024',
        'Kewajiban warga dalam menjaga kebersihan lingkungan.',
        'Peraturan ini bertujuan menciptakan lingkungan bersih dan sehat di wilayah Kota Bandung.',
        'kebersihan, lingkungan, bandung',
        'verified',
        '2',
        'Pemerintah Kota Bandung',
        'Walikota Bandung',
        '2024-03-10',
        '2024-04-01',
        '/uploads/docs/perda-kebersihan.pdf',
        '2024-03-20 08:30:00.000000',
        '2',
        '2025-10-21 09:49:56.000000',
        '4',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'Keputusan Menteri Kesehatan tentang Standar Rumah Sakit',
        'KMK-03/2025',
        'Keputusan Menteri',
        '2025',
        'Menetapkan standar pelayanan dan fasilitas rumah sakit.',
        'Dokumen ini menjadi pedoman utama akreditasi rumah sakit nasional.',
        'kesehatan, rumah sakit, standar',
        'draft',
        '3',
        'Kementerian Kesehatan',
        'Menteri Kesehatan',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '2025-10-21 09:49:56.000000',
        '4',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'Instruksi Presiden tentang Penggunaan Kendaraan Listrik',
        'INPRES-01/2025',
        'Instruksi Presiden',
        '2025',
        'Penggunaan kendaraan listrik di instansi pemerintahan.',
        'Instruksi ini mewajibkan setiap instansi untuk mulai menggunakan kendaraan listrik pada 2026.',
        'kendaraan listrik, energi, inpres',
        'verified',
        '4',
        'Sekretariat Kabinet',
        'Presiden Republik Indonesia',
        '2025-01-05',
        '2025-01-10',
        '/uploads/docs/inpres-kendaraan.pdf',
        '2025-01-07 10:00:00.000000',
        '2',
        '2025-10-21 09:49:56.000000',
        '1',
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '5',
        'Surat Edaran Menteri Dalam Negeri tentang Administrasi Desa',
        'SE-01/2024',
        'Surat Edaran',
        '2024',
        'Administrasi desa dan transparansi keuangan desa.',
        'Mendorong transparansi dalam pengelolaan dana desa.',
        'desa, administrasi, keuangan',
        'published',
        '5',
        'Kemendagri',
        'Menteri Dalam Negeri',
        '2024-02-20',
        '2024-03-01',
        '/uploads/docs/se-admin-desa.pdf',
        '2024-02-25 09:15:00.000000',
        '2',
        '2025-10-21 09:49:56.000000',
        '3',
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "menus" ------------------------------------
BEGIN;

INSERT INTO
    `menus` (
        `id`,
        `name`,
        `slug`,
        `parent_id`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'Dashboard',
        'dashboard',
        NULL,
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'Dokumen',
        'dokumen',
        NULL,
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'Berita',
        'berita',
        NULL,
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'Dokumen Kategori',
        'dokumen-kategori',
        '2',
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '5',
        'Dokumen Versi',
        'dokumen-versi',
        '2',
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '6',
        'Pengguna',
        'pengguna',
        NULL,
        '2025-10-20 09:06:16.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '7',
        'Roles Management',
        'roles',
        NULL,
        '2025-10-21 07:57:46.921478',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '8',
        'Audit Logs',
        'audit-logs',
        NULL,
        '2025-10-21 08:28:24.682103',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "role_menu_permissions" --------------------
BEGIN;

INSERT INTO
    `role_menu_permissions` (
        `id`,
        `role_id`,
        `menu_id`,
        `action_id`,
        `is_allowed`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '20',
        '1',
        '5',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '21',
        '1',
        '4',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '22',
        '1',
        '6',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '23',
        '1',
        '3',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '24',
        '1',
        '2',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '25',
        '1',
        '1',
        '1',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '26',
        '1',
        '5',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '27',
        '1',
        '4',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '28',
        '1',
        '6',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '29',
        '1',
        '3',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '30',
        '1',
        '2',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '31',
        '1',
        '1',
        '2',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '32',
        '1',
        '5',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '33',
        '1',
        '4',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '34',
        '1',
        '6',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '35',
        '1',
        '3',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '36',
        '1',
        '2',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '37',
        '1',
        '1',
        '3',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '38',
        '1',
        '5',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '39',
        '1',
        '4',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '40',
        '1',
        '6',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '41',
        '1',
        '3',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '42',
        '1',
        '2',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '43',
        '1',
        '1',
        '4',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '44',
        '1',
        '5',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '45',
        '1',
        '4',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '46',
        '1',
        '6',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '47',
        '1',
        '3',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '48',
        '1',
        '2',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '49',
        '1',
        '1',
        '5',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '50',
        '1',
        '5',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '51',
        '1',
        '4',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '52',
        '1',
        '6',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '53',
        '1',
        '3',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '54',
        '1',
        '2',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '55',
        '1',
        '1',
        '6',
        '1',
        '2025-10-20 09:06:48.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '83',
        '2',
        '2',
        '5',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '84',
        '2',
        '2',
        '2',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '85',
        '2',
        '4',
        '5',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '86',
        '2',
        '4',
        '2',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '87',
        '2',
        '5',
        '5',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '88',
        '2',
        '5',
        '2',
        '1',
        '2025-10-20 09:07:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '105',
        '4',
        '3',
        '1',
        '1',
        '2025-10-20 09:07:22.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '106',
        '4',
        '3',
        '2',
        '1',
        '2025-10-20 09:07:22.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '107',
        '4',
        '3',
        '3',
        '1',
        '2025-10-20 09:07:22.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '108',
        '4',
        '3',
        '4',
        '1',
        '2025-10-20 09:07:22.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '109',
        '4',
        '3',
        '6',
        '1',
        '2025-10-20 09:07:22.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '132',
        '3',
        '5',
        '1',
        '1',
        '2025-10-21 07:48:43.472101',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '133',
        '3',
        '5',
        '2',
        '1',
        '2025-10-21 07:48:43.478112',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '134',
        '3',
        '5',
        '3',
        '1',
        '2025-10-21 07:48:43.482587',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '135',
        '3',
        '5',
        '4',
        '1',
        '2025-10-21 07:48:43.486847',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '136',
        '3',
        '4',
        '1',
        '1',
        '2025-10-21 07:48:43.492257',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '137',
        '3',
        '4',
        '2',
        '1',
        '2025-10-21 07:48:43.497403',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '138',
        '3',
        '4',
        '3',
        '1',
        '2025-10-21 07:48:43.501887',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '139',
        '3',
        '4',
        '4',
        '1',
        '2025-10-21 07:48:43.507914',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '140',
        '3',
        '2',
        '1',
        '1',
        '2025-10-21 07:48:43.512438',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '141',
        '3',
        '2',
        '2',
        '1',
        '2025-10-21 07:48:43.516384',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '142',
        '3',
        '2',
        '3',
        '1',
        '2025-10-21 07:48:43.520781',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '143',
        '3',
        '2',
        '4',
        '1',
        '2025-10-21 07:48:43.525732',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '144',
        '1',
        '7',
        '9',
        '1',
        '2025-10-21 07:58:06.696382',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '145',
        '1',
        '8',
        '2',
        '1',
        '2025-10-21 08:31:06.957212',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "roles" ------------------------------------
BEGIN;

INSERT INTO
    `roles` (
        `id`,
        `name`,
        `description`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'admin',
        'Administrator dengan akses penuh',
        '2025-10-20 09:03:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'verifikator',
        'Memverifikasi dokumen hukum',
        '2025-10-20 09:03:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'petugas_dokumen',
        'Mengelola dokumen hukum',
        '2025-10-20 09:03:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'petugas_konten',
        'Mengelola konten berita & informasi',
        '2025-10-20 09:03:43.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- Dump data of "users" ------------------------------------
BEGIN;

INSERT INTO
    `users` (
        `id`,
        `name`,
        `email`,
        `password_hash`,
        `role_id`,
        `created_at`,
        `created_by`,
        `updated_at`,
        `updated_by`,
        `deleted_at`,
        `deleted_by`
    )
VALUES (
        '1',
        'Admin JDIH',
        'admin@jdih.go.id',
        '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q',
        '1',
        '2025-10-20 09:09:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '2',
        'Verifikator JDIH',
        'verifikator@jdih.go.id',
        '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q',
        '2',
        '2025-10-20 09:09:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    ),
    (
        '3',
        'Petugas Dokumen',
        'dokumen@jdih.go.id',
        '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q',
        '3',
        '2025-10-20 09:09:03.000000',
        NULL,
        '2025-10-21 07:54:11.000000',
        NULL,
        NULL,
        NULL
    ),
    (
        '4',
        'Petugas Konten',
        'konten@jdih.go.id',
        '$2b$10$m.AV5nnYJYqOx0gDwE5zd.NRclcP9W22HM/HP748FNC4BjAseFv9q',
        '4',
        '2025-10-20 09:09:03.000000',
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

COMMIT;
-- ---------------------------------------------------------

-- CREATE INDEX "fk_audit_logs_user" ---------------------------
CREATE INDEX `fk_audit_logs_user` USING BTREE ON `audit_logs` (`user_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_doc_versions_document" ---------------------
CREATE INDEX `fk_doc_versions_document` USING BTREE ON `document_versions` (`document_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_documents_category" ------------------------
CREATE INDEX `fk_documents_category` USING BTREE ON `documents` (`category_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_documents_verified_by" ---------------------
CREATE INDEX `fk_documents_verified_by` USING BTREE ON `documents` (`verified_by`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_menus_parent" ------------------------------
CREATE INDEX `fk_menus_parent` USING BTREE ON `menus` (`parent_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_rmp_action" --------------------------------
CREATE INDEX `fk_rmp_action` USING BTREE ON `role_menu_permissions` (`action_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_rmp_menu" ----------------------------------
CREATE INDEX `fk_rmp_menu` USING BTREE ON `role_menu_permissions` (`menu_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_rmp_role" ----------------------------------
CREATE INDEX `fk_rmp_role` USING BTREE ON `role_menu_permissions` (`role_id`);
-- -------------------------------------------------------------

-- CREATE INDEX "fk_users_role" --------------------------------
CREATE INDEX `fk_users_role` USING BTREE ON `users` (`role_id`);
-- -------------------------------------------------------------

-- CREATE LINK "fk_audit_logs_user" ----------------------------
ALTER TABLE `audit_logs`
ADD CONSTRAINT `fk_audit_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE Cascade ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_documents_category" -------------------------
ALTER TABLE `documents`
ADD CONSTRAINT `fk_documents_category` FOREIGN KEY (`category_id`) REFERENCES `document_categories` (`id`) ON DELETE Set NULL ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_documents_verified_by" ----------------------
ALTER TABLE `documents`
ADD CONSTRAINT `fk_documents_verified_by` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE Set NULL ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_doc_versions_document" ----------------------
ALTER TABLE `document_versions`
ADD CONSTRAINT `fk_doc_versions_document` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE Cascade ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_menus_parent" -------------------------------
ALTER TABLE `menus`
ADD CONSTRAINT `fk_menus_parent` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE Set NULL ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_rmp_action" ---------------------------------
ALTER TABLE `role_menu_permissions`
ADD CONSTRAINT `fk_rmp_action` FOREIGN KEY (`action_id`) REFERENCES `actions` (`id`) ON DELETE Cascade ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_rmp_menu" -----------------------------------
ALTER TABLE `role_menu_permissions`
ADD CONSTRAINT `fk_rmp_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE Cascade ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_rmp_role" -----------------------------------
ALTER TABLE `role_menu_permissions`
ADD CONSTRAINT `fk_rmp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE Cascade ON UPDATE No Action;
-- -------------------------------------------------------------

-- CREATE LINK "fk_users_role" ---------------------------------
ALTER TABLE `users`
ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE Set NULL ON UPDATE No Action;
-- -------------------------------------------------------------

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
-- ---------------------------------------------------------