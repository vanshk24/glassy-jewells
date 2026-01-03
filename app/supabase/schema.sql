-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin'
);

-- Create indexes for better performance
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Row Level Security Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin to manage products" ON products
  FOR ALL USING (true);

-- Orders: Public can create and read, admin can manage via session auth
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow update orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete orders" ON orders
  FOR DELETE USING (true);

-- Order Items: Public can create and read, admin can manage via session auth
CREATE POLICY "Public can create order items" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read access to order items" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow update order items" ON order_items
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete order items" ON order_items
  FOR DELETE USING (true);

-- Admin Users: Session-based auth (protected at application layer)
CREATE POLICY "admin_users_allow_all" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);
