-- Digital Robot Factory: Core Database Schema

-- 1. Contractors Table (La Jolla, Del Mar, Coronado Plumbing Partners)
CREATE TABLE IF NOT EXISTS contractors (
    id SERIAL PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    target_zipcodes TEXT[] NOT NULL, -- e.g. {'92037', '92014', '92118'}
    stripe_customer_id VARCHAR(255),
    stripe_payment_method_id VARCHAR(255), -- SetupIntent authorized card
    active BOOLEAN DEFAULT true,
    ai_reception_subscriber BOOLEAN DEFAULT false, -- $2,500/mo upsell status
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ingested Leads Table (San Diego Pilot)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    service_requested TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'INGESTED', -- INGESTED, DISPATCHED, UNMATCHED, CHARGED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Lead Dispatches & Automatic Billing Ledger
CREATE TABLE IF NOT EXISTS dispatches (
    id SERIAL PRIMARY KEY,
    lead_id INT REFERENCES leads(id) ON DELETE CASCADE,
    contractor_id INT REFERENCES contractors(id) ON DELETE CASCADE,
    lead_price_cents INT NOT NULL DEFAULT 5000, -- $50.00 default lead price
    stripe_charge_id VARCHAR(255),
    billing_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, FAILED
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast Zipcode Matching (Agent 1)
CREATE INDEX IF NOT EXISTS idx_leads_zipcode ON leads(zipcode);
CREATE INDEX IF NOT EXISTS idx_contractors_zips ON contractors USING GIN(target_zipcodes);
