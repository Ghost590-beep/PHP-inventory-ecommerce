# Nancy Beauty — Frontend

A clean, modern cosmetic e-commerce frontend built with HTML, CSS, and TypeScript.

---

## Folder Structure

```
frontend/
│
├── assets/                   ← Static files (images, icons, fonts)
│   ├── images/               ← All page images (backgrounds, products)
│   ├── icons/                ← SVG icon files (if any)
│   └── fonts/                ← Custom font files (if any)
│
├── css/                      ← All stylesheets
│   ├── global.css            ← Shared styles used on EVERY page
│   ├── login.css             ← Styles only for the login page
│   └── register.css          ← Styles only for the register page
│
├── js/                       ← All TypeScript source files
│   ├── api/
│   │   └── auth.api.ts       ← Sends HTTP requests to the backend (login, register)
│   │
│   ├── services/
│   │   └── auth.service.ts   ← Business logic — saves token, handles errors
│   │
│   ├── utils/
│   │   ├── validator.ts      ← Checks if form inputs are correct (email, password rules)
│   │   └── storage.ts        ← Saves/reads data from the browser (localStorage)
│   │
│   ├── login.ts              ← Controls the login page (form submit, eye button, errors)
│   └── register.ts           ← Controls the register page (form submit, password hints)
│
├── pages/                    ← HTML pages
│   ├── login.html            ← Login page
│   └── register.html         ← Register / Create Account page
│
├── dist/                     ← Auto-generated — TypeScript compiled to JavaScript
│   │                           ⚠ Do NOT edit files here — they are overwritten on build
│   ├── login.js
│   ├── register.js
│   ├── api/auth.api.js
│   ├── services/auth.service.js
│   └── utils/
│       ├── validator.js
│       └── storage.js
│
├── node_modules/             ← Auto-generated — npm packages (TypeScript compiler)
│                               ⚠ Do NOT edit anything in here
│
├── index.html                ← Entry point — automatically redirects to pages/login.html
├── tsconfig.json             ← TypeScript configuration (how to compile .ts → .js)
├── package.json              ← Project info and dev dependencies
└── README.md                 ← You are reading this file
```

---

## How Each Layer Works

```
User fills a form
       │
       ▼
  login.ts / register.ts        ← Reads the form, checks input, shows errors
       │
       ▼
  validator.ts                  ← Validates: is the email correct? is password strong?
       │
       ▼
  auth.service.ts               ← Decides what to do with the result
       │
       ▼
  auth.api.ts                   ← Sends the data to the PHP backend
       │
       ▼
  storage.ts                    ← Saves the token the backend returns
```

---

## Pages

| Page | File | URL (XAMPP) |
|------|------|-------------|
| Login | `pages/login.html` | `http://localhost/PHP-inventory-ecommerce/frontend/pages/login.html` |
| Register | `pages/register.html` | `http://localhost/PHP-inventory-ecommerce/frontend/pages/register.html` |

---

## How to Compile TypeScript

TypeScript files (`.ts`) cannot run in the browser directly. You must compile them to JavaScript (`.js`) first. The compiled output goes into the `dist/` folder automatically.

**Step 1 — Install dependencies (first time only):**
```bash
npm install
```

**Step 2 — Compile once:**
```bash
npx tsc
```

**Step 3 — Watch mode (auto-compiles on every save):**
```bash
npx tsc --watch
```

> Tip: Run watch mode while developing so you never forget to compile.

---

## CSS File Responsibilities

| File | Purpose |
|------|---------|
| `global.css` | Background, card, inputs, button, footer, layout — shared by all pages |
| `login.css` | Login-specific tweaks (panel width) |
| `register.css` | Register-specific styles (wider panel, password hint checklist) |

Every HTML page loads `global.css` first, then its own page CSS on top.

---

## TypeScript File Responsibilities

| File | What it does |
|------|-------------|
| `js/login.ts` | Grabs the login form, validates it on submit, shows success/error |
| `js/register.ts` | Grabs the register form, updates password hints live as you type |
| `js/utils/validator.ts` | Pure functions — checks email format, password length, etc. |
| `js/utils/storage.ts` | `Storage.set(key, value)` / `Storage.get(key)` — wraps localStorage |
| `js/api/auth.api.ts` | `AuthApi.login()` / `AuthApi.register()` — raw fetch calls |
| `js/services/auth.service.ts` | Calls the API, saves the token, returns a clean success/error object |

---

## Design

- **Font:** Playfair Display (headings) + Poppins (body) — from Google Fonts
- **Primary color:** Rose `#c2375f`
- **Background:** High-quality cosmetic photo with a rose gradient overlay
- **Card:** Pure white, `border-radius: 32px`, layered shadow
- **Responsive:** Desktop (≥960px) · Tablet (640–960px) · Mobile (≤640px)

---

## Backend Status

The backend (PHP REST API) is **not yet connected**.  
Both forms currently simulate a successful response after a short delay.  
When the backend is ready, remove the `simulateDelay` blocks in `login.ts` and `register.ts`
and uncomment the real `this.service.login()` / `this.service.register()` calls.
