CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    minecraft_nick TEXT NOT NULL,
    discord_nick TEXT NOT NULL,
    password TEXT NOT NULL,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    price NUMERIC NOT NULL,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    store_name TEXT DEFAULT 'CariocaCraft Store',
    server_ip TEXT DEFAULT 'play.cariocacraft.com',
    server_port TEXT DEFAULT '25565',
    maintenance BOOLEAN DEFAULT FALSE
);

INSERT INTO settings (id, store_name, server_ip, server_port, maintenance)
VALUES (1, 'CariocaCraft Store', 'play.cariocacraft.com', '25565', false)
ON CONFLICT DO NOTHING;
