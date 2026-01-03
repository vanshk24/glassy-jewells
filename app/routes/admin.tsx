import { type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { requireAdminUser, logout } from '~/utils/session.server';
import { AdminLayout } from '~/components/admin-layout';
import { useLoaderData } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const adminSession = await requireAdminUser(request);
  return { adminSession };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdminUser(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'logout') {
    return logout(request);
  }

  return null;
}

export default function Admin() {
  const { adminSession } = useLoaderData<typeof loader>();

  return <AdminLayout adminSession={adminSession} />;
}
