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

describe('testing account /api/v1/accounts endpoint', () => {

    //Testing membuat akun baru
    test('create new account', async () => {
        const accountData = {
            userId: 1,
            accountName: 'My Bank Account',
        };

        const response = (await request(app).post('api/v1/accounts')).send(accountData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        createAccountId = response.body.id;
    });

    //Testing menampilkan daftar akun
    test('retrieve a list of accounts', async () => {
        const response = await request(app).get('/api/v1/accounts');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        const accounts = response.body;
        for (const account of accounts) {
            expect(account).toHaveProperty('id');
            expect(account).toHaveProperty('bank_name');
            expect(account).toHaveProperty('bank_account_number');
            expect(account).toHaveProperty('balance');
            expect(account).toHaveProperty('user_id');
        }
    });

    //Testing menampilkan detai akun
    test('retrieve account details by id', async () => {
        const response = await request(app).get(`/api/v1/accounts/${createAccountId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createAccountId); 
        expect(response.body.accountName).toBe('My Bank Account'); 
        expect(response.body.userId).toBe(1);
    });

    //Testing menangani kesalahan saat mengambil akun yang tidak valid
    test('handle errors when retrieving an invalid account id', async () => {
        const response = await request(app).get(`/api/v1/accounts/${createAccountId}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');    
    });
});

