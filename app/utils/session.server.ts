import { createCookieSessionStorage, redirect } from "react-router";
import { supabase } from "~/supabase/client";
import type { AdminRole, AdminSession } from "~/types/admin";

const sessionSecret = process.env.SESSION_SECRET || "default-secret-change-in-production";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "admin_session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
  });

export { getSession, commitSession, destroySession };

export async function createUserSession(
  adminSession: AdminSession,
  redirectTo: string
) {
  const session = await getSession();
  session.set("adminUser", adminSession);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getAdminSession(request: Request): Promise<AdminSession | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const adminUser = session.get("adminUser");
  
  if (!adminUser) {
    return null;
  }

  // Verify admin still exists and is active
  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, email, role, is_active")
    .eq("id", adminUser.id)
    .single();

  if (!admin || !admin.is_active) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  };
}

export async function requireAdminUser(
  request: Request,
  requiredRole?: AdminRole
): Promise<AdminSession> {
  const adminSession = await getAdminSession(request);
  
  if (!adminSession) {
    // Clear any existing session and redirect to login
    const session = await getSession(request.headers.get("Cookie"));
    throw redirect("/admin-login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  // Check role permission if specified
  if (requiredRole) {
    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      manager: 2,
      staff: 1,
    };

    if (roleHierarchy[adminSession.role] < roleHierarchy[requiredRole]) {
      throw redirect("/admin", {
        headers: {
          "Set-Cookie": await commitSession(await getSession(request.headers.get("Cookie"))),
        },
      });
    }
  }

  return adminSession;
}

export async function requireSuperAdmin(request: Request): Promise<AdminSession> {
  return requireAdminUser(request, "super_admin");
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/admin-login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
