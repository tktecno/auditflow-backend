# AuditFlow API

AuditFlow is a backend system for managing and analyzing financial records within an organization. It supports role-based access control, approval workflows, and audit tracking to ensure secure and structured financial data handling.

---

## 🚀 Tech Stack

* Node.js
* Express.js
* Supabase (PostgreSQL)
* JWT Authentication

---

## ✨ Features

* 🔐 Authentication (JWT-based)
* 👥 Role-based access (Admin, Analyst, Viewer)
* 🏢 Multi-tenant support (organization-based data isolation)
* 💰 Financial record management (create, filter, paginate)
* 🔄 Approval workflow (approve, reject, reopen)
* 📊 Dashboard analytics (summary, category breakdown, recent records)
* 📜 Audit logs (track all critical actions)
* 🗑️ Soft delete for records (data is not permanently removed)

---

## 📡 API Endpoints

### Auth

* `POST /api/auth/register` → Create User
* `POST /api/auth/login`

### Records

* `POST /api/records` → Create Record
* `GET /api/records`  → Get Records
* `PATCH /api/records/:id/approve` → Status Approve
* `PATCH /api/records/:id/reject` → Status Reject 
* `PATCH /api/records/:id/reopen` → Status Reopen
* `PATCH /api/records/:id` → Update record
* `DELETE /api/records/:id` → Soft delete record

### Dashboard

* `GET /api/dashboard/summary`
* `GET /api/dashboard/category`
* `GET /api/dashboard/recent`

---

## ⚙️ Setup

```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in root:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_key
JWT_SECRET=your_secret
PORT=4000
```
---

## Setup Database (Supabase)
```
Go to Supabase
Create a new project
Open SQL Editor
Run the provided schema.sql (included in repo)
```
---

## 👑 Admin Setup

By default, users are registered with the **Analyst** role.

To create an Admin user for testing:
```
1. Register a user using the API
2. Go to Supabase → `users` table
3. Update the `role_id` of that user to the ADMIN role
```
You can get ADMIN role ID using:

```sql
select * from roles where name = 'ADMIN';
```

Then update:

```sql
update users
set role_id = '<admin_role_id>'
where email = 'your_email@example.com';
```

This allows testing of admin-specific actions such as approving or rejecting records.

---

## 🧪 Testing APIs
```
Use Postman or Thunder Client.

Example: Register
POST /api/auth/register
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "123456"
}
```
---

## 🧠 Design Decisions

* Role-Based Access Control (RBAC) for secure operations
* Organization-based data isolation (multi-tenant design)
* Approval workflow to ensure data integrity
* Audit logging for traceability and accountability

---

## 📌 Assumptions

* New users are assigned the **Analyst** role by default
* A new organization is created during user registration
* Only approved records are considered in analytics

---

## 🎯 Summary

AuditFlow demonstrates a structured backend system with clean architecture, secure access control, and real-world financial workflow handling.
