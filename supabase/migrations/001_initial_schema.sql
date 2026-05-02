-- ============================================================
-- GoHorn Detailing — Initial Schema
-- Apply in Supabase SQL Editor (all three stages at once, or
-- one stage at a time — each stage is safe to run independently).
-- ============================================================


-- ============================================================
-- STAGE 1 — TABLES
-- ============================================================

-- ── updated_at trigger function (shared by all tables that need it) ──
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ── bookings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- service & add-ons
  service             TEXT NOT NULL,
  addons              TEXT[] NOT NULL DEFAULT '{}',

  -- scheduling
  date                DATE NOT NULL,
  time                TEXT NOT NULL,

  -- vehicle
  vehicle_year        TEXT,
  vehicle_make        TEXT,
  vehicle_model       TEXT,
  vehicle_size        TEXT CHECK (vehicle_size IN ('small', 'medium', 'large')),

  -- location
  location            TEXT NOT NULL CHECK (location IN ('shop', 'mobile')),
  address             TEXT,

  -- customer
  customer_name       TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_notes      TEXT,
  first_time_discount BOOLEAN NOT NULL DEFAULT false,

  -- admin
  status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ── quotes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- customer
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT NOT NULL,

  -- vehicle
  vehicle_year     TEXT,
  vehicle_make     TEXT,
  vehicle_model    TEXT,
  vehicle_size     TEXT CHECK (vehicle_size IN ('small', 'medium', 'large')),

  -- request details
  service_interest TEXT,
  issues           TEXT[] NOT NULL DEFAULT '{}',
  location         TEXT CHECK (location IN ('shop', 'mobile')),
  photo_urls       TEXT[] NOT NULL DEFAULT '{}',
  notes            TEXT,

  -- admin
  status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'reviewed', 'quoted', 'booked', 'closed')),

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ── services ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  base_price    INTEGER NOT NULL,          -- dollars
  duration      TEXT,
  includes_list TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true
);


-- ── addons ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price_note    TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true
);


-- ── gallery_photos ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  caption       TEXT,
  category      TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name   TEXT NOT NULL,
  location      TEXT,
  service       TEXT,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text          TEXT,
  featured      BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ============================================================
-- STAGE 2 — ROW LEVEL SECURITY
-- ============================================================
-- Strategy:
--   anon  = unauthenticated public (website visitors)
--   authenticated = any logged-in user = admin
--
-- To add your admin account: sign up / invite via Supabase Auth
-- dashboard (Authentication → Users → Invite user). Any user
-- with a valid session will pass the authenticated policies.
-- You can tighten this to a specific UID or metadata role later.
-- ============================================================

ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE addons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews        ENABLE ROW LEVEL SECURITY;


-- ── bookings ─────────────────────────────────────────────────
-- Public can submit a booking; only admin can read/manage them.

CREATE POLICY "bookings_public_insert"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "bookings_admin_select"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "bookings_admin_update"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "bookings_admin_delete"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);


-- ── quotes ───────────────────────────────────────────────────
-- Same pattern as bookings.

CREATE POLICY "quotes_public_insert"
  ON quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "quotes_admin_select"
  ON quotes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quotes_admin_update"
  ON quotes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "quotes_admin_delete"
  ON quotes FOR DELETE
  TO authenticated
  USING (true);


-- ── services ─────────────────────────────────────────────────
-- Public read (so the site can show services); admin manages.

CREATE POLICY "services_public_select"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "services_admin_insert"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "services_admin_update"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "services_admin_delete"
  ON services FOR DELETE
  TO authenticated
  USING (true);


-- ── addons ───────────────────────────────────────────────────

CREATE POLICY "addons_public_select"
  ON addons FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "addons_admin_insert"
  ON addons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "addons_admin_update"
  ON addons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "addons_admin_delete"
  ON addons FOR DELETE
  TO authenticated
  USING (true);


-- ── gallery_photos ───────────────────────────────────────────

CREATE POLICY "gallery_public_select"
  ON gallery_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "gallery_admin_insert"
  ON gallery_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "gallery_admin_update"
  ON gallery_photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "gallery_admin_delete"
  ON gallery_photos FOR DELETE
  TO authenticated
  USING (true);


-- ── reviews ──────────────────────────────────────────────────

CREATE POLICY "reviews_public_select"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "reviews_admin_insert"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "reviews_admin_update"
  ON reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "reviews_admin_delete"
  ON reviews FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- STAGE 3 — SEED DATA
-- ============================================================

-- ── services ─────────────────────────────────────────────────
INSERT INTO services (slug, name, description, base_price, duration, includes_list, display_order) VALUES
(
  'express',
  'Express Wash & Wax',
  'Hand wash, wax, wheels, and a quick interior tidy. Great for regular maintenance.',
  69,
  '~1 hour',
  ARRAY[
    'Hand wash & dry',
    'Exterior wax',
    'Wheel & tire cleaning',
    'Window cleaning (exterior)',
    'Door jambs wiped down',
    'Quick interior vacuum',
    'Dashboard dusted'
  ],
  1
),
(
  'interior',
  'Interior Refresh',
  'Deep interior cleaning with shampoo, odor treatment, and full surface wipe-down.',
  149,
  '2–3 hrs',
  ARRAY[
    'Full vacuum (seats, floor, trunk)',
    'Seat & carpet shampoo',
    'Dashboard & console deep clean',
    'Door panels & pockets cleaned',
    'Cup holders & vents detailed',
    'Window cleaning (interior)',
    'Odor treatment',
    'UV protectant on plastic surfaces'
  ],
  2
),
(
  'full',
  'Full Detail',
  'Everything inside and out — polish, stains, pet hair. The works.',
  239,
  '4–5 hrs',
  ARRAY[
    'Everything in Express Wash & Wax',
    'Everything in Interior Refresh',
    'Paint polish & light scratch reduction',
    'Clay bar decontamination',
    'Heavy stain & pet hair removal',
    'Leather conditioning (if applicable)',
    'Engine bay light clean',
    'Tire dressing',
    'Air freshener finish'
  ],
  3
);


-- ── addons ───────────────────────────────────────────────────
INSERT INTO addons (slug, name, description, price_note, display_order) VALUES
(
  'ceramic',
  'Ceramic Coating',
  'Long-lasting hydrophobic protection. Repels water, dirt, and UV damage.',
  'Quoted separately',
  1
),
(
  'pet_hair',
  'Pet Hair Deep Clean',
  'Thorough removal of embedded pet hair from seats, carpet, and trunk.',
  '+$30–$60',
  2
),
(
  'headlight',
  'Headlight Restoration',
  'Removes oxidation and yellowing from plastic headlight lenses.',
  '+$40–$60',
  3
),
(
  'engine',
  'Engine Bay Cleaning',
  'Full degreasing and detail of the engine bay.',
  '+$50–$80',
  4
),
(
  'stains',
  'Heavy Stain Removal',
  'Targeted treatment for tough stains — coffee, grease, ink, dye transfer.',
  '+$25–$50',
  5
),
(
  'odor',
  'Deep Odor Treatment',
  'Ozone or enzyme treatment for smoke, mildew, food, and other persistent odors.',
  '+$40–$75',
  6
),
(
  'clay',
  'Clay Bar Treatment',
  'Removes bonded surface contaminants for a glass-smooth paint feel.',
  '+$30–$50',
  7
),
(
  'leather',
  'Leather Conditioning',
  'Clean and condition all leather surfaces to prevent cracking and fading.',
  '+$25–$45',
  8
);
