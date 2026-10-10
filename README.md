# Employee Management System – HR CRUD Operations with Department Filters

**Academic Level:** Final Year B.Tech in Computer Science & Engineering / Information Technology  
**Project Category:** Full-Stack Web Application (React.js, Node.js, Express.js, MySQL)  
**Architecture:** RESTful API Architecture with Relational Database Model  

---

## 1. Project Title
**Employee Management System – HR CRUD Operations with Department Filters**

---

## 2. Project Description
The **Employee Management System (EMS)** is a web-based human resources management portal designed to streamline administrative workflows in corporate organizations. It enables HR managers and administrative staff to perform comprehensive CRUD (Create, Read, Update, Delete) operations on employee records, organize workforce personnel by functional departments, filter records dynamically, and track key HR metrics through a real-time dashboard.

This application was engineered specifically to meet the evaluation standards of a B.Tech final-year capstone project by demonstrating clean client-server separation, RESTful API conventions, normalized relational database design, input validation, and responsive UI design.

---

## 3. Project Objectives
1. **Automate HR Data Management:** Replace prone-to-error spreadsheet tracking with a centralized, relational database system.
2. **Implement Full CRUD Functionality:** Deliver seamless creation, retrieval, updating, and deletion of employee and departmental records.
3. **Multi-Criteria Department Filtering:** Allow users to filter employees strictly by department, employment status, and search keywords simultaneously.
4. **Enforce Database Integrity:** Implement relational constraints (Primary Keys, Foreign Keys, Unique Keys, and cascading rules) to ensure referential integrity.
5. **Demonstrate Industry-Standard REST Architecture:** Decouple the React.js client interface from the Node.js/Express.js backend via clean JSON REST endpoints.

---

## 4. Key Features
- **Interactive HR Dashboard:**
  - Real-time statistics: Total Employees, Active Staff, Inactive Personnel, Total Departments, and Average Monthly Salary.
  - Department Headcount Bar Chart: Visual distribution of employees across all departments.
  - Active vs. Inactive Workforce Ratio donut chart.
  - Recently Added Employees log with direct access to view and edit.
- **Employee Directory & Table:**
  - Complete employee data display: Code, Name, Email, Phone, Job Title, Department, Salary, Hire Date, and Status.
  - Instant live search by employee name, employee code, email, and designation.
  - Department-based dropdown filter (IT, HR, Finance, Marketing, Sales, Operations).
  - Status filter (Active / Inactive).
  - Multi-column sorting (by Name, Code, Salary, Hire Date, and Department).
  - Client-side and server-side pagination with custom row limits (5, 10, 20).
  - Export to CSV feature for generating HR summary reports.
- **Add Employee:**
  - Multi-section form: Personal Information, Contact Details, Job & Department Assignment, and Residential Address.
  - One-click "Auto" button to generate a unique employee code (`EMP-XXXX`).
  - Strict input validation: Required fields, regex-based email format, phone digits verification, valid non-negative salary, and chronological date logic (birth date < hire date).
- **View Employee Profile:**
  - Dedicated card-based profile view with initial avatars, full personal background, corporate credentials, joining dates, and contact cards.
- **Edit Employee:**
  - Pre-populates existing data from the database.
  - Validates all modifications and prevents duplicate email/code conflicts.
- **Delete Employee with Safety Dialog:**
  - Accessible modal dialog requiring user confirmation prior to database deletion.
- **Department Management:**
  - View all organizational departments with live employee headcounts.
  - Add and edit departmental records.
  - Foreign Key protection: Blocks deletion of any department that currently has assigned employees.
- **Viva Demo Reset:**
  - In-app "Reset Demo Records" action to instantly restore the default 12 sample employees and 6 departments during viva presentations.

---

## 5. Technologies Used

### Frontend
- **React.js 19:** Single Page Application (SPA) component architecture.
- **React Router v7:** Client-side routing with clean URLs and URL search parameter sync.
- **Tailwind CSS v4:** Modern utility-first responsive styling.
- **Lucide React:** Clean vector icons for affordance and visual cues.
- **TypeScript:** Strict type-safety across models and components.

### Backend
- **Node.js:** Asynchronous JavaScript runtime environment.
- **Express.js:** Web framework powering the RESTful API endpoints.
- **CORS & Middleware:** Cross-Origin Resource Sharing handling and centralized error catching.
- **dotenv:** Environment variable configuration.

### Database
- **MySQL 8.0+ / MariaDB:** Relational Database Management System.
- **InnoDB Engine:** ACID compliance, foreign key constraint enforcement, and index support.
- **SQL DDL & DML:** Schema definitions and sample data in `/database/schema.sql`.

---

## 6. System Requirements

### Hardware Requirements
- **Processor:** Intel Core i3 or AMD Ryzen 3 or higher.
- **RAM:** Minimum 4 GB (8 GB recommended).
- **Disk Space:** 500 MB free hard drive space.

### Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/)).
- **npm:** v9.0.0 or higher (comes bundled with Node.js).
- **MySQL Server:** MySQL 8.0+ or XAMPP / WAMP / MAMP stack.
- **Web Browser:** Google Chrome, Mozilla Firefox, or Microsoft Edge.

---

## 7. Database Setup

1. Open your MySQL client (MySQL CLI, MySQL Workbench, or phpMyAdmin in XAMPP).
2. Execute the provided script file located in `database/schema.sql`:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Alternatively, open `database/schema.sql` in MySQL Workbench or phpMyAdmin and execute the script.
4. Verify the database tables and records:
   ```sql
   USE employee_management_db;
   SHOW TABLES;
   SELECT * FROM departments;
   SELECT * FROM employees;
   ```

---

## 8. Backend Configuration (`.env`)

Create or update the `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=employee_management_db
DB_PORT=3306
```
*(Note: If MySQL server is not running on your machine, the application will seamlessly use its built-in relational memory store with the exact same data and constraints!)*

---

## 9. How to Run the Project

### Installation
Clone or open the project folder in your terminal and install dependencies:
```bash
npm install
```

### Running in Development Mode
Start the full-stack server (runs both Express REST API and Vite dev frontend):
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:3000
```

### Production Build
To create an optimized production build:
```bash
npm run build
npm start
```

---

## 10. REST API Endpoints Catalog

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/employees` | Get list of employees with search, department filter, status, sorting, and pagination. |
| `GET` | `/api/employees/:id` | Retrieve single employee record by ID. |
| `POST` | `/api/employees` | Create and persist a new employee (validates unique email & code). |
| `PUT` | `/api/employees/:id` | Update an existing employee's details. |
| `DELETE` | `/api/employees/:id` | Delete an employee record from the database. |
| `GET` | `/api/employees/department/:departmentId` | Retrieve all employees under a specific department. |
| `GET` | `/api/departments` | Retrieve all departments with live employee counts. |
| `GET` | `/api/departments/:id` | Retrieve single department by ID. |
| `POST` | `/api/departments` | Create a new department. |
| `PUT` | `/api/departments/:id` | Update department name and description. |
| `DELETE` | `/api/departments/:id` | Delete department (guarded by Foreign Key constraint). |
| `GET` | `/api/stats` | Compute dashboard summary statistics and headcount distributions. |
| `POST` | `/api/stats/reset` | Reset demo data back to default 12 employees and 6 departments. |

---

## 11. Database Schema Details

### 1. `departments` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `department_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for department |
| `department_name` | VARCHAR(100) | NOT NULL, UNIQUE | Official department title |
| `description` | TEXT | NULL | Department responsibilities & scope |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### 2. `employees` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `employee_id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique internal ID |
| `employee_code` | VARCHAR(20) | NOT NULL, UNIQUE | HR employee identifier (e.g., EMP-1001) |
| `first_name` | VARCHAR(50) | NOT NULL | Employee first name |
| `last_name` | VARCHAR(50) | NOT NULL | Employee last name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Corporate email address |
| `phone` | VARCHAR(20) | NOT NULL | Contact telephone number |
| `gender` | ENUM | NOT NULL ('Male','Female','Other') | Gender identity |
| `date_of_birth` | DATE | NOT NULL | Date of birth |
| `hire_date` | DATE | NOT NULL | Date of joining |
| `job_title` | VARCHAR(100) | NOT NULL | Designation |
| `salary` | DECIMAL(10,2) | NOT NULL | Monthly salary in INR |
| `department_id` | INT | NOT NULL, FOREIGN KEY | References `departments(department_id)` |
| `address` | TEXT | NOT NULL | Street residential address |
| `city` | VARCHAR(50) | NOT NULL | City of residence |
| `status` | ENUM | DEFAULT 'Active' ('Active','Inactive') | Employment status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit creation timestamp |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE | Audit update timestamp |

### Foreign Key Relationship
```sql
CONSTRAINT fk_employee_department
  FOREIGN KEY (department_id)
  REFERENCES departments(department_id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
```
- **ON DELETE RESTRICT:** Prohibits accidental deletion of departments if active employee records exist.
- **ON UPDATE CASCADE:** Updates employee references if a department ID changes.

---

## 12. Project Structure
```
employee-management-system/
├── backend/
│   ├── config/
│   │   └── db.ts                  # MySQL database pool configuration
│   ├── controllers/
│   │   ├── departmentController.ts # Department business logic & FK checks
│   │   ├── employeeController.ts   # Employee CRUD, search, and validations
│   │   └── statsController.ts      # Dashboard metrics & seed reset
│   ├── middleware/
│   │   └── errorHandler.ts         # Centralized API error handler
│   ├── models/
│   │   └── database.ts             # Relational data layer & constraints
│   ├── routes/
│   │   ├── departmentRoutes.ts     # /api/departments endpoints
│   │   ├── employeeRoutes.ts       # /api/employees endpoints
│   │   └── statsRoutes.ts          # /api/stats endpoints
│   └── types.ts                    # Backend data contracts & interfaces
├── database/
│   └── schema.sql                  # Complete MySQL DDL & DML script
├── src/
│   ├── components/
│   │   ├── ConfirmModal.tsx        # Accessible delete confirmation dialog
│   │   ├── DepartmentBadge.tsx     # Clean department chip indicator
│   │   ├── Navbar.tsx              # Top bar with mobile hamburger & quick actions
│   │   ├── Sidebar.tsx             # Responsive navigation sidebar
│   │   ├── StatCard.tsx            # Metric card component
│   │   ├── StatusBadge.tsx         # Active/Inactive status indicator
│   │   └── Toast.tsx               # Floating toast notifications
│   ├── pages/
│   │   ├── AboutPage.tsx           # Academic report, tech specs & viva Q&A
│   │   ├── DashboardPage.tsx       # Analytics, charts & recently added list
│   │   ├── DepartmentsPage.tsx     # Department list, add/edit modal & FK guards
│   │   ├── EmployeeDetailPage.tsx  # Detailed card-based employee profile
│   │   ├── EmployeeFormPage.tsx    # Add / Edit employee with validation
│   │   └── EmployeesPage.tsx       # Filterable table with search, sort & CSV export
│   ├── services/
│   │   └── api.ts                  # Client-side API fetch abstraction
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Main router & global toast provider
│   ├── index.css                   # Tailwind CSS import & typography setup
│   └── main.tsx                    # React DOM root entry
├── index.html                      # HTML entry with metadata and Google Fonts
├── metadata.json                   # Project metadata
├── package.json                    # Project dependencies & npm scripts
├── server.ts                       # Express server mounting APIs and Vite
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Comprehensive project documentation
```

---

## 13. Future Enhancements
While this project focuses on the core final-year requirement of **CRUD + MySQL + REST API + Department Filtering**, potential future enhancements include:
1. **Role-Based Access Control (RBAC):** Distinct logins for HR Managers vs. Department Leads.
2. **Leave Management Module:** Applying for paid time-off and annual vacation requests.
3. **Payroll & Payslip PDF Generation:** Automated calculation of provident funds, taxes, and downloadable salary slips.
4. **Attendance Tracking:** Punch-in/punch-out calendar logs.

---

## 14. Conclusion
The **Employee Management System** demonstrates the practical implementation of full-stack software development principles. By integrating React.js for an intuitive user experience with a Node.js/Express.js REST API backend and a normalized MySQL database, this project effectively showcases full CRUD operations, complex multi-field filtering, referential database integrity, and robust input validation suitable for a final-year B.Tech evaluation.
