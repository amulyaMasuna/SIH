# SIH26034 - Legal Metrology (Packaged Commodities) Rules 2011 Compliance System
## Deployment & Operations Guide

This guide provides end-to-end instructions for deploying and running the **SIH26034** compliance verification system both locally and on cloud platforms (such as Render).

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                    │
│  - Citizen / Consumer Portal & Officer Inspection Hub       │
│  - Live WebRTC Camera Viewfinder + Drag-and-Drop Image      │
│  - Split-Screen Inspection View (Image + Red/Green Rules)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP POST (Multipart Image)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NodeJS Backend (Express)                 │
│  - Multi-Role JWT Auth (Metrology / Field Officer, Citizen) │
│  - Statutory Rule Engine: Legal Metrology Rules 2011        │
│  - Determines Parcel Status: LEGAL vs ILLEGAL               │
│  - Persists Audit Ledger into MongoDB (Atlas / In-Memory)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP POST (Forward Stream)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Python Microservice (FastAPI)               │
│  - OpenCV CLAHE dynamic contrast & glare elimination        │
│  - PaddleOCR optical character & polygon detector           │
│  - Spatial Proximity & Regular Expression Parser            │
│  - Extracts MRP, Net Qty, Mfg Date, USP, Mfd By, etc.       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 1-Click Cloud Deployment via Render Blueprint

The repository contains `render.yaml` pre-configured to deploy all three microservices seamlessly.

### Steps:
1. **Push your repository to GitHub / GitLab**.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**.
4. Select your SIH repository.
5. Render will automatically parse `render.yaml` and discover three services:
   - `legal-metrology-python-service` (FastAPI web service)
   - `legal-metrology-backend` (NodeJS Express backend)
   - `legal-metrology-frontend` (Vite static site)
6. Under `legal-metrology-backend`, provide your **`MONGO_URI`** from MongoDB Atlas (e.g. `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/legal_metrology?retryWrites=true&w=majority`).
   - *Note: If no MongoDB string is provided, the backend seamlessly falls back to resilient in-memory storage without crashing.*
7. Click **Apply**.
8. Render will provision the services and link their URLs automatically.

---

## 3. Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10, v3.11, or v3.12
- **MongoDB**: (Optional, in-memory fallback active by default)

---

### Step A: Launch Python OCR Microservice

```bash
cd Python-Microservice

# 1. Create and activate virtual environment (recommended)
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```
*Health Check*: Open [http://127.0.0.1:8080/health](http://127.0.0.1:8080/health) in your browser.

---

### Step B: Launch NodeJS Backend

```bash
cd Backend

# 1. Install dependencies
npm install

# 2. Review or adjust .env file
# PORT=5000
# MONGO_URI=mongodb://127.0.0.1:27017/legal_metrology
# PYTHON_SERVICE_URL=http://127.0.0.1:8080
# FRONTEND_URL=http://localhost:5173

# 3. Start NodeJS Server
npm run dev
```
*Health Check*: Open [http://localhost:5000/health](http://localhost:5000/health) in your browser.

---

### Step C: Launch React Frontend Portal

```bash
cd gitdem

# 1. Install dependencies
npm install

# 2. Run Vite development server
npm run dev
```
*Portal Access*: Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 4. Default Seeded Accounts & Quick Demo Logins

For instant demonstration and evaluation during jury assessment, the following accounts are pre-seeded:

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Metrology Enforcement Officer** | `officer@metrology.gov.in` | `officer123` | Full Metrology Dashboard, Notice Generation, Case File Ledger, Split-Screen Audit |
| **Field Inspection Officer** | `officer@metrology.gov.in` | `officer123` | Field Dashboard, Retail Inspections, Mobile Camera Capture |
| **Citizen / Consumer** | `consumer@citizen.in` | `consumer123` | Consumer Dashboard, Packaging Safety Rights, Scan Verification, NCH Grievance Filing |

> **Tip**: On the Login screen (`/login`), click the **"1-Click Metrology Officer Demo"** or **"1-Click Consumer Demo"** buttons for instant zero-keystroke entry.

---

## 5. Verification & Test Scenarios

### Test Case 1: Fully Compliant Package (LEGAL)
- **Sample**: Select *"Refined Sunflower Oil 1L (Legal Pack)"* preset or upload a package with standard metric units (`1 L`), complete manufacturer address, clear MRP with *(Inclusive of all taxes)*, and valid consumer care contacts.
- **Expected Outcome**:
  - Banner: **`PARCEL STATUS: LEGAL`** (Green Shield)
  - Violations: **0**
  - Compliances: **9** (Rule 6(1)(a) through Rule 6(11) in green cards)
  - Officer Action: Option to generate Digital Compliance Certificate.

### Test Case 2: Illegal Package - Non-Standard Units & Missing USP (ILLEGAL)
- **Sample**: Select *"Speciality Coffee Beans (Illegal - Missing USP)"* preset with Net Quantity declared as `250 gms`.
- **Expected Outcome**:
  - Banner: **`PARCEL STATUS: ILLEGAL`** (Red Shield)
  - Violations in **RED**:
    - `Rule 6(1)(c)`: Non-Standard Net Quantity Unit Symbol (`'gms'` prohibited; only standard SI `'g'` allowed).
    - `Rule 6(1)(11)`: Missing Unit Sale Price (USP) declaration (Calculated: ₹1.80 per g).
  - Statutory Penal Reference: Section 36 of Legal Metrology Act, 2009.

### Test Case 3: Illegal Package - Dual Pricing / Over-stickering (ILLEGAL)
- **Sample**: Select *"Roasted Almonds 500g (Illegal - Dual MRP)"* preset.
- **Expected Outcome**:
  - Banner: **`PARCEL STATUS: ILLEGAL`** (Red Shield)
  - Violations in **RED**:
    - `Rule 18(1)`: Prohibition of alteration/over-stickering of Maximum Retail Price.

---

## 6. Statutory Reference Matrix (Legal Metrology Rules 2011)

| Rule | Mandatory Declaration | Verification Standard |
| :--- | :--- | :--- |
| **Rule 6(1)(a)** | Manufacturer / Packer / Importer | Registered company name & complete postal address including city and state. |
| **Rule 6(1)(b)** | Common or Generic Name | Conspicuous display of commodity nature on Principal Display Panel. |
| **Rule 6(1)(c)** | Net Quantity in Metric Units | Only standard SI symbols (`g`, `kg`, `ml`, `l`, `N`). Prohibits `gms`, `kgs`, `ltr`, `pcs`. |
| **Rule 6(1)(d)** | Date of Manufacture / Packing | Month & Year format (`MM/YYYY` or Month Name + Year). |
| **Rule 6(1)(e)** | Maximum Retail Price (MRP) | Format `MRP Rs. XX.XX` or `₹ XX.XX` + mandatory text `"Inclusive of all taxes"`. |
| **Rule 6(1)(n)** | Grievance Redressal Contact | Active telephone helpline / toll-free number and official email address. |
| **Rule 6(10)** | Country of Origin | Prominently stated for imported goods (`"Country of Origin: [Nation]"`). |
| **Rule 6(11)** | Unit Sale Price (USP) | Required for package volumes `> 1 unit/kg/l` (e.g. `₹ 0.49 / g` or `₹ 490 / kg`). |
| **Rule 18(1)** | Dual Pricing Prohibition | Strictest prohibition against secondary price tags exceeding manufacturer print. |
