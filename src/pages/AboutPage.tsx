import React from 'react';
import {
  GraduationCap,
  Layers,
  Database,
  Server,
  Monitor,
  CheckCircle2,
  Code2,
  FileText,
  KeyRound,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const endpoints = [
    { method: 'GET', path: '/api/employees', desc: 'Retrieve employees with search, department filter, sort & pagination' },
    { method: 'GET', path: '/api/employees/:id', desc: 'Fetch detailed employee record by primary key ID' },
    { method: 'POST', path: '/api/employees', desc: 'Create new employee with email & code uniqueness check' },
    { method: 'PUT', path: '/api/employees/:id', desc: 'Update existing employee details' },
    { method: 'DELETE', path: '/api/employees/:id', desc: 'Delete employee record from database' },
    { method: 'GET', path: '/api/departments', desc: 'Fetch all departments with live employee counts' },
    { method: 'POST', path: '/api/departments', desc: 'Create a new organizational department' },
    { method: 'DELETE', path: '/api/departments/:id', desc: 'Delete department (enforces foreign key integrity check)' },
    { method: 'GET', path: '/api/employees/department/:id', desc: 'Retrieve all employees belonging to a specific department' },
    { method: 'GET', path: '/api/stats', desc: 'Calculate dashboard analytics, headcount by department, and averages' },
  ];

  const vivaQuestions = [
    {
      q: 'What is the role of the Foreign Key in this project?',
      a: 'The department_id in the employees table is a Foreign Key referencing departments(department_id). It ensures referential integrity, meaning an employee cannot be assigned to a non-existent department, and a department cannot be deleted if active employees belong to it (ON DELETE RESTRICT).',
    },
    {
      q: 'How does the Department Filter feature function across the stack?',
      a: 'When an HR user chooses a department from the dropdown, the frontend passes ?department_id=X to the Express REST API. The backend filters the records matching that department ID and returns the filtered JSON payload. On the frontend, this can also be combined with search queries and status filters simultaneously.',
    },
    {
      q: 'Why use REST API architecture instead of tightly coupled server rendering?',
      a: 'REST provides clear separation of concerns between client (React UI) and server (Node.js/Express). The backend exposes standard stateless HTTP endpoints (GET, POST, PUT, DELETE) returning JSON, which makes the application modular, testable, and capable of supporting mobile apps or external integrations in the future.',
    },
    {
      q: 'How does the system prevent duplicate employee entries?',
      a: 'Both at the database level (UNIQUE constraints on employee_code and email) and in the backend controller validation logic. Attempting to insert an existing email or employee code triggers a validation conflict response (HTTP 409 Conflict).',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Title Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              B.Tech Final Year Academic Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Employee Management System – HR CRUD with Department Filters
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
              A comprehensive full-stack web application designed for HR administrators to manage employee
              records, execute complete CRUD operations (Create, Read, Update, Delete), perform department-based
              filtering, and monitor organizational metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Project Objectives & Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2>Project Objectives</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Demonstrate robust <strong>CRUD operations</strong> for HR employee management.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Implement high-performance <strong>Department-Based Filtering</strong> and search capabilities.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Enforce relational database integrity with <strong>Primary Keys & Foreign Keys</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Build a clean, responsive single-page architecture with React 19 and Express REST APIs.
              </span>
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2>Technology Stack</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
              <Monitor className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 text-sm block">Frontend</strong>
                <span className="text-slate-600">React 19, React Router v7, Tailwind CSS, Lucide Icons</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
              <Server className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 text-sm block">Backend</strong>
                <span className="text-slate-600">Node.js, Express.js REST API Architecture, CORS & Controllers</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg">
              <Database className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 text-sm block">Database</strong>
                <span className="text-slate-600">MySQL InnoDB (schema.sql with constraints, indexes & foreign keys)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relational Schema Structure */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Database className="w-5 h-5 text-amber-600" />
            <h2>Relational Database Design (MySQL)</h2>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            /database/schema.sql
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Table: departments */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <span>Table: departments</span>
            </div>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <span className="text-blue-700 font-semibold">department_id</span> (INT, PK, AUTO_INCREMENT)</li>
              <li>• <span className="text-slate-800">department_name</span> (VARCHAR(100), UNIQUE, NOT NULL)</li>
              <li>• <span className="text-slate-800">description</span> (TEXT, NULL)</li>
              <li>• <span className="text-slate-500">created_at, updated_at</span> (TIMESTAMP)</li>
            </ul>
          </div>

          {/* Table: employees */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
            <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <span>Table: employees</span>
            </div>
            <ul className="space-y-1.5 text-slate-700">
              <li>• <span className="text-blue-700 font-semibold">employee_id</span> (INT, PK, AUTO_INCREMENT)</li>
              <li>• <span className="text-slate-800">employee_code</span> (VARCHAR(20), UNIQUE)</li>
              <li>• <span className="text-slate-800">first_name, last_name</span> (VARCHAR(50))</li>
              <li>• <span className="text-slate-800">email</span> (VARCHAR(100), UNIQUE)</li>
              <li>• <span className="text-purple-700 font-semibold">department_id</span> (INT, FK &rarr; departments)</li>
              <li>• <span className="text-slate-800">job_title, salary, status</span></li>
              <li>• <span className="text-slate-800">date_of_birth, hire_date, address, city</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* REST API Catalog Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            RESTful API Endpoint Documentation
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-24">Method</th>
                <th className="px-5 py-3 font-mono">Endpoint</th>
                <th className="px-5 py-3">Description & Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {endpoints.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="px-5 py-2.5">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        ep.method === 'GET'
                          ? 'bg-blue-100 text-blue-800'
                          : ep.method === 'POST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ep.method === 'PUT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 font-mono text-slate-900 font-medium">
                    {ep.path}
                  </td>
                  <td className="px-5 py-2.5 text-slate-600">{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Viva / Project Defense Q&A Section */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-base text-slate-900">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2>Project Viva & Defense Q&A Sheet</h2>
        </div>

        <div className="space-y-4">
          {vivaQuestions.map((item, i) => (
            <div key={i} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                <span className="text-blue-600 font-mono">Q{i + 1}:</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
