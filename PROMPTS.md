# AI Tooling Chat History & Prompts (PROMPTS.md)

This file documents the prompt history and AI interactions used during the design, implementation, and testing of the **Car Dealership Inventory System (TDD Kata)**.

---

## Session Overview
- **Project**: Car Dealership Inventory System
- **Date**: July 2026
- **AI Tooling Used**: Antigravity AI (Powered by Gemini 3.6 Flash)
- **Methodology**: Test-Driven Development (TDD) Kata, SOLID Clean Code, RESTful API design, Component-Driven SPA design.

---

## Key Prompts & Iterations

### Prompt 1: Initial Requirements & Kata Objective
> **User**: "TDD Kata: Car Dealership Inventory System. Objective: Design, build, and test a full-stack Car Dealership Inventory System with RESTful backend API (Node.js/TS Express), database (SQLite/Prisma), JWT token auth, vehicle search/CRUD, purchase/restock inventory logic, and React + Tailwind CSS SPA."

**AI Action**:
- Analyzed technical guidelines and requirements.
- Formulated an architectural implementation plan specifying directory layout, technology stack, database schemas, test strategy, and commit history co-authorship policies.

---

### Prompt 2: Backend Architecture & TDD Red-Green-Refactor Cycle
> **User**: "Approve implementation plan. Execute backend TDD Kata suite."

**AI Action**:
1. **RED Phase**: Wrote failing Jest + Supertest test suites (`tests/auth.test.ts`, `tests/vehicles.test.ts`, `tests/inventory.test.ts`) covering registration, login, vehicle CRUD, category/price range search, quantity decrement on purchase, out-of-stock validation, and admin-only restock.
2. **GREEN Phase**:
   - Initialized Express + TypeScript backend.
   - Created Prisma schema (`schema.prisma`) for SQLite database containing `User` and `Vehicle` models.
   - Implemented JWT token generation and authentication/authorization middleware (`authenticate`, `requireAdmin`).
   - Implemented `AuthService` and `VehicleService` with Zod validation.
   - Ran `npx prisma db push`, seeded database (`seed.ts`), and executed Jest test suite.
3. **Verification**: All 18 backend tests passed successfully.

---

### Prompt 3: Frontend SPA Implementation (React + Vite + Tailwind CSS)
> **AI Action**:
- Initialized React Vite app with Tailwind CSS and Lucide React icons.
- Built `AuthContext` for JWT session management, demo mode fast-logins (`Admin` and `Buyer`), and role state.
- Created `Navbar`, `HeroSection` (with live inventory metrics), `SearchBar` (live search, category filter, max price slider, stock toggle), `VehicleCard` (with disabled Purchase button when stock is 0), `VehicleModal`, `AdminVehicleModal` (add/edit form), `RestockModal`, and `Toast`.
- Built Vitest test suite (`src/tests/App.test.jsx`) asserting zero-stock purchase button disabling, search filtering, and header renders.
- **Verification**: All 4 frontend Vitest tests passed successfully.

---

### Prompt 4: Documentation & Co-Authorship Preparation
> **AI Action**:
- Generated comprehensive `README.md` detailing system architecture, setup instructions, test execution outputs, and the mandatory **"My AI Usage"** section.
- Executed Git version control commits with proper `Co-authored-by:` trailers.
