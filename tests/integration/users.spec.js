const app = require('../../app');
const request = require('supertest');
let server;

beforeAll((done) => {
    server = app.listen(0, () => {
    // Server berjalan di port yang tersedia secara otomatis
      const address = server.address();
      console.log(`Server started on port ${address.port}`);
      done();
  });
});

afterAll((done) => {
    // Tutup server setelah pengujian selesai
    server.close(done);
});

describe('POST /api/v1/users endpoint', () => {
    test('create new user with a profile', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@mail.com',
            password: 'test1234',
            profile: {
                identityType: 'ID',
                identityNumber: '987654321',
                address: 'java 123',
            },
        };

        const response = (await request(app).post('/api/v1/users')).send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
    });

    test('handle errors when creating a user', async () => {
        const invalidUserData = {
            username: '',
            email: 'user@example.com',
            password: '111',
            profile: {
                identityType: 'Passport',
            }
        };

        const response = (await request(app).post('/api/v1/users')).send(invalidUserData);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });
});

describe('GET /api/v1/users/:id endpoint', () => {
    test('user details with a valid id', async () => {
        const validUserId = 1;
        const response = await request(app).get(`/api/v1/users/${validUserId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
    });

    test('handle erors when retrieving user details with an invalid id', async () => {
        const invalidUserId = 999999;
        const response = await request(app).get(`/api/v1/users/${invalidUserId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
});
