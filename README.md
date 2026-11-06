# AI NOBIE

AI NOBIE is a mobile-friendly AI image-generation studio built with Next.js and powered by the FLUX model through fal.ai.

## Features
- Text-to-image generation
- 1:1, 4:5, 3:2, 16:9 and 9:16 aspect-ratio presets
- Generate 1–4 images per request
- PNG output and download links
- Responsive dark studio interface
- Server-side API key handling

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your fal.ai API key as `FAL_KEY`.
5. Run `npm run dev` and open http://localhost:3000.

## API key
Create a key in the [fal.ai dashboard](https://fal.ai/dashboard/keys). Never put the key in client-side code or commit it to Git.

## Deploy
Import this repository into Vercel, add `FAL_KEY` under Project Settings → Environment Variables, then deploy.

## Important
Image generation uses a paid third-party API and may incur usage charges. The app does not include user accounts, cloud image storage, or billing yet; those are planned for later milestones.