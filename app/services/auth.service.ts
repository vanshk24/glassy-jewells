import { supabase } from "~/supabase/client";
import bcrypt from "bcryptjs";
import type { AdminSession } from "~/types/admin";

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, email, role, is_active, password_hash")
    .eq("email", email)
    .single();

  if (error || !admin) {
    return null;
  }

  // Check if admin is active
  if (!admin.is_active) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
}

export async function createAdminUser(
  email: string,
  password: string,
  role: string = "admin"
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email,
      password_hash: hashedPassword,
      role,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    role: data.role,
  };
}
