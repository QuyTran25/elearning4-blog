
    const postForm = document.getElementById("postForm");
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Bài viết đã được đăng thành công!");
      window.location.href = "index.html";
    });



  const form = document.getElementById("postForm");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const contentTextarea = document.getElementById("content");
  const fileInput = document.getElementById("image");

  // Lấy danh sách bài viết và ID bài đang sửa
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  const editPostId = localStorage.getItem("editPostId");

  // Nếu có ID bài cần sửa → điền sẵn form
  if (editPostId) {
    const postToEdit = posts.find(p => p.id === editPostId);
    if (postToEdit) {
      document.querySelector(".topbar h1").textContent = "Chỉnh sửa bài viết";
      titleInput.value = postToEdit.title;
      categorySelect.value = postToEdit.category;
      contentTextarea.value = postToEdit.content;
    }
  }

  // Xử lý khi submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categorySelect.value;
    const content = contentTextarea.value.trim();

    if (!title || !category || !content) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Nếu đang sửa
    if (editPostId) {
      posts = posts.map(p =>
        p.id === editPostId ? { ...p, title, category, content } : p
      );
      localStorage.removeItem("editPostId");
      alert("Bài viết đã được cập nhật!");
    } else {
      // Tạo bài mới
      const newPost = {
        id: Date.now().toString(),
        title,
        category,
        content,
      };
      posts.push(newPost);
      alert("Đã đăng bài mới!");
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    window.location.href = "index.html";
  });
