import { Link, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Portal</h2>
        <p className="text-gray-400 text-sm">Core Management</p>
      </div>

      <nav className="space-y-4">
        <Link
          to="/admin/dashboard"
          className="block px-4 py-2 rounded hover:bg-gray-800"
        >
          Post Management
        </Link>
        <Link
          to="/admin/posts/create"
          className="block px-4 py-2 rounded hover:bg-gray-800"
        >
          Create New Post
        </Link>
        <Link
          to="/admin/logs"
          className="block px-4 py-2 rounded hover:bg-gray-800"
        >
          Comment Logs
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-8 w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}
