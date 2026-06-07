DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'TODO'
              CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);