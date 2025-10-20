const API_URL = "http://127.0.0.1:8000/api";

// Lấy danh sách blog (có thể kèm query: ?search=abc&sort=desc)
export async function getBlogs(query = "") {
  const res = await fetch(`${API_URL}/blogs?${query}`);
  if (!res.ok) throw new Error("Không thể tải danh sách blog");
  return res.json();
}

// Lấy chi tiết 1 blog theo ID
export async function getBlog(id) {
  const res = await fetch(`${API_URL}/blogs/${id}`);
  if (!res.ok) throw new Error("Không tìm thấy blog");
  return res.json();
}

// Tạo blog mới (FormData chứa tiêu đề, nội dung, hình ảnh,...)
export async function createBlog(formData, token) {
  const res = await fetch(`${API_URL}/blogs`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Không thể tạo blog");
  return res.json();
}

// Cập nhật blog (PUT hoặc POST kèm _method=PUT)
export async function updateBlog(id, formData, token) {
  // Nếu backend Laravel không nhận PUT với FormData, ta gửi POST + _method=PUT
  formData.append("_method", "PUT");
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Không thể cập nhật blog");
  return res.json();
}

// Xóa blog
export async function deleteBlog(id, token) {
  const res = await fetch(`${API_URL}/blogs/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không thể xóa blog");
  return res.json();
}