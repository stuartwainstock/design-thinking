This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Storybook & Chromatic

Design system documentation lives in Storybook (Tailwind + tokens from `src/app/globals.css`).

```bash
npm run storybook          # local dev on :6006
npm run build-storybook    # static build → storybook-static/
```

**Chromatic** publishes that build for visual review on pull requests.

1. Sign in at [chromatic.com](https://www.chromatic.com) with GitHub and add this repository.
2. Copy the **project token** for the `web` Storybook.
3. Add GitHub repo secret **`CHROMATIC_PROJECT_TOKEN`** (Settings → Secrets → Actions).
4. Optional local publish: `CHROMATIC_PROJECT_TOKEN=… npm run chromatic` from `web/`.

CI runs `.github/workflows/chromatic.yml` on `main` pushes and PRs (`exitZeroOnChanges` — review diffs in Chromatic, not failing checks).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
