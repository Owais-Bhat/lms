-- =======================================================
-- BAKESTUDIO SUPABASE POSTGRESQL SCHEMA MIGRATION
-- =======================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    delivery_fee NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    flavor TEXT,
    price NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    review_count INT DEFAULT 1,
    eggless BOOLEAN DEFAULT TRUE,
    gluten_free BOOLEAN DEFAULT FALSE,
    weights JSONB,
    illustration TEXT,
    image TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Theme Config Table
CREATE TABLE IF NOT EXISTS public.theme_config (
    id TEXT PRIMARY KEY DEFAULT 'current_theme',
    config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY DEFAULT 'admin_1',
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Super Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Default Admin User
INSERT INTO public.admin_users (id, username, password, role)
VALUES ('admin_1', 'admin', 'Awais111@9149@', 'Super Admin')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS) & Grant Public Access for Demo
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public read/write on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public read/write on theme_config" ON public.theme_config FOR ALL USING (true);
CREATE POLICY "Allow public read/write on admin_users" ON public.admin_users FOR ALL USING (true);

-- =======================================================
-- 5. Storage bucket for product image uploads (admin panel)
-- =======================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public upload product-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public update product-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');
CREATE POLICY "Public delete product-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
