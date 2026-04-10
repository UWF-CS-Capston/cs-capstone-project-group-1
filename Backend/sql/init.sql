CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS machine_queue (
    id SERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (machine_id, user_id)
);

CREATE TABLE IF NOT EXISTS machine_usage (
    id SERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL UNIQUE REFERENCES machines(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_plan_items (
    id SERIAL PRIMARY KEY,
    workout_plan_id INTEGER NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight NUMERIC,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workout_plan_id, position)
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user_id
    ON workout_plans(user_id);

CREATE INDEX IF NOT EXISTS idx_workout_plan_items_plan_id
    ON workout_plan_items(workout_plan_id);

INSERT INTO machines (name)
VALUES
    ('Bench Press'),
    ('Leg Press'),
    ('Treadmill'),
    ('Lat Pulldown')
ON CONFLICT (name) DO NOTHING;
