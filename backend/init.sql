-- Initialize the database with extensions and basic setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a dedicated user for the application (optional)
-- CREATE USER crwdbolt_user WITH PASSWORD 'crwdbolt_password';
-- GRANT ALL PRIVILEGES ON DATABASE crwdbolt TO crwdbolt_user;

-- Set timezone
SET timezone = 'UTC';

-- Enable row level security (optional, for future use)
-- ALTER DATABASE crwdbolt SET row_security = on;
