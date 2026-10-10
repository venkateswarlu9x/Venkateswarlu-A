-- ====================================================================
-- EMPLOYEE MANAGEMENT SYSTEM – HR CRUD OPERATIONS WITH DEPARTMENT FILTERS
-- Final Year B.Tech Computer Science & Engineering / IT Project
-- Database: MySQL
-- ====================================================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS `employee_management_db`
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `employee_management_db`;

-- Step 2: Drop existing tables if re-running (respecting foreign key order)
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `departments`;

-- ====================================================================
-- Table 1: departments
-- Stores departmental structure and descriptions
-- ====================================================================
CREATE TABLE `departments` (
  `department_id` INT AUTO_INCREMENT PRIMARY KEY,
  `department_name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================================================================
-- Table 2: employees
-- Stores detailed employee biographical, employment, and contact records
-- foreign key constraint links to departments table
-- ====================================================================
CREATE TABLE `employees` (
  `employee_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_code` VARCHAR(20) NOT NULL UNIQUE,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(20) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `hire_date` DATE NOT NULL,
  `job_title` VARCHAR(100) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `department_id` INT NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `status` ENUM('Active', 'Inactive') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_employee_department`
    FOREIGN KEY (`department_id`)
    REFERENCES `departments` (`department_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create useful indexes for fast search and filter performance
CREATE INDEX `idx_employee_department` ON `employees` (`department_id`);
CREATE INDEX `idx_employee_status` ON `employees` (`status`);
CREATE INDEX `idx_employee_name` ON `employees` (`first_name`, `last_name`);
CREATE INDEX `idx_employee_code` ON `employees` (`employee_code`);

-- ====================================================================
-- Sample Data Insertion: Departments
-- ====================================================================
INSERT INTO `departments` (`department_id`, `department_name`, `description`) VALUES
(1, 'Human Resources', 'Manages talent acquisition, onboarding, employee relations, and HR compliance.'),
(2, 'IT', 'Responsible for software engineering, system administration, cloud infrastructure, and cybersecurity.'),
(3, 'Finance', 'Oversees accounting, auditing, budget allocations, taxation, and financial planning.'),
(4, 'Marketing', 'Executes brand strategy, lead generation, digital campaigns, and public relations.'),
(5, 'Sales', 'Handles customer acquisitions, enterprise accounts, revenue growth, and client retention.'),
(6, 'Operations', 'Coordinates logistics, facility management, quality assurance, and operational workflows.');

-- ====================================================================
-- Sample Data Insertion: Employees (12 realistic sample records)
-- ====================================================================
INSERT INTO `employees` (
  `employee_id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`,
  `gender`, `date_of_birth`, `hire_date`, `job_title`, `salary`, `department_id`,
  `address`, `city`, `status`
) VALUES
(1, 'EMP-1001', 'Aarav', 'Sharma', 'aarav.sharma@example.com', '9876543210', 'Male', '1992-04-15', '2021-03-10', 'Senior Full Stack Developer', 85000.00, 2, 'Flat 402, Green Glen Heights', 'Bangalore', 'Active'),
(2, 'EMP-1002', 'Priya', 'Nair', 'priya.nair@example.com', '9845123456', 'Female', '1990-08-22', '2019-07-01', 'HR Business Partner', 72000.00, 1, 'B-12, Palm Meadows', 'Hyderabad', 'Active'),
(3, 'EMP-1003', 'Rohan', 'Verma', 'rohan.verma@example.com', '9711223344', 'Male', '1994-11-05', '2022-01-15', 'DevOps & Cloud Engineer', 78000.00, 2, 'House 44, Sector 21', 'Gurgaon', 'Active'),
(4, 'EMP-1004', 'Sneha', 'Patel', 'sneha.patel@example.com', '9900112233', 'Female', '1993-02-18', '2020-09-01', 'Financial Analyst', 68000.00, 3, '103 Shanti Enclave', 'Ahmedabad', 'Active'),
(5, 'EMP-1005', 'Vikram', 'Rao', 'vikram.rao@example.com', '9822334455', 'Male', '1988-12-30', '2018-05-12', 'Enterprise Sales Director', 95000.00, 5, 'Plot 89, Jubilee Hills', 'Hyderabad', 'Active'),
(6, 'EMP-1006', 'Ananya', 'Deshmukh', 'ananya.deshmukh@example.com', '9765432109', 'Female', '1995-06-14', '2022-08-20', 'Digital Marketing Specialist', 58000.00, 4, 'C-701, Pride World City', 'Pune', 'Active'),
(7, 'EMP-1007', 'Karthik', 'Iyer', 'karthik.iyer@example.com', '9840123987', 'Male', '1991-09-09', '2020-02-17', 'Senior QA Automation Engineer', 71000.00, 2, '14/B, Gandhi Nagar', 'Chennai', 'Inactive'),
(8, 'EMP-1008', 'Meera', 'Kapoor', 'meera.kapoor@example.com', '9810987654', 'Female', '1996-03-25', '2023-04-10', 'Talent Acquisition Executive', 48000.00, 1, 'D-45, Vasant Kunj', 'New Delhi', 'Active'),
(9, 'EMP-1009', 'Arjun', 'Reddy', 'arjun.reddy@example.com', '9988776655', 'Male', '1989-07-19', '2019-11-25', 'Supply Chain & Operations Manager', 76000.00, 6, 'Flat 12, Gachibowli View', 'Hyderabad', 'Active'),
(10, 'EMP-1010', 'Divya', 'Menon', 'divya.menon@example.com', '9744556677', 'Female', '1994-01-11', '2021-10-05', 'Senior Accountant', 64000.00, 3, '501 Horizon Towers', 'Kochi', 'Active'),
(11, 'EMP-1011', 'Siddharth', 'Chopra', 'siddharth.chopra@example.com', '9871122334', 'Male', '1993-10-03', '2022-03-01', 'Content & SEO Strategist', 55000.00, 4, 'Flat 304, Silver Crest', 'Mumbai', 'Inactive'),
(12, 'EMP-1012', 'Tanvi', 'Joshi', 'tanvi.joshi@example.com', '9833445566', 'Female', '1996-05-18', '2023-06-15', 'Operations Executive', 45000.00, 6, 'A-203, Lakeview Apartments', 'Bengaluru', 'Active');

-- Check insertion verification query:
-- SELECT e.employee_id, e.employee_code, e.first_name, e.last_name, d.department_name, e.job_title, e.status
-- FROM employees e
-- JOIN departments d ON e.department_id = d.department_id;
