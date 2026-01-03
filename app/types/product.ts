// Product type from Supabase database
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  category: string;
  images: string[];
  stock: number;
  is_active: boolean;
  created_at: string;
}

// Simplified product type for cart and wishlist
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  category: string;
  description: string;
}
