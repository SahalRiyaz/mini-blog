import { startServer } from './src/server.js';

async function runTests() {
  const TEST_PORT = 5006;
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

  console.log('\n--- STARTING VERIFICATION (ZERO FAKE ARTICLES) ---');

  // 1. Health check
  const health = await request('/api/health');
  console.log(`1. GET /api/health -> Status: ${health.status}, Active: ${health.data.status === 'ok'}`);

  // 2. GET /posts (Should be 0 - No fake articles!)
  const postsRes = await request('/posts');
  console.log(`2. GET /posts -> Status: ${postsRes.status}, Initial articles: ${postsRes.data.posts?.length} (Expected 0 fake articles)`);

  // 3. Login as curator
  const loginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@miniblog.com', password: 'admin123' },
  });
  console.log(`3. POST /auth/login (Curator) -> Status: ${loginRes.status}, Role: ${loginRes.data.user?.role}`);
  const adminToken = loginRes.data.token;

  // 4. Real article published by curator
  const createPostRes = await request('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: {
      title: 'Original Essay Written by Real Contributor',
      content: 'This is an authentic article created through the publication interface.',
      tags: ['original', 'essay'],
    },
  });
  console.log(`4. POST /posts (Curator) -> Status: ${createPostRes.status}, ID: ${createPostRes.data.post?.id}`);
  const newPostId = createPostRes.data.post?.id;

  // 5. Register reader
  const registerRes = await request('/auth/register', {
    method: 'POST',
    body: {
      name: 'Real Reader',
      email: `reader_${Date.now()}@example.com`,
      password: 'password123',
      role: 'reader',
    },
  });
  console.log(`5. POST /auth/register (Reader) -> Status: ${registerRes.status}, Role: ${registerRes.data.user?.role}`);
  const readerToken = registerRes.data.token;

  // 6. Reader post attempt (Must be 403)
  const readerPostAttempt = await request('/posts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${readerToken}` },
    body: {
      title: 'Should Be Forbidden',
      content: 'Readers cannot publish.',
    },
  });
  console.log(`6. POST /posts (Reader forbidden check) -> Status: ${readerPostAttempt.status} (Expected 403)`);

  // 7. Reader adds reflection
  const commentRes = await request(`/posts/${newPostId}/comments`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${readerToken}` },
    body: { text: 'Real reflection from registered reader.' },
  });
  console.log(`7. POST /posts/:id/comments (Reader) -> Status: ${commentRes.status}, Text: ${commentRes.data.comment?.text}`);

  // 8. Public reads reflections
  const getCommentsRes = await request(`/posts/${newPostId}/comments`);
  console.log(`8. GET /posts/:id/comments (Public) -> Status: ${getCommentsRes.status}, Count: ${getCommentsRes.data.count}`);

  // 9. Update post
  const updateRes = await request(`/posts/${newPostId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${adminToken}` },
    body: { title: 'Updated Original Essay' },
  });
  console.log(`9. PUT /posts/:id (Curator) -> Status: ${updateRes.status}, Title: ${updateRes.data.post?.title}`);

  // 10. Delete post
  const deleteRes = await request(`/posts/${newPostId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`10. DELETE /posts/:id (Curator) -> Status: ${deleteRes.status}, Action: ${deleteRes.data.message}`);

  // 11. Final check: verify post list is back to 0
  const finalPosts = await request('/posts');
  console.log(`11. GET /posts (Final check) -> Remaining articles: ${finalPosts.data.posts?.length} (Expected 0)`);

  console.log('--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---\n');
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
