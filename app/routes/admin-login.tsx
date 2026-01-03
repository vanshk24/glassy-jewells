import { Form, useActionData, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';
import { Label } from '~/components/ui/label/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card/card';
import { verifyAdminCredentials } from '~/services/auth.service';
import { createUserSession, getAdminSession } from '~/utils/session.server';
import styles from './admin-login.module.css';

export async function loader({ request }: LoaderFunctionArgs) {
  // Redirect to admin if already logged in
  const adminSession = await getAdminSession(request);
  if (adminSession) {
    return redirect('/admin');
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const adminSession = await verifyAdminCredentials(email, password);
  
  if (!adminSession) {
    return { error: 'Invalid email or password' };
  }

  return createUserSession(adminSession, '/admin');
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className={styles.form}>
            <div className={styles.field}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@luxecraft.com"
                required
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                required
              />
            </div>
            {actionData?.error && <p className={styles.error}>{actionData.error}</p>}
            <Button type="submit" className={styles.submitBtn}>
              Login
            </Button>
          </Form>
          <div className={styles.demoCredentials}>
            <p className={styles.demoTitle}>Create an admin account using Supabase</p>
            <p>See RAZORPAY_SETUP.md for instructions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
