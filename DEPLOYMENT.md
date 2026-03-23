# Racing App Deployment Guide

## Live Setup met Supabase Database

Deze app is nu geconfigureerd om met een live Supabase database te werken waarbij alle data wordt opgeslagen.

### 1. Database Setup (Voltooid)
- ✅ Supabase database is geconfigureerd
- ✅ Sample data is geüpload
- ✅ Tables: users, teams, races, circuits, etc.

### 2. Environment Variabelen
De app gebruikt de volgende environment variabelen:
- `VITE_SUPABASE_URL`: Je Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Je public Supabase key

### 3. Deploy Opties

#### Optie A: Vercel (Aanbevolen)
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Voeg environment variabelen toe in Vercel dashboard

#### Optie B: Netlify
1. Build de app: `npm run build`
2. Upload de `dist` folder naar Netlify
3. Voeg environment variabelen toe in Netlify dashboard

#### Optie C: Eigen Hosting
1. Build de app: `npm run build`
2. Upload de `dist` folder naar je webserver
3. Configureer de environment variabelen

### 4. Data Opslag
Alle data die in de website wordt ingevoerd wordt automatisch opgeslagen in:
- Users en team members
- Races en circuits
- Lap times en pit stops
- Agenda events
- Financial records
- Safety tests

### 5. Database Beheer
Je kunt de database beheren via:
- Supabase Dashboard: https://supabase.com/dashboard
- Direct SQL queries in Supabase SQL Editor
- Of via de app interface

### 6. Testen
Nadat de app is deployed:
1. Test user registratie
2. Voeg races en circuits toe
3. Controleer of data wordt opgeslagen in Supabase
4. Verify real-time updates

### Veiligheid
- Gebruik altijd de anon key voor client-side operaties
- Service key alleen voor server-side/admin functies
- Enable Row Level Security (RLS) in Supabase voor extra beveiliging
