-- Chat query log for tracking what the team is asking the knowledge agent.
-- Inserted by the Next.js /api/chat route via PostgREST (service_role key).
-- RLS: service_role only — no anonymous access.

create table if not exists chat_queries (
  id            uuid default gen_random_uuid() primary key,
  question      text not null,
  retrieval     text not null,          -- rag | sanity-groq | sanity-groq-fallback | ...
  matched_types text[] default '{}',    -- document types returned by retrieval
  created_at    timestamptz default now()
);

-- Enable RLS (locked to service_role by default — no policies = no anon access)
alter table chat_queries enable row level security;

-- Index for time-range queries
create index if not exists idx_chat_queries_created_at on chat_queries (created_at desc);

comment on table chat_queries is 'Logs every question sent to the knowledge agent for pattern analysis.';
