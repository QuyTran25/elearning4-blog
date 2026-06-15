import { useAuth } from '@/features/auth/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, <span className="font-semibold">{user?.name}</span>! 👋
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">BLOG POSTS</div>
          <div className="text-3xl font-bold text-gray-900">—</div>
          <p className="text-gray-600 text-sm mt-2">Total posts published</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">COMMENTS</div>
          <div className="text-3xl font-bold text-gray-900">—</div>
          <p className="text-gray-600 text-sm mt-2">Pending review</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium mb-2">MODERATION</div>
          <div className="text-3xl font-bold text-gray-900">—</div>
          <p className="text-gray-600 text-sm mt-2">AI classification stats</p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Welcome to Admin Portal</h3>
        <p className="text-blue-800 text-sm">
          Use the sidebar to manage blog posts, view comments, and monitor AI moderation logs.
        </p>
      </div>
    </div>
  );
}
