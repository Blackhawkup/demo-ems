# Client Associates – Employee Management System (EMS)

Interactive enterprise demonstration platform built for **Client Associates**, India's premier multi-family office and private wealth management firm (est. 2002).

Designed with modern enterprise SaaS aesthetics (Linear / Notion style), featuring real-time task workflows, employee administration, simulated reminders, and an interactive WhatsApp Web bot replication.

---

## Live Demo Accounts

All demo accounts use default password: `1234`

### Team Lead (Admin)
* **Username**: `lead`
* **Password**: `1234`
* *Capabilities*: Firm-wide task oversight, add/remove employee directory, priority management, and team workload analytics.

### Bankers (5 Accounts)
* `karan` / `1234` (Karan Malhotra)
* `simran` / `1234` (Simran Kaur)
* `vikram` / `1234` (Vikram Joshi)
* `ishita` / `1234` (Ishita Roy)
* `aditya` / `1234` (Aditya Singhania)

### Analysts (7 Accounts)
* `rahul` / `1234` (Rahul Verma)
* `aman` / `1234` (Aman Gupta)
* `priya` / `1234` (Priya Nair)
* `neha` / `1234` (Neha Sen)
* `arjun` / `1234` (Arjun Mehta)
* `rohan` / `1234` (Rohan Kulkarni)
* `ananya` / `1234` (Ananya Desai)

---

## Key Features

1. **Enterprise Sign In**:
   * Authentic Client Associates corporate identity (`#011226`, `#031a34`, `#094897`, `#13A28F`).
   * Ambient animated floating bubbles background.
   * Dynamic role detection and 1-click test credentials selector.
2. **Banker & Analyst Workspaces**:
   * Immediate priority-ranked assigned mandates feed (Critical, High, Medium, Low).
   * Clean information architecture (descriptions hidden until clicked).
   * Task detail modals with individual member completion toggles.
   * Simulated WhatsApp and Email reminders.
3. **Team Lead Administration**:
   * Team members roster & capacity monitoring.
   * Add new employees with role assignment (`Banker` / `Analyst`).
   * Safe employee removal with confirmation and assignment preservation.
   * Full organization mandate registry.
4. **Interactive WhatsApp Bot Replication**:
   * 5-step conversational task creation workflow.
   * Case-insensitive state machine (`start`, employee names, task, deadline, `YES` confirmation).
   * Live synchronization with the EMS state.
5. **Clean Corporate Analytics**:
   * Priority workload allocation spectrum.
   * Execution stage flow.

---

## Tech Stack

* **Framework**: React 19 + TypeScript + Vite 8
* **Styling**: Tailwind CSS v4 + Lucide Icons
* **Persistence**: LocalStorage with 1-click demo state reset

---

## Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Production build
npm run build
```

---

## Vercel Deployment

This project is fully optimized for zero-config Vercel deployment:
1. Connect this GitHub repository (`Blackhawkup/demo-ems`) in your Vercel Dashboard.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.
