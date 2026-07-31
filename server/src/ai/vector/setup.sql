-- 1. Enable the pgvector extension
create extension if not exists vector;

-- 2. Create the table for storing chunked disease embeddings
create table if not exists disease_chunks (
  id bigserial primary key,
  disease_id text not null,
  chunk_type text not null,
  content text not null,
  -- We use 768 dimensions because Google Gemini text-embedding-004 outputs 768-d vectors.
  -- Change this to 1536 if you swap to OpenAI text-embedding-3-small.
  embedding vector(768)
);

-- 3. Create a functional index for faster vector searching (optional but recommended for production)
-- create index on disease_chunks using hnsw (embedding vector_cosine_ops);

-- 4. Create the match_disease_chunks RPC function for semantic similarity search
create or replace function match_disease_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_type text default null
)
returns table (
  id bigint,
  disease_id text,
  chunk_type text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    disease_chunks.id,
    disease_chunks.disease_id,
    disease_chunks.chunk_type,
    disease_chunks.content,
    -- Cosine similarity: 1 - Cosine Distance
    1 - (disease_chunks.embedding <=> query_embedding) as similarity
  from disease_chunks
  where 1 - (disease_chunks.embedding <=> query_embedding) > match_threshold
    and (filter_type is null or disease_chunks.chunk_type = filter_type)
  order by disease_chunks.embedding <=> query_embedding
  limit match_count;
$$;
