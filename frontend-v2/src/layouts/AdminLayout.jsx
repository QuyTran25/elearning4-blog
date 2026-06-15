import { Outlet } from 'react-router-dom';
import AdminSidebar from '../features/dashboard/components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex-1 bg-[#F8FAFC]">
        <Outlet />
      </main>
    </div>
  );
}
