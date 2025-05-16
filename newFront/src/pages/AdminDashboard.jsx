import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const AdminDashboard = () => {
  const { user, getAuthHeader, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Fetch analytics and posts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [analyticsRes, postsRes] = await Promise.all([
          axios.get(`${API_URL}/posts/admin/analytics`, {
            headers: getAuthHeader(),
          }),
          axios.get(`${API_URL}/posts/admin/posts`, {
            headers: getAuthHeader(),
          }),
        ]);
        setAnalytics(analyticsRes.data.data);
        setPosts(postsRes.data.data.posts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "admin") fetchData();
  }, [user, getAuthHeader]);

  // Delete post handler
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(postId);
    try {
      await axios.delete(`${API_URL}/posts/admin/posts/${postId}`, {
        headers: getAuthHeader(),
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast({ title: "Post deleted" });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="text-center py-12">Loading admin dashboard...</div>
      </MainLayout>
    );
  }
  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 py-12">{error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-0 md:gap-8 max-w-7xl mx-auto py-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="p-6 flex flex-col items-center">
              <div className="text-2xl font-semibold">
                {analytics?.userCount ?? "-"}
              </div>
              <div className="text-gray-600">Total Users</div>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <div className="text-2xl font-semibold">
                {analytics?.postCount ?? "-"}
              </div>
              <div className="text-gray-600">Total Posts</div>
            </Card>
          </div>
          {/* Posts Table */}
          <div className="bg-background rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">All Posts</h2>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td>{post.title || post.caption || "-"}</td>
                      <td>{post.author?.username || "-"}</td>
                      <td>{new Date(post.createdAt).toLocaleString()}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post._id)}
                          disabled={deletingId === post._id}
                        >
                          {deletingId === post._id ? "Deleting..." : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-500 py-8"
                      >
                        No posts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
