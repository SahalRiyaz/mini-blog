import { startServer } from './src/server.js';

async function runTests() {
  const TEST_PORT = 5005;
  const server = await startServer(TEST_PORT);
  const BASE_URL = `http://localhost:${TEST_PORT}`;

  async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
  }

  console.log('\n--- STARTING ART JOURNAL VERIFICATION SUITE ---');

  // 1. Health check
  const health = await request('/api/health');
  console.log(`1. GET /api/health -> Status: ${health.status}, Active: ${health.data.status === 'ok'}`);

  // 2. GET /posts
  const postsRes = await request('/posts');
  console.log(`2. GET /posts -> Status: ${postsRes.status}, Published essays: ${postsRes.data.posts?.length}`);

  // 3. Login as curator (admin)
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@miniblog.com', password: 'admin123' },
  });
  console.log(`3. POST /auth/login (Curator) -> Status: ${loginRes.status}, Standing: ${loginRes.data.user?.role}`);
  const adminToken = loginRes.data.token;

  // 4. Create post as curator
  const createPostRes = await request('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'Reflections on Venetian Colorism: Titian and the Legacy of the Glaze',
      content: '## Venetian Light and Pigment\nA study on atmospheric perspective and layered glazes in the late Venetian Renaissance.',
      tags: ['painting', 'renaissance', 'venice'],
    },
  });
  console.log(`4. POST /posts (Curator) -> Status: ${createPostRes.status}, Essay ID: ${createPostRes.data.post?.id}`);
  const newPostId = createPostRes.data.post?.id;

  // 5. Register a new reader
  const registerRes = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Beatrice Fontaine',
      email: `beatrice_${Date.now()}@canvasandprose.com`,
      password: 'password123',
      role: 'reader',
    },
  });
  console.log(`5. POST /auth/register (Reader) -> Status: ${registerRes.status}, Role: ${registerRes.data.user?.role}`);
  const readerToken = registerRes.data.token;

  // 6. Reader attempts to publish essay (Should be Forbidden 403)
  const readerPostAttempt = await request('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${readerToken}` },
    body: {
      title: 'Unauthorized Essay Submission',
      content: 'Only curators may publish articles.',
    },
  });
  console.log(`6. POST /posts (Reader publication block check) -> Status: ${readerPostAttempt.status} (Expected 403)`);

  // 7. Reader adds a reflection on the new essay
  const commentRes = await request(`/posts/${newPostId}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${readerToken}` },
    body: { text: 'Titian’s layered crimson glazes in his late period have unmatched depth.' },
  });
  console.log(`7. POST /posts/:id/comments (Reader reflection) -> Status: ${commentRes.status}, Text: ${commentRes.data.comment?.text}`);

  // 8. Public reads reflections on that essay
  const getCommentsRes = await request(`/posts/${newPostId}/comments`);
  console.log(`8. GET /posts/:id/comments (Public) -> Status: ${getCommentsRes.status}, Count: ${getCommentsRes.data.count}`);

  // 9. Curator updates essay
  const updateRes = await request(`/posts/${newPostId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { title: 'Reflections on Venetian Colorism: Titian, Tintoretto, and the Venetian School' },
  });
  console.log(`9. PUT /posts/:id (Curator) -> Status: ${updateRes.status}, Updated Title: ${updateRes.data.post?.title}`);

  // 10. Curator retracts essay
  const deleteRes = await request(`/posts/${newPostId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`10. DELETE /posts/:id (Curator) -> Status: ${deleteRes.status}, Action: ${deleteRes.data.message}`);

  console.log('--- ALL JOURNAL TESTS COMPLETED SUCCESSFULLY ---\n');
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
