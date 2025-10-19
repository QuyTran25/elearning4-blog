// Blog storage utilities
const BLOGS_KEY = "tech_blog_posts"

// Function to get the current user
function getCurrentUser() {
  // Placeholder for user retrieval logic
  return { id: "admin", fullName: "Admin" }
}

// Get all blogs
function getAllBlogs() {
  const blogs = localStorage.getItem(BLOGS_KEY)
  return blogs ? JSON.parse(blogs) : []
}

// Save blogs
function saveBlogs(blogs) {
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs))
}

// Get blog by ID
function getBlogById(id) {
  const blogs = getAllBlogs()
  return blogs.find((blog) => blog.id === id)
}

// Create blog
function createBlog(blogData) {
  const blogs = getAllBlogs()
  const user = getCurrentUser()

  const newBlog = {
    id: Date.now().toString(),
    title: blogData.title,
    category: blogData.category,
    content: blogData.content,
    image: blogData.image || null,
    author: {
      id: user.id,
      name: user.fullName,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  blogs.push(newBlog)
  saveBlogs(blogs)

  return newBlog
}

// Update blog
function updateBlog(id, blogData) {
  const blogs = getAllBlogs()
  const index = blogs.findIndex((blog) => blog.id === id)

  if (index === -1) {
    return null
  }

  blogs[index] = {
    ...blogs[index],
    title: blogData.title,
    category: blogData.category,
    content: blogData.content,
    image: blogData.image !== undefined ? blogData.image : blogs[index].image,
    updatedAt: new Date().toISOString(),
  }

  saveBlogs(blogs)
  return blogs[index]
}

// Delete blog
function deleteBlog(id) {
  const blogs = getAllBlogs()
  const filteredBlogs = blogs.filter((blog) => blog.id !== id)
  saveBlogs(filteredBlogs)
  return true
}

// Search blogs
function searchBlogs(query) {
  const blogs = getAllBlogs()
  const lowerQuery = query.toLowerCase()

  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery) ||
      blog.category.toLowerCase().includes(lowerQuery),
  )
}

// Sort blogs
function sortBlogs(blogs, sortBy) {
  const sorted = [...blogs]

  switch (sortBy) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted
  }
}

// Initialize with sample data if empty
function initializeSampleBlogs() {
  const blogs = getAllBlogs()

  if (blogs.length === 0) {
    const sampleBlogs = [
      {
        id: "1",
        title: "AI giúp nhận diện hình ảnh",
        category: "AI",
        content: `
          <h2>🤖 AI Nhận Diện Hình Ảnh - Công Nghệ Của Tương Lai</h2>
          <p>Trí tuệ nhân tạo trong nhận diện hình ảnh đang thay đổi cách chúng ta tương tác với công nghệ. Từ việc mở khóa điện thoại bằng khuôn mặt đến việc tự động phân loại hàng ngàn bức ảnh, AI đã trở nên không thể thiếu.</p>

          <h3>🎯 Ứng Dụng Trong Cuộc Sống</h3>
          <ul>
            <li><strong>Nhận diện khuôn mặt:</strong> Face ID trên iPhone, camera an ninh thông minh</li>
            <li><strong>Phân loại ảnh tự động:</strong> Google Photos tự động gắn thẻ người và địa điểm</li>
            <li><strong>Y tế:</strong> Phát hiện bệnh từ hình ảnh X-quang, MRI với độ chính xác cao</li>
            <li><strong>Xe tự lái:</strong> Tesla sử dụng AI để nhận diện đường, biển báo, người đi bộ</li>
            <li><strong>Bán lẻ:</strong> Amazon Go - cửa hàng không thu ngân nhờ AI nhận diện sản phẩm</li>
          </ul>

          <h3>⚙️ Công Nghệ Đằng Sau</h3>
          <p>AI nhận diện hình ảnh sử dụng <strong>Convolutional Neural Networks (CNN)</strong>, một loại mạng neural đặc biệt được thiết kế để xử lý dữ liệu hình ảnh.</p>

          <pre><code>import tensorflow as tf
from tensorflow.keras import layers, models

# Xây dựng model CNN đơn giản
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# Train model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10)</code></pre>

          <h3>🔍 Quy Trình Hoạt Động</h3>
          <ol>
            <li><strong>Thu thập dữ liệu:</strong> Hàng triệu hình ảnh được gắn nhãn</li>
            <li><strong>Tiền xử lý:</strong> Resize, normalize, augmentation</li>
            <li><strong>Huấn luyện:</strong> Model học cách nhận diện patterns từ dữ liệu</li>
            <li><strong>Kiểm thử:</strong> Đánh giá độ chính xác trên test set</li>
            <li><strong>Deploy:</strong> Tích hợp vào ứng dụng thực tế</li>
          </ol>

          <blockquote>
            "AI không thay thế con người trong việc nhận diện hình ảnh, mà giúp chúng ta làm điều đó nhanh hơn và chính xác hơn hàng triệu lần."
          </blockquote>

          <h3>💡 Thách Thức</h3>
          <ul>
            <li>Cần dataset lớn và đa dạng</li>
            <li>Computational cost cao khi training</li>
            <li>Bias trong dữ liệu huấn luyện</li>
            <li>Privacy concerns với facial recognition</li>
          </ul>

          <h3>🚀 Tương Lai</h3>
          <p>Công nghệ AI nhận diện hình ảnh sẽ tiếp tục phát triển với:</p>
          <ul>
            <li>Real-time processing trên thiết bị edge</li>
            <li>3D object recognition</li>
            <li>Video understanding và action recognition</li>
            <li>Few-shot learning - học với ít dữ liệu hơn</li>
          </ul>
        `,
        image: "image/AI.jpg",
        author: { id: "user1", name: "Minh Khoa" },
        createdAt: "2025-10-14T00:00:00.000Z",
        updatedAt: "2025-10-14T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Lộ trình học lập trình web",
        category: "Fullstack",
        content: `
          <h2>🎯 Lộ Trình Toàn Diện Trở Thành Fullstack Developer</h2>
          <p>Lập trình web fullstack là một trong những kỹ năng được săn đón nhất hiện nay. Để trở thành một fullstack developer giỏi, bạn cần có lộ trình học tập rõ ràng và kiên trì thực hành.</p>

          <h3>📚 Giai Đoạn 1: Frontend Cơ Bản (3-4 tháng)</h3>
          
          <h4>HTML & CSS</h4>
          <p>Nền tảng của mọi trang web:</p>
          <ul>
            <li>HTML5 semantic tags (header, nav, main, section, article)</li>
            <li>CSS Flexbox và Grid Layout</li>
            <li>Responsive Design với Media Queries</li>
            <li>CSS animations và transitions</li>
            <li>SASS/SCSS preprocessor</li>
          </ul>

          <h4>JavaScript ES6+</h4>
          <pre><code>// Modern JavaScript features
const greet = (name) => \`Hello, \${name}!\`;

// Destructuring
const { name, age } = user;
const [first, second] = array;

// Spread operator
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: 'value' };

// Async/Await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}</code></pre>

          <h3>⚛️ Giai Đoạn 2: React Framework (3-4 tháng)</h3>
          <p>React là framework frontend phổ biến nhất hiện nay:</p>
          <ul>
            <li>JSX và Components</li>
            <li>Props và State Management</li>
            <li>React Hooks (useState, useEffect, useContext)</li>
            <li>React Router cho navigation</li>
            <li>Redux hoặc Zustand cho state management</li>
          </ul>

          <pre><code>// React Component với Hooks
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }
    loadUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}</code></pre>

          <h3>🔧 Giai Đoạn 3: Backend với Node.js (4-5 tháng)</h3>
          <p>Xây dựng server và API:</p>
          <ul>
            <li>Node.js và NPM</li>
            <li>Express.js framework</li>
            <li>RESTful API design</li>
            <li>Authentication với JWT</li>
            <li>Database: MongoDB hoặc PostgreSQL</li>
          </ul>

          <pre><code>// Express.js API
const express = require('express');
const app = express();

app.use(express.json());

// GET endpoint
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST endpoint với validation
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  // Create user
  const user = await User.create({ name, email, password });
  res.status(201).json(user);
});

app.listen(3000, () => console.log('Server running'));</code></pre>

          <h3>🗄️ Giai Đoạn 4: Database (2-3 tháng)</h3>
          <ul>
            <li><strong>SQL:</strong> PostgreSQL, MySQL - cho dữ liệu có cấu trúc</li>
            <li><strong>NoSQL:</strong> MongoDB - cho dữ liệu linh hoạt</li>
            <li><strong>ORMs:</strong> Sequelize (SQL), Mongoose (MongoDB)</li>
            <li>Database design và normalization</li>
            <li>Indexing và query optimization</li>
          </ul>

          <h3>☁️ Giai Đoạn 5: DevOps Basics (2-3 tháng)</h3>
          <ul>
            <li><strong>Git & GitHub:</strong> Version control, branching, pull requests</li>
            <li><strong>Docker:</strong> Containerization</li>
            <li><strong>CI/CD:</strong> GitHub Actions, Jenkins</li>
            <li><strong>Cloud:</strong> Deploy lên AWS, Vercel, Heroku, DigitalOcean</li>
            <li><strong>Monitoring:</strong> Logging, error tracking</li>
          </ul>

          <blockquote>
            "Học lập trình không phải là sprint, mà là marathon. Kiên trì mỗi ngày, bạn sẽ đạt được mục tiêu!"
          </blockquote>

          <h3>💡 Tips Để Thành Công</h3>
          <ol>
            <li><strong>Code mỗi ngày:</strong> Ít nhất 2-3 tiếng</li>
            <li><strong>Build projects:</strong> Làm project thực tế, không chỉ tutorial</li>
            <li><strong>Tham gia cộng đồng:</strong> Discord, Reddit, Facebook groups</li>
            <li><strong>Đọc code người khác:</strong> GitHub, open source projects</li>
            <li><strong>Viết blog:</strong> Chia sẻ những gì học được</li>
            <li><strong>Networking:</strong> Kết nối với các developer khác</li>
          </ol>

          <h3>📖 Tài Nguyên Học Tập</h3>
          <ul>
            <li><strong>FreeCodeCamp:</strong> Khóa học miễn phí chất lượng</li>
            <li><strong>The Odin Project:</strong> Lộ trình fullstack hoàn chỉnh</li>
            <li><strong>MDN Web Docs:</strong> Tài liệu chính thống</li>
            <li><strong>YouTube:</strong> Traversy Media, Web Dev Simplified</li>
            <li><strong>Udemy:</strong> Các khóa học chuyên sâu</li>
          </ul>

          <p>Chúc bạn thành công trên con đường trở thành Fullstack Developer! 💪</p>
        `,
        image: "image/học fullstacsk.jpg",
        author: { id: "user2", name: "Bảo Trâm" },
        createdAt: "2025-10-10T00:00:00.000Z",
        updatedAt: "2025-10-10T00:00:00.000Z",
      },
      {
        id: "3",
        title: "5 mẹo code sạch cho người mới",
        category: "Coding",
        content: `
          <h2>✨ Clean Code - Viết Code Như Một Nghệ Sĩ</h2>
          <p>Code sạch không chỉ giúp bạn mà còn giúp cả team dễ đọc, dễ maintain và dễ mở rộng. Hãy cùng tìm hiểu 5 nguyên tắc cơ bản!</p>

          <h3>1️⃣ Đặt Tên Biến Rõ Ràng Và Có Ý Nghĩa</h3>
          <p>Tên biến nên thể hiện rõ mục đích và giá trị của nó:</p>

          <pre><code>// ❌ BAD - Tên biến không rõ ràng
const d = new Date();
const x = users.length;
const temp = calculate(a, b);

// ✅ GOOD - Tên biến mô tả rõ ràng
const currentDate = new Date();
const totalUsers = users.length;
const userAverageScore = calculate(scores, weights);</code></pre>

          <h3>2️⃣ Chia Nhỏ Functions - Single Responsibility</h3>
          <p>Mỗi function chỉ nên làm một việc duy nhất:</p>

          <pre><code>// ❌ BAD - Function làm quá nhiều việc
function processOrder(order) {
  // Validate
  if (!order.items || order.items.length === 0) return false;
  
  // Calculate
  let total = 0;
  order.items.forEach(item => total += item.price * item.quantity);
  
  // Apply discount
  if (order.coupon) total *= 0.9;
  
  // Save to database
  db.orders.insert(order);
  
  // Send email
  sendEmail(order.customerEmail, total);
  
  return total;
}

// ✅ GOOD - Chia nhỏ thành các functions riêng
function validateOrder(order) {
  return order.items && order.items.length > 0;
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyDiscount(total, coupon) {
  return coupon ? total * 0.9 : total;
}

function saveOrder(order) {
  return db.orders.insert(order);
}

function sendOrderConfirmation(email, total) {
  return sendEmail(email, total);
}

// Main function chỉ orchestrate
function processOrder(order) {
  if (!validateOrder(order)) return false;
  
  let total = calculateTotal(order.items);
  total = applyDiscount(total, order.coupon);
  
  saveOrder(order);
  sendOrderConfirmation(order.customerEmail, total);
  
  return total;
}</code></pre>

          <h3>3️⃣ Comment Hợp Lý - Giải Thích "Tại Sao", Không Phải "Cái Gì"</h3>
          <p>Code tốt tự document chính nó. Comment chỉ nên giải thích logic phức tạp:</p>

          <pre><code>// ❌ BAD - Comment rõ ràng không cần thiết
// Tăng i lên 1
i = i + 1;

// Lặp qua mảng users
for (let user of users) {
  // In tên user
  console.log(user.name);
}

// ✅ GOOD - Giải thích lý do
// Skip first row because it's the CSV header
for (let i = 1; i < data.length; i++) {
  processDataRow(data[i]);
}

// Use exponential backoff to avoid rate limiting from API
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      const delay = Math.pow(2, i) * 1000;
      await sleep(delay);
    }
  }
}</code></pre>

          <h3>4️⃣ DRY - Don't Repeat Yourself</h3>
          <p>Tránh duplicate code bằng cách tạo reusable functions:</p>

          <pre><code>// ❌ BAD - Duplicate code
function validateUsername(username) {
  if (!username) return false;
  if (username.length < 3) return false;
  if (username.length > 20) return false;
  return /^[a-zA-Z0-9_]+$/.test(username);
}

function validateEmail(email) {
  if (!email) return false;
  if (email.length < 5) return false;
  if (email.length > 100) return false;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

// ✅ GOOD - Reusable validation
function validateField(value, minLength, maxLength, pattern) {
  if (!value) return false;
  if (value.length < minLength || value.length > maxLength) return false;
  return pattern.test(value);
}

function validateUsername(username) {
  return validateField(username, 3, 20, /^[a-zA-Z0-9_]+$/);
}

function validateEmail(email) {
  return validateField(email, 5, 100, /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/);
}</code></pre>

          <h3>5️⃣ Viết Tests - Code Có Thể Tin Cậy</h3>
          <p>Tests giúp bạn tự tin refactor và phát hiện bugs sớm:</p>

          <pre><code>// Unit test với Jest
describe('calculateTotal', () => {
  test('should calculate total of items correctly', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 20, quantity: 1 },
      { price: 5, quantity: 3 }
    ];
    expect(calculateTotal(items)).toBe(55); // 10*2 + 20*1 + 5*3
  });

  test('should return 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('should handle items with zero quantity', () => {
    const items = [
      { price: 10, quantity: 0 },
      { price: 20, quantity: 1 }
    ];
    expect(calculateTotal(items)).toBe(20);
  });
});</code></pre>

          <blockquote>
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler
          </blockquote>

          <h3>🎯 Lợi Ích Của Clean Code</h3>
          <ul>
            <li><strong>Dễ maintain:</strong> Sửa bugs và thêm features nhanh hơn</li>
            <li><strong>Ít bugs:</strong> Code rõ ràng giảm lỗi logic</li>
            <li><strong>Team work tốt:</strong> Đồng đội dễ hiểu code của bạn</li>
            <li><strong>Onboard nhanh:</strong> Người mới dễ tiếp cận codebase</li>
            <li><strong>Refactor an toàn:</strong> Có tests để đảm bảo không break</li>
          </ul>

          <h3>📚 Tài Liệu Tham Khảo</h3>
          <ul>
            <li>"Clean Code" by Robert C. Martin</li>
            <li>"The Pragmatic Programmer" by Andy Hunt</li>
            <li>"Refactoring" by Martin Fowler</li>
          </ul>

          <p>Hãy bắt đầu áp dụng những nguyên tắc này vào code của bạn từ hôm nay! 💪</p>
        `,
        image: "image/mã code.jpg",
        author: { id: "user3", name: "Hữu Phước" },
        createdAt: "2025-10-05T00:00:00.000Z",
        updatedAt: "2025-10-05T00:00:00.000Z",
      },
      {
        id: "4",
        title: "Internet of Things là gì?",
        category: "Network",
        content: `
          <h2>🌐 IoT - Kết Nối Vạn Vật Trên Internet</h2>
          <p>Internet of Things (IoT) là mạng lưới các thiết bị vật lý được kết nối internet, có khả năng thu thập và chia sẻ dữ liệu. IoT đang thay đổi cách chúng ta sống và làm việc.</p>

          <h3>🏠 IoT Trong Smart Home</h3>
          <p>Ngôi nhà thông minh với các thiết bị IoT:</p>
          <ul>
            <li><strong>Đèn thông minh:</strong> Điều khiển từ xa, tự động bật/tắt theo lịch hoặc cảm biến</li>
            <li><strong>Thermostat:</strong> Nest, Ecobee tự điều chỉnh nhiệt độ tiết kiệm điện</li>
            <li><strong>Camera an ninh:</strong> Ring, Arlo - xem real-time, nhận thông báo chuyển động</li>
            <li><strong>Khóa cửa thông minh:</strong> August, Yale - mở khóa bằng smartphone, vân tay</li>
            <li><strong>Loa thông minh:</strong> Alexa, Google Home - điều khiển giọng nói</li>
            <li><strong>Tủ lạnh thông minh:</strong> Samsung Family Hub - quản lý thực phẩm, đặt hàng online</li>
          </ul>

          <h3>🏭 IoT Trong Công Nghiệp 4.0</h3>
          <p>Industrial IoT (IIoT) đang cách mạng hóa sản xuất:</p>
          <ul>
            <li><strong>Predictive Maintenance:</strong> Sensors phát hiện dấu hiệu hỏng hóc trước khi xảy ra</li>
            <li><strong>Supply Chain Management:</strong> Theo dõi real-time vị trí và tình trạng hàng hóa</li>
            <li><strong>Quality Control:</strong> AI + IoT kiểm tra chất lượng sản phẩm tự động</li>
            <li><strong>Energy Management:</strong> Tối ưu hóa tiêu thụ năng lượng nhà máy</li>
            <li><strong>Worker Safety:</strong> Wearables theo dõi sức khỏe và vị trí công nhân</li>
          </ul>

          <h3>⚙️ Kiến Trúc IoT</h3>
          <p>Một hệ thống IoT điển hình gồm 4 layers:</p>

          <ol>
            <li><strong>Device Layer:</strong> Sensors, actuators thu thập dữ liệu</li>
            <li><strong>Network Layer:</strong> WiFi, Bluetooth, LoRaWAN, 5G truyền dữ liệu</li>
            <li><strong>Platform Layer:</strong> Cloud xử lý, lưu trữ dữ liệu (AWS IoT, Azure IoT Hub)</li>
            <li><strong>Application Layer:</strong> Mobile app, web dashboard hiển thị và điều khiển</li>
          </ol>

          <h3>💻 Lập Trình IoT</h3>
          <p>Example với MQTT protocol - chuẩn messaging cho IoT:</p>

          <pre><code>// Node.js với MQTT
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to temperature sensor topic
  client.subscribe('home/living-room/temperature');
  
  // Publish command to turn on light
  client.publish('home/living-room/light', JSON.stringify({
    status: 'on',
    brightness: 80,
    color: 'warm-white'
  }));
});

// Handle incoming messages
client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log(\`\${topic}: \${data.value}°C\`);
  
  // Auto control: Turn on AC if temperature > 28°C
  if (data.value > 28) {
    client.publish('home/living-room/ac', JSON.stringify({
      status: 'on',
      temperature: 25
    }));
  }
});</code></pre>

          <h3>🔐 Bảo Mật IoT</h3>
          <p>IoT devices thường là target của hackers. Các biện pháp bảo mật:</p>
          <ul>
            <li><strong>Authentication:</strong> Xác thực thiết bị trước khi kết nối</li>
            <li><strong>Encryption:</strong> Mã hóa dữ liệu với TLS/SSL</li>
            <li><strong>Firmware Updates:</strong> Cập nhật bảo mật thường xuyên</li>
            <li><strong>Network Segmentation:</strong> Tách IoT devices ra subnet riêng</li>
            <li><strong>Monitoring:</strong> Phát hiện hành vi bất thường</li>
          </ul>

          <pre><code>// Security best practices
// 1. Use environment variables for credentials
const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: 'mqtts', // Use TLS
  port: 8883
};

// 2. Validate all incoming data
function validateSensorData(data) {
  if (typeof data.value !== 'number') return false;
  if (data.value < -50 || data.value > 100) return false; // Range check
  return true;
}

// 3. Rate limiting
let lastMessageTime = 0;
const MIN_INTERVAL = 1000; // 1 second

client.on('message', (topic, message) => {
  const now = Date.now();
  if (now - lastMessageTime < MIN_INTERVAL) {
    console.log('Rate limit exceeded');
    return;
  }
  lastMessageTime = now;
  
  // Process message...
});</code></pre>

          <blockquote>
            "By 2030, there will be over 125 billion IoT devices worldwide, transforming every aspect of our lives."
          </blockquote>

          <h3>🚀 Xu Hướng Tương Lai</h3>
          <ul>
            <li><strong>5G Networks:</strong> Tốc độ cao, độ trễ thấp cho IoT</li>
            <li><strong>Edge Computing:</strong> Xử lý dữ liệu ngay tại thiết bị, giảm latency</li>
            <li><strong>AI Integration:</strong> IoT + AI = AIoT - thiết bị tự học và tối ưu</li>
            <li><strong>Digital Twins:</strong> Mô phỏng số hóa của đối tượng vật lý</li>
            <li><strong>Blockchain:</strong> Bảo mật giao dịch giữa các IoT devices</li>
          </ul>

          <h3>💡 Bắt Đầu Với IoT</h3>
          <p>Hardware phổ biến cho beginners:</p>
          <ul>
            <li><strong>Arduino:</strong> Dễ học, nhiều tutorials, giá rẻ (~200k VNĐ)</li>
            <li><strong>Raspberry Pi:</strong> Mạnh hơn, chạy Linux, phù hợp projects phức tạp</li>
            <li><strong>ESP32/ESP8266:</strong> WiFi built-in, rất phổ biến cho IoT (~50k VNĐ)</li>
            <li><strong>Sensors:</strong> DHT11 (nhiệt độ), HC-SR04 (khoảng cách), MQ-2 (khí gas)</li>
          </ul>

          <h3>📚 Học IoT</h3>
          <ul>
            <li><strong>Courses:</strong> Coursera - Introduction to IoT</li>
            <li><strong>Books:</strong> "Getting Started with IoT" by Cuno Pfister</li>
            <li><strong>Communities:</strong> Arduino Forum, Raspberry Pi Forum</li>
            <li><strong>Projects:</strong> Hackster.io, Instructables</li>
          </ul>

          <p>Hãy bắt đầu dự án IoT đầu tiên của bạn ngay hôm nay! 🔧</p>
        `,
        image: "image/mạng toàn cầu.jpg",
        author: { id: "user4", name: "Thanh Tùng" },
        createdAt: "2025-10-01T00:00:00.000Z",
        updatedAt: "2025-10-01T00:00:00.000Z",
      },
      {
        id: "5",
        title: "Machine Learning cơ bản",
        category: "AI",
        content: `
          <h2>🧠 Machine Learning - Dạy Máy Tính Tự Học</h2>
          <p>Machine Learning (ML) là nhánh của AI cho phép máy tính học từ dữ liệu và cải thiện performance mà không cần lập trình cụ thể từng bước.</p>

          <h3>📊 3 Loại Machine Learning</h3>
          
          <h4>1. Supervised Learning (Học Có Giám Sát)</h4>
          <p>Model học từ dữ liệu đã được gắn nhãn:</p>
          <ul>
            <li><strong>Classification:</strong> Phân loại email spam/không spam, nhận diện chữ số viết tay</li>
            <li><strong>Regression:</strong> Dự đoán giá nhà, giá cổ phiếu, nhiệt độ</li>
          </ul>

          <pre><code>from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Sample data: House prices prediction
# Features: [size_sqft, bedrooms, age]
X = np.array([
    [1000, 2, 10],
    [1500, 3, 5],
    [2000, 3, 8],
    [2500, 4, 2],
    [3000, 4, 15]
])
y = np.array([200000, 300000, 350000, 450000, 400000])

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse}')
print(f'R² Score: {r2}')

# Predict new house
new_house = np.array([[1800, 3, 7]])
predicted_price = model.predict(new_house)
print(f'Predicted price: ${predicted_price[0]:,.0f}')</code></pre>

          <h4>2. Unsupervised Learning (Học Không Giám Sát)</h4>
          <p>Tìm patterns trong dữ liệu không có nhãn:</p>
          <ul>
            <li><strong>Clustering:</strong> Phân nhóm khách hàng (customer segmentation)</li>
            <li><strong>Dimensionality Reduction:</strong> PCA, t-SNE giảm số chiều dữ liệu</li>
            <li><strong>Anomaly Detection:</strong> Phát hiện giao dịch gian lận</li>
          </ul>

          <pre><code>from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# Customer segmentation example
# Features: [monthly_spending, visit_frequency]
customers = np.array([
    [100, 2], [120, 3], [150, 2],  # Low spenders
    [500, 8], [450, 10], [550, 9], # High spenders
    [250, 5], [280, 6], [300, 5]   # Medium spenders
])

# K-Means clustering
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(customers)

# Visualize
plt.scatter(customers[:, 0], customers[:, 1], c=clusters, cmap='viridis')
plt.scatter(kmeans.cluster_centers_[:, 0], 
           kmeans.cluster_centers_[:, 1], 
           s=300, c='red', marker='X')
plt.xlabel('Monthly Spending ($)')
plt.ylabel('Visit Frequency')
plt.title('Customer Segmentation')
plt.show()</code></pre>

          <h4>3. Reinforcement Learning (Học Tăng Cường)</h4>
          <p>Agent học cách hành động trong môi trường để maximize reward:</p>
          <ul>
            <li><strong>Game AI:</strong> AlphaGo, OpenAI Five chơi game ở level pro</li>
            <li><strong>Robotics:</strong> Robot tự học đi, nắm vật</li>
            <li><strong>Self-driving:</strong> Xe tự lái học điều khiển từ kinh nghiệm</li>
          </ul>

          <h3>🛠️ Quy Trình ML Project</h3>
          <ol>
            <li><strong>Define Problem:</strong> Xác định vấn đề cần giải quyết</li>
            <li><strong>Collect Data:</strong> Kaggle, APIs, web scraping</li>
            <li><strong>Explore Data:</strong> Visualize, statistics, understand distributions</li>
            <li><strong>Clean Data:</strong> Handle missing values, outliers, duplicates</li>
            <li><strong>Feature Engineering:</strong> Tạo features mới, scaling, encoding</li>
            <li><strong>Select Model:</strong> Thử nhiều algorithms, so sánh performance</li>
            <li><strong>Train Model:</strong> Fit model với training data</li>
            <li><strong>Evaluate:</strong> Test accuracy, precision, recall, F1-score</li>
            <li><strong>Tune Hyperparameters:</strong> Grid search, random search</li>
            <li><strong>Deploy:</strong> API, web app, mobile app</li>
          </ol>

          <h3>📚 Thuật Toán Phổ Biến</h3>
          <table>
            <tr>
              <th>Algorithm</th>
              <th>Use Case</th>
              <th>Pros</th>
              <th>Cons</th>
            </tr>
            <tr>
              <td>Linear Regression</td>
              <td>Dự đoán giá trị liên tục</td>
              <td>Đơn giản, nhanh</td>
              <td>Chỉ với linear relationships</td>
            </tr>
            <tr>
              <td>Logistic Regression</td>
              <td>Binary classification</td>
              <td>Dễ interpret</td>
              <td>Không tốt với non-linear</td>
            </tr>
            <tr>
              <td>Decision Trees</td>
              <td>Classification, Regression</td>
              <td>Dễ visualize</td>
              <td>Dễ overfit</td>
            </tr>
            <tr>
              <td>Random Forest</td>
              <td>Classification, Regression</td>
              <td>Accurate, robust</td>
              <td>Slow, khó interpret</td>
            </tr>
            <tr>
              <td>SVM</td>
              <td>Classification</td>
              <td>Tốt với high-dimensional</td>
              <td>Slow với large dataset</td>
            </tr>
            <tr>
              <td>Neural Networks</td>
              <td>Complex patterns</td>
              <td>Rất powerful</td>
              <td>Cần nhiều data, slow train</td>
            </tr>
          </table>

          <h3>💼 Ứng Dụng Thực Tế</h3>
          <ul>
            <li><strong>Netflix:</strong> Recommendation systems gợi ý phim</li>
            <li><strong>Google:</strong> Search ranking, Google Translate, Gmail spam filter</li>
            <li><strong>Tesla:</strong> Autopilot self-driving cars</li>
            <li><strong>Banks:</strong> Credit scoring, fraud detection</li>
            <li><strong>Healthcare:</strong> Disease prediction, drug discovery</li>
            <li><strong>E-commerce:</strong> Product recommendations, dynamic pricing</li>
          </ul>

          <blockquote>
            "Machine Learning is the science of getting computers to learn without being explicitly programmed." - Andrew Ng
          </blockquote>

          <h3>🎓 Roadmap Học ML</h3>
          <ol>
            <li><strong>Prerequisites (1-2 tháng)</strong>
              <ul>
                <li>Python basics</li>
                <li>NumPy, Pandas</li>
                <li>Matplotlib, Seaborn</li>
                <li>Toán: Linear Algebra, Calculus, Statistics</li>
              </ul>
            </li>
            <li><strong>Core ML (3-4 tháng)</strong>
              <ul>
                <li>Supervised Learning algorithms</li>
                <li>Unsupervised Learning</li>
                <li>Model evaluation metrics</li>
                <li>Scikit-learn library</li>
              </ul>
            </li>
            <li><strong>Deep Learning (3-4 tháng)</strong>
              <ul>
                <li>Neural Networks basics</li>
                <li>CNNs cho Computer Vision</li>
                <li>RNNs, LSTMs cho NLP</li>
                <li>TensorFlow hoặc PyTorch</li>
              </ul>
            </li>
            <li><strong>MLOps (2-3 tháng)</strong>
              <ul>
                <li>Model deployment</li>
                <li>CI/CD for ML</li>
                <li>Monitoring và retraining</li>
              </ul>
            </li>
          </ol>

          <h3>📖 Tài Nguyên Học ML</h3>
          <ul>
            <li><strong>Courses:</strong> Andrew Ng's ML course (Coursera), Fast.ai</li>
            <li><strong>Books:</strong> "Hands-On Machine Learning" by Aurélien Géron</li>
            <li><strong>Practice:</strong> Kaggle competitions, Google Colab notebooks</li>
            <li><strong>Communities:</strong> Reddit r/MachineLearning, Kaggle forums</li>
          </ul>

          <p>Bắt đầu hành trình Machine Learning của bạn ngay hôm nay! 🚀</p>
        `,
        image: "image/AI.jpg",
        author: { id: "user5", name: "Đức Anh" },
        createdAt: "2025-10-08T00:00:00.000Z",
        updatedAt: "2025-10-08T00:00:00.000Z",
      },
      {
        id: "6",
        title: "Node.js và Express cho backend",
        category: "Fullstack",
        content: `
          <h2>🚀 Node.js & Express - JavaScript Everywhere</h2>
          <p>Node.js cho phép chạy JavaScript ở backend, mở ra khả năng fullstack development với cùng một ngôn ngữ. Express.js là framework minimal và linh hoạt nhất cho Node.js.</p>

          <h3>⚡ Tại Sao Chọn Node.js?</h3>
          <ul>
            <li><strong>Non-blocking I/O:</strong> Xử lý hàng ngàn requests đồng thời</li>
            <li><strong>JavaScript Everywhere:</strong> Cùng ngôn ngữ frontend-backend</li>
            <li><strong>NPM:</strong> 2+ triệu packages, largest ecosystem</li>
            <li><strong>Performance:</strong> V8 engine của Chrome, nhanh và efficient</li>
            <li><strong>Scalability:</strong> Dễ scale horizontally</li>
            <li><strong>Real-time:</strong> Hoàn hảo cho WebSocket, chat apps</li>
          </ul>

          <h3>🔧 Express.js Basics</h3>
          <p>Express là unopinionated framework - linh hoạt nhưng cần structure tốt:</p>

          <pre><code>// Basic Express server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API!' });
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId, name: 'John Doe' });
});

// POST route
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  // Save to database...
  res.status(201).json({ 
    message: 'User created',
    user: { name, email }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\\\`Server running on http://localhost:\\\${PORT}\\\`);
});</code></pre>

          <h3>🗄️ Kết Nối Database</h3>
          
          <h4>MongoDB với Mongoose</h4>
          <pre><code>const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  },
  age: {
    type: Number,
    min: 0,
    max: 120
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Model
const User = mongoose.model('User', userSchema);

// CRUD Operations
// Create
const newUser = new User({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25
});
await newUser.save();

// Read
const users = await User.find({ age: { $gte: 18 } }); // Users >= 18
const user = await User.findById(userId);
const user2 = await User.findOne({ email: 'john@example.com' });

// Update
await User.updateOne(
  { email: 'john@example.com' },
  { $set: { age: 26 } }
);

// Delete
await User.deleteOne({ _id: userId });</code></pre>

          <h3>🔐 Authentication với JWT</h3>
          <p>JSON Web Tokens cho stateless authentication:</p>

          <pre><code>const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});</code></pre>

          <h3>🛡️ Error Handling & Validation</h3>
          <pre><code>// Input validation với Joi
const Joi = require('joi');

const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  age: Joi.number().min(0).max(120)
});

app.post('/api/users', async (req, res) => {
  // Validate input
  const { error, value } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  // Process validated data
  // ...
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});</code></pre>

          <h3>⚙️ Best Practices</h3>
          <ul>
            <li><strong>Environment Variables:</strong> Dùng dotenv, không commit .env</li>
            <li><strong>Security:</strong> helmet.js, rate limiting, input validation</li>
            <li><strong>CORS:</strong> Configure đúng origins</li>
            <li><strong>Logging:</strong> Winston, Morgan cho production</li>
            <li><strong>Error Handling:</strong> Try-catch, global error middleware</li>
            <li><strong>Database:</strong> Connection pooling, indexes</li>
            <li><strong>Testing:</strong> Jest, Supertest</li>
            <li><strong>Documentation:</strong> Swagger/OpenAPI</li>
          </ul>

          <pre><code>// Security setup
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Helmet for security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));</code></pre>

          <blockquote>
            "Node.js enables JavaScript everywhere, making full-stack development seamless and efficient."
          </blockquote>

          <h3>🚀 Deploy</h3>
          <p>Các platform để deploy Node.js app:</p>
          <ul>
            <li><strong>Heroku:</strong> Free tier, dễ deploy với Git</li>
            <li><strong>Vercel:</strong> Tối ưu cho serverless functions</li>
            <li><strong>Railway:</strong> Modern alternative cho Heroku</li>
            <li><strong>AWS:</strong> EC2, Lambda, Elastic Beanstalk</li>
            <li><strong>DigitalOcean:</strong> App Platform, Droplets (VPS)</li>
            <li><strong>Render:</strong> Free tier, auto-deploy từ GitHub</li>
          </ul>

          <h3>📚 Tài Nguyên Học Tập</h3>
          <ul>
            <li><strong>Docs:</strong> expressjs.com, nodejs.org/docs</li>
            <li><strong>Courses:</strong> Node.js - The Complete Guide (Udemy)</li>
            <li><strong>Books:</strong> "Node.js Design Patterns"</li>
            <li><strong>GitHub:</strong> Study popular repos, contribute to open source</li>
          </ul>

          <p>Bắt đầu xây dựng API đầu tiên của bạn với Node.js và Express ngay hôm nay! 💪</p>
        `,
        image: "image/học fullstacsk.jpg",
        author: { id: "user6", name: "Quang Huy" },
        createdAt: "2025-10-03T00:00:00.000Z",
        updatedAt: "2025-10-03T00:00:00.000Z",
      },
    ]

    saveBlogs(sampleBlogs)
  }
}
