# Sanjeevani: an elder-first care circle
PromptWars x Catalyst challenge: **Elderly Care & Medication Management Platform**.

The elder stays in charge. Caregivers *suggest* changes and the elder approves in one tap. Family can watch and send encouragement but cannot edit.

## Features
- **Secure login** (Supabase Auth). Invited people join by signing up with their invited, confirmed email.
- **Roles enforced in the database** (Row Level Security plus checked SQL functions): Elder, Caregiver, Family (view only).
- **Live sync** across devices (Realtime) on PostgreSQL.
- **Automatic emails** (cron, each sent once): dose coming up, missed dose (elder + caregiver + family), skipped dose, appointment in 1 hour (all three), and **no daily check-in by 11:00**.
- **Daily "I am OK" check-in** and an **emergency button** that emails caregivers and family (with location if allowed).
- **History-safe adherence**: each medicine version stores when it started and ended, so adding or editing a medicine never changes past days. Logic is in `core.mjs` and unit-tested (`npm test`).
- **Gemini** "Explain simply" and weekly summary: sign-in required, rate limited, server-built prompts, timeout, output validation, always a "not medical advice" note.
- **One-click judge demo** with sample data that is relative to the current time, so Due, Missed and Pending-approval states are visible immediately. Switch roles inside the app.
- Accessible: hyperlegible font, large Elder Mode, dark mode, keyboard focus.

## Setup (about 15 minutes)
1. Create a Supabase project and run `supabase/schema.sql` in the SQL Editor.
2. Put the project URL and **anon** key in `config.js`.
3. Push to GitHub and import in Vercel. Add the variables from `.env.example`.
4. cron-job.org: every minute GET `https://YOUR-APP/api/cron` with header `Authorization: Bearer <CRON_SECRET>`.
5. Email: the Resend test sender only delivers to your own Resend account email. Verify a domain to email others.
6. Keep "Confirm email" ON in Supabase Auth for real use. The demo users are created pre-confirmed by the server.

## Security notes
Passwords live only in Supabase Auth. The service-role key is server-only. API routes need a valid session, rate-limit per user, and pick email recipients themselves. The demo password never reaches the browser. Not a medical device and not an emergency service: always call 112 in an emergency.

## Roadmap
Push/SMS, several circles per person, audit log, password reset screen, end-to-end tests.
