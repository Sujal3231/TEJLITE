# Tej Lite — Bespoke Lighting Website

The website for **Tej Lite**, a maker of premium bespoke lighting for homes, offices and hotels (*"Connecting Light To Life"*). It has a public site where people browse products, services, projects and catalogs, and an admin panel where the Tej Lite team manages all of that content and reads customer enquiries.

It's built with **React 19 + TypeScript + Vite**, styled with **Tailwind CSS + shadcn/ui**, uses **Firebase** (Firestore, Auth, Analytics, Hosting) as the backend, and sends enquiry emails through **EmailJS**.

---

## Features

### Public website
| Route | Page |
| --- | --- |
| `/` | Home |
| `/products`, `/products/:slug` | Product listing and product detail (with enquiry form) |
| `/services`, `/services/:slug` | Services and service detail |
| `/projects`, `/projects/:slug` | Portfolio of completed projects |
| `/catalogs` | Downloadable catalogs, grouped by category |
| `/about` | Company history and timeline |
| `/contact` | Contact form |

- A floating WhatsApp button for quick contact
- Product and contact enquiries are saved to Firestore **and** emailed to the team via EmailJS
- Responsive layout with animations from Framer Motion

### Admin panel (`/admin`)
You must log in (Firebase Auth) and be listed in the `admins` collection.

- **Dashboard**: overview and stats
- **Products** and **Categories**: product catalogue management
- **Projects**, **Services**, **Testimonials**: content management
- **Catalogs**: upload catalogs and sort them into catalog categories
- **Enquiries**: read and manage customer enquiries
- **Settings**: site-wide settings

`/setup` is a one-time page that creates the first admin account.

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, TypeScript 5.9, Vite 7 |
| Routing | React Router 7 |
| Styling / UI | Tailwind CSS 3, shadcn/ui (Radix UI), lucide-react, react-icons |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Firebase Firestore, Firebase Auth, Firebase Analytics |
| Email | EmailJS (`@emailjs/browser`) |
| Hosting | Firebase Hosting |
| Notifications | Sonner |

---

## Project structure

```
TEJLITE/
├── firebase.json              # Hosting config (SPA rewrites, security + cache headers)
├── firestore.rules            # Firestore security rules
├── Tejlite Client Latest Logo/ # Source client logos
└── app/                       # The React application
    ├── index.html             # HTML entry, SEO meta tags
    ├── public/                # Static assets (favicon, images, robots.txt)
    ├── vite.config.ts         # Vite config, "@" alias, manual vendor chunks
    ├── tailwind.config.js
    ├── components.json        # shadcn/ui config
    ├── email.md               # HTML source for the EmailJS templates
    └── src/
        ├── main.tsx / App.tsx # Entry point and route definitions
        ├── config/            # firebase.ts, emailjs.ts
        ├── contexts/          # AuthContext (admin session)
        ├── layouts/           # MainLayout (public), AdminLayout
        ├── pages/             # Public pages
        │   └── admin/         # Admin panel pages
        ├── components/
        │   ├── navigation/    # Navigation, Footer
        │   ├── ui/            # shadcn/ui components
        │   ├── ui-custom/     # WhatsAppButton
        │   ├── ProtectedRoute.tsx
        │   └── ScrollToTop.tsx
        ├── services/          # Firestore data access: products, auth, upload, analytics, seed
        ├── types/             # Shared TypeScript types
        ├── utils/             # Maintenance helpers (e.g. clearFirestoreData)
        └── images/            # Bundled images (timeline, logos, clients)
```

---

## Getting started

### Prerequisites
- **Node.js 20+** and npm
- **Firebase CLI**, only needed for deploying: `npm install -g firebase-tools`

### Install and run locally

```bash
cd app
```

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at http://localhost:5173.

### Scripts (run inside `app/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Type-checks (`tsc -b`) and builds to `app/dist` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

---

## Configuration

### Firebase
The Firebase web config is in [`app/src/config/firebase.ts`](app/src/config/firebase.ts) (project `tej-lite`). To point the site at a different Firebase project:

1. Create a project in the [Firebase console](https://console.firebase.google.com).
2. Turn on **Firestore**, **Authentication** (Email/Password) and **Analytics**.
3. Copy the web app config from *Project settings → General → Your apps* into `firebase.ts`.
4. Deploy the security rules: `firebase deploy --only firestore:rules`.

### EmailJS
EmailJS settings (service ID, template IDs, public key) are in [`app/src/config/emailjs.ts`](app/src/config/emailjs.ts). There are two templates:

- **Contact template**: used by the contact form
- **Product template**: used by product enquiries

The HTML for the templates is in [`app/email.md`](app/email.md). Paste it into the EmailJS dashboard when you set up a new account.

### Image uploads
Admin images are compressed in the browser and saved as data URLs in Firestore (see [`app/src/services/upload.ts`](app/src/services/upload.ts)). That file also has an ImgBB uploader, switched off by default. To use it, set `VITE_IMGBB_API_KEY` in `app/.env`.

---

## Firestore data model

| Collection | Read | Write |
| --- | --- | --- |
| `products`, `categories`, `subcategories` | Public | Admin |
| `projects`, `services`, `testimonials` | Public | Admin |
| `catalogs`, `catalogCategories` | Public | Admin |
| `settings` | Public | Admin |
| `contacts`, `enquiries` | Admin | Anyone can create; admin can update or delete |
| `analytics` | Admin | Admin |
| `admins` | The user's own document | See [`firestore.rules`](firestore.rules) |

A user counts as an admin when a document with their Firebase Auth UID exists in `admins/{uid}`.

---

## First-time admin setup

1. Run the app, locally or deployed, and open **`/setup`**.
2. Enter an email, a password (at least 6 characters) and a display name. This creates the Firebase Auth user and their `admins/{uid}` document.
3. Log in at **`/admin/login`**.

---

## Deployment

The site is hosted on **Firebase Hosting**. Hosting serves `app/dist` and sends every route to `index.html` so client-side routing works. It also sets security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) and caches static assets for a long time.

```bash
cd app && npm run build && cd ..
```

```bash
firebase deploy --only hosting
```

To deploy hosting and Firestore rules together:

```bash
firebase deploy
```

---

## License

Private and proprietary. © Tej Lite. All rights reserved.
