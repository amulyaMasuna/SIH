# Legal Metrology (Packaged Commodities) Rules, 2011 - Statutory Compliance System
### Smart India Hackathon (SIH) | Problem Statement: SIH26034

An end-to-end, production-ready AI/CV and statutory rule engine for real-time verification of packaged commodities under the Legal Metrology Act, 2009 and Legal Metrology (Packaged Commodities) Rules, 2011 (Ministry of Consumer Affairs, Food & Public Distribution, Government of India).

---

## Key Features

- **Role-Based Workflows**:
  - **Metrology Enforcement Officer**: Case management, statutory show-cause notices under Section 36, legal certificate generation.
  - **Field Inspection Officer**: Mobile-first live camera label scanner, retail outlet location geo-tagging.
  - **Citizen / Consumer**: Scan product packages in stores, verify legal compliance, and 1-click file National Consumer Helpline (NCH) complaints.
- **Computer Vision & Optical Preprocessing**:
  - OpenCV CLAHE dynamic contrast adjustment & specular glare background subtraction.
  - PaddleOCR spatial bounding box detection.
- **Statutory Rule Engine**:
  - Validates **Rule 6(1)(a)** (Manufacturer address), **Rule 6(1)(b)** (Generic commodity name), **Rule 6(1)(c)** (Standard metric units vs prohibited units `gms`/`kgs`/`ltr`), **Rule 6(1)(d)** (Mfg/pkd date), **Rule 6(1)(e)** (MRP & *"Inclusive of all taxes"* clause), **Rule 6(1)(n)** (Grievance helpline/email), **Rule 6(10)** (Country of origin), **Rule 6(11)** (Unit Sale Price), and **Rule 18(1)** (Dual pricing).
- **Split-Screen Inspection View**:
  - Left screen: Uploaded packaging image with zoom, pan, high contrast mode, and bounding box toggle.
  - Right screen: Status banner (**LEGAL** vs **ILLEGAL**), statutory violations listed in **RED** with Section 36 penalties, statutory compliances in **GREEN**.

---

## Directory Structure

```
SIH/
├── gitdem/                 # React Frontend (Vite + React Router + Lucide)
├── Backend/                # NodeJS Express Backend (JWT Auth, MongoDB, Rule Engine)
├── Python-Microservice/    # FastAPI Microservice (OpenCV Preprocessing + PaddleOCR)
├── render.yaml             # Render 1-Click Multi-Service Cloud Deployment Blueprint
├── DEPLOYMENT_GUIDE.md     # Detailed Step-by-Step Deployment & Operations Manual
└── README.md               # Project Overview
```

---

## Quickstart

Please refer to [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full local setup commands and 1-click cloud deployment on Render.

### Demo Credentials
- **Officer**: `officer@metrology.gov.in` / `officer123`
- **Consumer**: `consumer@citizen.in` / `consumer123`