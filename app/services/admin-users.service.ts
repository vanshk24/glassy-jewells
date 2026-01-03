import { supabase } from "~/supabase/client";
import bcrypt from "bcryptjs";
import type { AdminRole, AdminUser } from "~/types/admin";

export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, role, is_active, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AdminUser[];
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, role, is_active, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as AdminUser;
}

export async function createAdminUser(
  email: string,
  password: string,
  role: AdminRole
): Promise<AdminUser> {
  // Check if email already exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({
      email,
      password_hash: hashedPassword,
      role,
      is_active: true,
    })
    .select("id, email, role, is_active, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as AdminUser;
}

export async function updateAdminUserRole(
  id: string,
  role: AdminRole
): Promise<AdminUser> {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ 
      role,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id, email, role, is_active, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as AdminUser;
}

export async function updateAdminUserStatus(
  id: string,
  is_active: boolean
): Promise<AdminUser> {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ 
      is_active,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id, email, role, is_active, created_at, updated_at")
    .single();

  if (error) throw error;
  return data as AdminUser;
}

export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from("admin_users")
    .update({ 
      password_hash: hashedPassword,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteAdminUser(id: string): Promise<void> {
  // Prevent deleting the last super_admin
  const { data: superAdmins } = await supabase
    .from("admin_users")
    .select("id")
    .eq("role", "super_admin")
    .eq("is_active", true);

  const { data: userToDelete } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", id)
    .single();

  if (
    userToDelete?.role === "super_admin" &&
    superAdmins &&
    superAdmins.length <= 1
  ) {
    throw new Error("Cannot delete the last super admin");
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", id);

  if (error) throw error;
}
