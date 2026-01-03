import { supabase } from "~/supabase/client";
import type { Database } from "~/supabase/client";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
    return data as Product[];
  } catch (error) {
    console.error("Exception fetching all products:", error);
    return [];
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching active products:", error);
      return [];
    }
    return data as Product[];
  } catch (error) {
    console.error("Exception fetching active products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product by id:", error);
      return null;
    }
    return data as Product;
  } catch (error) {
    console.error("Exception fetching product by id:", error);
    return null;
  }
}

export async function createProduct(product: ProductInsert): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    return data as Product;
  } catch (error) {
    console.error("Exception creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    return data as Product;
  } catch (error) {
    console.error("Exception updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  } catch (error) {
    console.error("Exception deleting product:", error);
    throw error;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error searching products:", error);
      return [];
    }
    return data as Product[];
  } catch (error) {
    console.error("Exception searching products:", error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
    return data as Product[];
  } catch (error) {
    console.error("Exception fetching products by category:", error);
    return [];
  }
}
