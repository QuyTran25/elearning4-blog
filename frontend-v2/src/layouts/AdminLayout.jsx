import { Outlet } from 'react-router-dom';
import AdminSidebar from '../features/dashboard/components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
