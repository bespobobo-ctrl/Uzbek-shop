-- ==========================================================================
-- UZBEKSHOP TEXNOMART - SUPABASE DATABASE SCHEMA SQL (Quoted Identifiers)
-- Copy and paste this into Supabase SQL Editor:
-- Project: https://yttzgafjhujjhwkcmasb.supabase.co
-- ==========================================================================

-- Drop existing tables to refresh column casing
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.orders;

-- 1. Create Products Table with exact camelCase column names
CREATE TABLE public.products (
    "id" BIGINT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "categoryName" TEXT,
    "brand" TEXT,
    "price" NUMERIC,
    "oldPrice" NUMERIC,
    "monthlyPrice" NUMERIC,
    "stock" INT DEFAULT 10,
    "rating" NUMERIC DEFAULT 5.0,
    "reviews" INT DEFAULT 0,
    "badge" TEXT,
    "badgeColor" TEXT,
    "image" TEXT,
    "isFlashDeal" BOOLEAN DEFAULT false,
    "description" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE public.orders (
    "id" BIGINT PRIMARY KEY,
    "customer" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "product" TEXT,
    "amount" NUMERIC,
    "date" TEXT,
    "status" TEXT DEFAULT 'Yangi',
    "statusType" TEXT DEFAULT 'warning',
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable Row Level Security for simple public access
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- 4. Initial Seed Products Data
INSERT INTO public.products ("id", "name", "category", "categoryName", "brand", "price", "oldPrice", "monthlyPrice", "stock", "rating", "reviews", "badge", "badgeColor", "image", "isFlashDeal", "description")
VALUES
(101, 'Smartfon Apple iPhone 15 Pro 128GB Natural Titanium', 'smartfonlar', 'Smartfonlar', 'Apple', 14200000, 15800000, 1450000, 12, 4.9, 128, 'SUPER NARX', 'yellow', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80', true, 'A17 Pro chip, Titanium korpus, 48 MP Action kamera va Dynamic Island.'),
(102, 'Smartfon Samsung Galaxy S24 Ultra 12/512GB Titanium Black', 'smartfonlar', 'Smartfonlar', 'Samsung', 15900000, 17200000, 1620000, 8, 4.9, 94, '0-0-12', 'yellow', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80', true, 'Galaxy AI imkoniyatlari, 200MP kamera va Snapdragon 8 Gen 3.'),
(103, 'Noutbuk Apple MacBook Air 13 M2 8/256GB Midnight', 'kompyuterlar', 'Kompyuterlar', 'Apple', 12800000, 14100000, 1290000, 5, 4.8, 65, 'HIT SOTUV', 'yellow', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80', true, 'M2 protsessor, Liquid Retina ekrani va ingichka dizayn.'),
(104, 'Noutbuk ASUS TUF Gaming F15 i5-12500H RTX 3050 16GB', 'kompyuterlar', 'Kompyuterlar', 'ASUS', 9800000, 10900000, 990000, 14, 4.7, 42, 'AKSIYA', 'red', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80', false, 'Kuchli o''yin noutbuki, 144Hz IPS ekran va harbiylarcha baquvvat korpus.'),
(105, 'Televizor Artel 55AU90G 4K UHD Smart Android TV', 'tv-audio', 'TV va Audio', 'Artel', 4800000, 5300000, 490000, 20, 4.6, 88, '0% TO''LOV', 'yellow', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80', true, '55 dyuymli 4K UHD tasvirlash va Android TV.'),
(106, 'Muzlatgich LG GR-B569BLCZ No Frost Inverter', 'maishiy-texnika', 'Maishiy texnika', 'LG', 8600000, 9400000, 870000, 7, 4.9, 31, 'TOP KAFOLAT', 'yellow', 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80', false, 'Smart Inverter kompressor, Total No Frost va A++ sinf.'),
(107, 'Kir yuvish mashinasi Bosch WAN24200ME 8 kg Inverter', 'maishiy-texnika', 'Maishiy texnika', 'Bosch', 6200000, 6900000, 630000, 3, 4.9, 56, 'GERMAN QUALITY', 'yellow', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80', true, 'EcoSilence Drive vositasi va gigiyenik bug''da yuvish.'),
(108, 'Konditsioner Haier Tundra Inverter 12 HSU-12H', 'iqlim', 'Iqlim texnikasi', 'Haier', 4300000, 4800000, 440000, 18, 4.7, 29, 'BEPUL O''RNATISH', 'yellow', 'https://images.unsplash.com/photo-1631545806604-e34988f57fa5?auto=format&fit=crop&w=600&q=80', false, 'Inverter dvigatel va jim ishlash rejimi.');
