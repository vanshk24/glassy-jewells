import { 
  useLoaderData, 
  useActionData, 
  Form,
  redirect,
  type LoaderFunctionArgs, 
  type ActionFunctionArgs 
} from 'react-router';
import { Button } from '~/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { Input } from '~/components/ui/input/input';
import { Label } from '~/components/ui/label/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '~/components/ui/dialog/dialog';
import { Badge } from '~/components/ui/badge/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '~/components/ui/select/select';
import { requireSuperAdmin } from '~/utils/session.server';
import { 
  getAllAdminUsers, 
  createAdminUser, 
  updateAdminUserRole, 
  updateAdminUserStatus,
  deleteAdminUser
} from '~/services/admin-users.service';
import { UserPlus, Shield, Users, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { ROLE_LABELS, ROLE_DESCRIPTIONS, type AdminRole } from '~/types/admin';
import styles from './admin.users.module.css';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireSuperAdmin(request);
  const users = await getAllAdminUsers();
  return { users, currentUser: adminSession };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireSuperAdmin(request);
  
  const formData = await request.formData();
  const intent = formData.get('intent') as string;

  try {
    if (intent === 'create') {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const role = formData.get('role') as AdminRole;

      if (!email || !password || !role) {
        return { error: 'All fields are required' };
      }

      if (password.length < 8) {
        return { error: 'Password must be at least 8 characters' };
      }

      await createAdminUser(email, password, role);
      return { success: 'Admin user created successfully' };
    }

    if (intent === 'updateRole') {
      const userId = formData.get('userId') as string;
      const role = formData.get('role') as AdminRole;

      await updateAdminUserRole(userId, role);
      return { success: 'Role updated successfully' };
    }

    if (intent === 'toggleStatus') {
      const userId = formData.get('userId') as string;
      const isActive = formData.get('isActive') === 'true';

      await updateAdminUserStatus(userId, !isActive);
      return { success: 'Status updated successfully' };
    }

    if (intent === 'delete') {
      const userId = formData.get('userId') as string;

      await deleteAdminUser(userId);
      return { success: 'User deleted successfully' };
    }

    return { error: 'Invalid intent' };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

export default function AdminUsers() {
  const { users, currentUser } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Users</h1>
          <p className={styles.subtitle}>Manage admin users and their roles</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Add a new administrator with specific role and permissions
              </DialogDescription>
            </DialogHeader>
            
            <Form method="post" className={styles.createForm} onSubmit={() => {
              if (actionData && 'success' in actionData) {
                setIsDialogOpen(false);
              }
            }}>
              <input type="hidden" name="intent" value="create" />
              
              <div className={styles.field}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  required
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="role">Role</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">
                      <div>
                        <div>{ROLE_LABELS.staff}</div>
                        <div className={styles.roleDesc}>{ROLE_DESCRIPTIONS.staff}</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div>
                        <div>{ROLE_LABELS.manager}</div>
                        <div className={styles.roleDesc}>{ROLE_DESCRIPTIONS.manager}</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="super_admin">
                      <div>
                        <div>{ROLE_LABELS.super_admin}</div>
                        <div className={styles.roleDesc}>{ROLE_DESCRIPTIONS.super_admin}</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {actionData && 'error' in actionData && (
                <p className={styles.error}>{actionData.error}</p>
              )}

              <Button type="submit" className={styles.submitBtn}>
                Create Admin User
              </Button>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {actionData && 'success' in actionData && (
        <div className={styles.successMessage}>
          <Shield />
          {actionData.success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Admin Users ({users.length})</CardTitle>
          <CardDescription>
            Manage administrator accounts and access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.usersTable}>
            <div className={styles.tableHeader}>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div>Created</div>
              <div>Actions</div>
            </div>
            
            {users.map((user) => (
              <div key={user.id} className={styles.userRow}>
                <div className={styles.userEmail}>
                  {user.email}
                  {user.id === currentUser.id && (
                    <Badge variant="outline" className={styles.youBadge}>You</Badge>
                  )}
                </div>
                
                <div className={styles.userRole}>
                  <Form method="post" className={styles.inlineForm}>
                    <input type="hidden" name="intent" value="updateRole" />
                    <input type="hidden" name="userId" value={user.id} />
                    <Select 
                      name="role" 
                      defaultValue={user.role}
                      onValueChange={(value) => {
                        const form = document.getElementById(`role-form-${user.id}`) as HTMLFormElement;
                        if (form) form.requestSubmit();
                      }}
                      disabled={user.id === currentUser.id}
                    >
                      <SelectTrigger id={`role-form-${user.id}`} className={styles.roleSelect}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">{ROLE_LABELS.staff}</SelectItem>
                        <SelectItem value="manager">{ROLE_LABELS.manager}</SelectItem>
                        <SelectItem value="super_admin">{ROLE_LABELS.super_admin}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Form>
                </div>

                <div className={styles.userStatus}>
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className={styles.userCreated}>
                  {new Date(user.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <div className={styles.userActions}>
                  <Form method="post" className={styles.inlineForm}>
                    <input type="hidden" name="intent" value="toggleStatus" />
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="isActive" value={String(user.is_active)} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      disabled={user.id === currentUser.id}
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {user.is_active ? <ToggleRight /> : <ToggleLeft />}
                    </Button>
                  </Form>

                  <Form method="post" className={styles.inlineForm}>
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="userId" value={user.id} />
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      disabled={user.id === currentUser.id}
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        if (!confirm(`Are you sure you want to delete ${user.email}?`)) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </Form>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={styles.permissionsCard}>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.permissionsGrid}>
            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>
                <Shield />
                {ROLE_LABELS.super_admin}
              </h3>
              <p className={styles.permissionDesc}>{ROLE_DESCRIPTIONS.super_admin}</p>
              <ul className={styles.permissionList}>
                <li>✓ Manage products</li>
                <li>✓ Manage orders</li>
                <li>✓ Manage admin users</li>
                <li>✓ View analytics</li>
              </ul>
            </div>

            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>
                <Shield />
                {ROLE_LABELS.manager}
              </h3>
              <p className={styles.permissionDesc}>{ROLE_DESCRIPTIONS.manager}</p>
              <ul className={styles.permissionList}>
                <li>✓ Manage products</li>
                <li>✓ Manage orders</li>
                <li>✗ Manage admin users</li>
                <li>✓ View analytics</li>
              </ul>
            </div>

            <div className={styles.permissionCard}>
              <h3 className={styles.permissionTitle}>
                <Shield />
                {ROLE_LABELS.staff}
              </h3>
              <p className={styles.permissionDesc}>{ROLE_DESCRIPTIONS.staff}</p>
              <ul className={styles.permissionList}>
                <li>✗ Manage products</li>
                <li>✓ View/update orders</li>
                <li>✗ Manage admin users</li>
                <li>✗ View analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
