-- File: server/config/schema.sql
--
-- This script contains the DDL (Data Definition Language) for creating the
-- database schema for the Wopu application. It defines tables for users,
-- profiles, tasks, and financial transactions.

-- Delete the database if it exists to start fresh
DROP DATABASE IF EXISTS wopu_db; 

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS wopu_db;

-- Use the created database
USE wopu_db;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `profiles`
--
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL UNIQUE,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,                        
  `personal_goal` TEXT DEFAULT NULL,                      
  `financial_goal` TEXT DEFAULT NULL,                     
  `profile_completed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `tasks`
--
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `is_urgent` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_important` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('To Do', 'In Progress', 'Completed') NOT NULL DEFAULT 'To Do',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `transactions`
--
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `transaction_date` DATE NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
