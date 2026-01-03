import { supabase } from "~/supabase/client";
import type { Database } from "~/supabase/client";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product: {
      id: string;
      name: string;
      images: string[];
    };
  })[];
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          images
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data.map((order) => ({
    ...order,
    items: order.order_items.map((item: any) => ({
      ...item,
      product: item.products,
    })),
  })) as OrderWithItems[];
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (
          id,
          name,
          images
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return {
    ...data,
    items: data.order_items.map((item: any) => ({
      ...item,
      product: item.products,
    })),
  } as OrderWithItems;
}

export async function createOrder(
  orderData: OrderInsert,
  items: Omit<OrderItemInsert, "order_id">[]
) {
  // Create the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItems = items.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order as Order;
}

export async function updateOrderStatus(
  id: string,
  status: { order_status?: string; payment_status?: string }
) {
  const { data, error } = await supabase
    .from("orders")
    .update(status)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) throw error;
}

export async function getOrderStats() {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("total_amount, order_status, created_at");

  if (error) throw error;

  const total = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pending = orders.filter((o) => o.order_status === "pending").length;
  const completed = orders.filter((o) => o.order_status === "delivered").length;

  return {
    totalRevenue: total,
    totalOrders: orders.length,
    pendingOrders: pending,
    completedOrders: completed,
  };
}
