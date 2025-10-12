  //-- Script load dữ liệu -->

    document.addEventListener("DOMContentLoaded", () => {
      const img = document.getElementById("detail-image");
      const title = document.getElementById("detail-title");
      const body = document.getElementById("detail-body");
      const meta = document.getElementById("detail-meta");
      const imageInput = document.getElementById("imageInput");

      // Load dữ liệu từ localStorage
      img.src = localStorage.getItem("postImage") || "";
      title.textContent = localStorage.getItem("postTitle") || "Không tìm thấy tiêu đề";
      body.textContent = localStorage.getItem("postContent") || "Chưa có nội dung";
      meta.textContent = localStorage.getItem("postMeta") || "";

      // --- SỬA BÀI VIẾT ---
      document.getElementById("editBtn").addEventListener("click", () => {
        const newTitle = prompt("Nhập tiêu đề mới:", title.textContent);
        const newContent = prompt("Nhập nội dung mới:", body.textContent);

        // Cho phép chọn ảnh mới
        if (confirm("Bạn có muốn thay đổi ảnh bài viết không?")) {
          imageInput.click();
          imageInput.onchange = () => {
            const file = imageInput.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                img.src = e.target.result;
                localStorage.setItem("postImage", e.target.result);
              };
              reader.readAsDataURL(file);
            }
          };
        }

        if (newTitle && newContent) {
          title.textContent = newTitle;
          body.textContent = newContent;

          localStorage.setItem("postTitle", newTitle);
          localStorage.setItem("postContent", newContent);

          alert("Bài viết đã được cập nhật!");
        }
      });

      // --- XÓA BÀI VIẾT ---
      document.getElementById("deleteBtn").addEventListener("click", () => {
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
          localStorage.removeItem("postImage");
          localStorage.removeItem("postTitle");
          localStorage.removeItem("postContent");
          localStorage.removeItem("postMeta");
          alert("Bài viết đã được xóa!");
          window.location.href = "index.html";
        }
      });
    });
