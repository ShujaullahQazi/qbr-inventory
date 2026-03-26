CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_mongo_id VARCHAR(24) UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    agency_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'dealer',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_mongo_id VARCHAR(24) UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    property_type VARCHAR(100) NOT NULL,
    size VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    budget NUMERIC,
    description TEXT,
    contact_note TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_mongo_id VARCHAR(24) UNIQUE,
    need_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    available_listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_mongo_id VARCHAR(24) UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
