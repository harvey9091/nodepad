-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    blocks JSONB DEFAULT '[]'::jsonb,
    collapsed_ids JSONB DEFAULT '[]'::jsonb,
    ghost_notes JSONB DEFAULT '[]'::jsonb,
    last_ghost_block_count INTEGER DEFAULT 0,
    last_ghost_timestamp BIGINT DEFAULT 0,
    last_ghost_texts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read/write (since auth is disabled per user request)
-- In a production app, you would restrict this to authenticated users.
CREATE POLICY "Public full access" ON projects
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
