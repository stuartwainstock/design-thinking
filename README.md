# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## This repo

- **Project:** `eff153ps` · **Dataset:** `production`
- **Dev:** `npm run dev` (Studio at [http://localhost:3333](http://localhost:3333) by default)
- **Schema:** `schemaTypes/` — design-knowledge types (phase, tag, framework, process, insight, principle, external resource). After schema edits run `npx sanity schema deploy`.
- **Seed data (optional):** `scripts/seed-data.ts` — example payloads; convert to NDJSON or import via the API when you are ready.

**Note:** The document type for annotated links is `externalResource` (studio title still “Reference”) because `reference` is reserved in Sanity.
