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
ENGINE = InnoDB;
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
AUTO_INCREMENT = 1;
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
ENGINE = InnoDB;
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
AUTO_INCREMENT = 1;
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
AUTO_INCREMENT = 1;
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
ENGINE = InnoDB;
-- -------------------------------------------------------------


-- CREATE TABLE "migrations" -----------------------------------
CREATE TABLE `migrations`( 
	`id` Int( 0 ) AUTO_INCREMENT NOT NULL,
	`timestamp` BigInt( 0 ) NOT NULL,
	`name` VarChar( 255 ) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
ENGINE = InnoDB
AUTO_INCREMENT = 2;
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
AUTO_INCREMENT = 1;
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
AUTO_INCREMENT = 3;
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
AUTO_INCREMENT = 8;
-- -------------------------------------------------------------


-- Dump data of "actions" ----------------------------------
-- ---------------------------------------------------------


-- Dump data of "audit_logs" -------------------------------
-- ---------------------------------------------------------


-- Dump data of "document_categories" ----------------------
-- ---------------------------------------------------------


-- Dump data of "document_versions" ------------------------
-- ---------------------------------------------------------


-- Dump data of "documents" --------------------------------
-- ---------------------------------------------------------


-- Dump data of "menus" ------------------------------------
-- ---------------------------------------------------------


-- Dump data of "migrations" -------------------------------
BEGIN;

INSERT INTO `migrations`(`id`,`timestamp`,`name`) VALUES 
( '1', '1699999999999', 'InitSchema1699999999999' ),
( '2', '1700000000000', 'SeedAdmin1700000000000' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "role_menu_permissions" --------------------
-- ---------------------------------------------------------


-- Dump data of "roles" ------------------------------------
BEGIN;

INSERT INTO `roles`(`id`,`name`,`description`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'admin', 'Administrator', '2025-09-30 14:13:02.000000', NULL, NULL, NULL, NULL, NULL ),
( '2', 'user', 'Regular user', '2025-09-30 14:13:02.000000', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "users" ------------------------------------
BEGIN;

INSERT INTO `users`(`id`,`name`,`email`,`password_hash`,`role_id`,`created_at`,`created_by`,`updated_at`,`updated_by`,`deleted_at`,`deleted_by`) VALUES 
( '1', 'Admin', 'admin@jdih.com', '$2b$10$A3B07LTSg7lyZiEgbt8WJe2o8WsLa/Lb/iis2.L6QfbEXeC4hL8JC', '1', '2025-09-30 14:13:02.000000', NULL, NULL, NULL, NULL, NULL ),
( '9', 'User Satu', 'user1@example.com', '$2b$10$8YqHGZiLUx8ujRRT.YmLDO4PLaSQQokZUCiFTW8wau2doZoueHAEy', '2', '2025-10-03 08:53:26.035119', NULL, NULL, NULL, NULL, NULL ),
( '11', 'User Dua', 'user2@example.com', '$2b$10$EQ.OAHQfZmD4suUOT28iee4ZC.fz8NuXH2eg8XSRrk5qQYClpJGCO', '2', '2025-10-03 08:53:40.538323', NULL, NULL, NULL, NULL, NULL ),
( '12', 'User Tiga', 'user3@example.com', '$2b$10$3rwPsVsWyMTE4hhWAgRdU.UvcaBaqMtO2KPSvGP.oITiKwfQfMgKO', '2', '2025-10-03 08:53:53.452457', NULL, NULL, NULL, NULL, NULL ),
( '15', 'Test User', 'test@example.com', '$2b$10$fm8Ing9tJ8mgb.lrsZQwPeAoXfOmwOB29YXL2drJf.AsTYimF17qW', '2', '2025-10-03 09:12:39.839020', NULL, NULL, NULL, NULL, NULL );
COMMIT;
-- ---------------------------------------------------------


-- CREATE INDEX "fk_audit_user" --------------------------------
CREATE INDEX `fk_audit_user` USING BTREE ON `audit_logs`( `user_id` );
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


-- CREATE LINK "fk_audit_user" ---------------------------------
ALTER TABLE `audit_logs`
	ADD CONSTRAINT `fk_audit_user` FOREIGN KEY ( `user_id` )
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


