-- What: Enables necessary PostgreSQL extensions
-- Why: Required for generating UUIDs
-- Dependencies: None

create extension if not exists "uuid-ossp";
