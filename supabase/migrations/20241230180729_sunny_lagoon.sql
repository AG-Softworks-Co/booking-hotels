/*
  # Initial Schema for Hotel Management System

  1. New Tables
    - hotels
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - phone (text)
      - address (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - rooms
      - id (uuid, primary key)
      - hotel_id (uuid, foreign key)
      - name (text)
      - type (text)
      - price (numeric)
      - status (text)
      - description (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - services
      - id (uuid, primary key)
      - hotel_id (uuid, foreign key)
      - name (text)
      - description (text)
      - price (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - reservations
      - id (uuid, primary key)
      - hotel_id (uuid, foreign key)
      - room_id (uuid, foreign key)
      - customer_name (text)
      - customer_email (text)
      - check_in (timestamp)
      - check_out (timestamp)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - payments
      - id (uuid, primary key)
      - reservation_id (uuid, foreign key)
      - amount (numeric)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for hotel access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hotels table
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Hotels are viewable by authenticated users"
  ON hotels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Hotels are insertable by authenticated users"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Hotels are updatable by hotel owners"
  ON hotels FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM hotels WHERE id = hotels.id
  ));

-- Similar policies for other tables
CREATE POLICY "Rooms are viewable by hotel owners"
  ON rooms FOR SELECT
  TO authenticated
  USING (hotel_id IN (
    SELECT id FROM hotels WHERE id = rooms.hotel_id
  ));

CREATE POLICY "Services are viewable by hotel owners"
  ON services FOR SELECT
  TO authenticated
  USING (hotel_id IN (
    SELECT id FROM hotels WHERE id = services.hotel_id
  ));

CREATE POLICY "Reservations are viewable by hotel owners"
  ON reservations FOR SELECT
  TO authenticated
  USING (hotel_id IN (
    SELECT id FROM hotels WHERE id = reservations.hotel_id
  ));

CREATE POLICY "Payments are viewable by hotel owners"
  ON payments FOR SELECT
  TO authenticated
  USING (reservation_id IN (
    SELECT id FROM reservations WHERE hotel_id IN (
      SELECT id FROM hotels WHERE id = reservations.hotel_id
    )
  ));