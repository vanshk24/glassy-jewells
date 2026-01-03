import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // In server context (Node.js), use process.env
  // In browser context, use import.meta.env
  const isServer = typeof window === "undefined";
  
  const supabaseUrl = isServer 
    ? (process.env.SUPABASE_PROJECT_URL || process.env.SUPABASE_URL || "")
    : import.meta.env.VITE_SUPABASE_URL || "";
    
  const supabaseAnonKey = isServer
    ? (process.env.SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY || "")
    : import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase configuration missing:", {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey,
      isServer
    });
    throw new Error(
      "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY (server) or VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (client)."
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
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
        };
        Insert: Omit<
          Database["public"]["Tables"]["products"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["products"]["Insert"]
        >;
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          total_amount: number;
          payment_status: string;
          order_status: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price: number;
        };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          role: string;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_users"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
    };
  };
};
