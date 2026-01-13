# مشروع تأجير السيارات - سوريا 🚗
# Autovermietung Syrien - Projekt Übersicht

---

## 📋 Projektbeschreibung / وصف المشروع

Entwickle eine **vollständige Web-Applikation** für eine Autovermietung in Syrien.
- **Sprache der Benutzeroberfläche**: Arabisch (RTL - Right-to-Left)
- **Technologie**: 100% Open Source - Keine Kosten
- **Design**: Modern, elegant, mit CSS-Animationen und 3D-Visualisierungen
- **AI-Entwicklung**: Claude Opus 4.5

---

## 🎯 Drei Hauptbereiche / الأقسام الرئيسية الثلاثة

### 1. الصفحة الرئيسية (Hauptseite / Landing Page)
Öffentlich zugängliche Seite für alle Besucher

### 2. بوابة العملاء (Kundenportal)
Registrierte Kunden können Autos mieten und verwalten

### 3. لوحة تحكم المسؤول (Admin-Dashboard)
Vollständige Verwaltung des gesamten Systems

---

## 🛠️ Technologie-Stack (100% Open Source)

### Frontend
| Technologie | Verwendung | Lizenz |
|-------------|------------|--------|
| **React 18+** | UI Framework | MIT |
| **TypeScript** | Typsicherheit | Apache 2.0 |
| **Tailwind CSS** | Styling | MIT |
| **Framer Motion** | Animationen | MIT |
| **Three.js** | 3D Visualisierungen | MIT |
| **React Three Fiber** | React + Three.js | MIT |
| **Lucide React** | Icons | ISC |
| **React Router v6** | Navigation | MIT |
| **React Hook Form** | Formulare | MIT |
| **Zod** | Validierung | MIT |
| **TanStack Query** | Server State | MIT |
| **Zustand** | Client State | MIT |
| **date-fns** | Datumsformatierung | MIT |
| **i18next** | Internationalisierung | MIT |
| **Chart.js** | Diagramme | MIT |
| **React-Toastify** | Benachrichtigungen | MIT |

### Backend
| Technologie | Verwendung | Lizenz |
|-------------|------------|--------|
| **Node.js** | Runtime | MIT |
| **Express.js** | API Framework | MIT |
| **TypeScript** | Typsicherheit | Apache 2.0 |
| **Prisma** | ORM | Apache 2.0 |
| **PostgreSQL** | Datenbank | PostgreSQL License |
| **Redis** | Caching & Sessions | BSD |
| **JWT** | Authentifizierung | MIT |
| **bcrypt** | Passwort-Hashing | MIT |
| **Multer** | Datei-Upload | MIT |
| **Sharp** | Bildverarbeitung | Apache 2.0 |
| **Nodemailer** | E-Mail Versand | MIT |
| **Socket.io** | Echtzeit-Updates | MIT |
| **Winston** | Logging | MIT |
| **Helmet** | Sicherheit | MIT |
| **Express Rate Limit** | API Schutz | MIT |

### DevOps & Tools
| Technologie | Verwendung | Lizenz |
|-------------|------------|--------|
| **Docker** | Container | Apache 2.0 |
| **Docker Compose** | Orchestrierung | Apache 2.0 |
| **Nginx** | Reverse Proxy | BSD |
| **GitHub Actions** | CI/CD | - |
| **Vite** | Build Tool | MIT |
| **ESLint** | Code Qualität | MIT |
| **Prettier** | Formatierung | MIT |
| **Vitest** | Testing | MIT |

---

## 📁 Projektstruktur / هيكل المشروع

```
car-rental-syria/
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   ├── models/          # 3D Modelle
│   │   └── locales/         # Übersetzungen
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/      # Wiederverwendbare Komponenten
│   │   │   ├── landing/     # Hauptseite Komponenten
│   │   │   ├── customer/    # Kundenportal Komponenten
│   │   │   ├── admin/       # Admin Dashboard Komponenten
│   │   │   └── 3d/          # Three.js Komponenten
│   │   ├── pages/
│   │   │   ├── public/      # Öffentliche Seiten
│   │   │   ├── customer/    # Kundenseiten
│   │   │   └── admin/       # Admin Seiten
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── services/        # API Services
│   │   ├── stores/          # Zustand Stores
│   │   ├── types/           # TypeScript Types
│   │   ├── utils/           # Hilfsfunktionen
│   │   ├── styles/          # Globale Styles
│   │   └── config/          # Konfiguration
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── config/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Installationsanweisungen

```bash
# Repository klonen
git clone <repository-url>
cd car-rental-syria

# Umgebungsvariablen kopieren
cp .env.example .env

# Mit Docker starten
docker-compose up -d

# Oder manuell:
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
```

---

## 🔐 Umgebungsvariablen (.env)

```env
# Datenbank
DATABASE_URL=postgresql://user:password@localhost:5432/car_rental
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dein-super-sicheres-geheimnis
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# E-Mail (Optional - SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## ➡️ Weiter zu: 02_DATENBANK_SCHEMA.md
