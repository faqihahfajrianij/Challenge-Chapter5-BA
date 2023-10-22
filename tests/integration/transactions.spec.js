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

describe('testing transactions /api/v1/transactions', () => {
    //Testing membuat transaksi baru
    test('create a new transaction', async () => {
      const transactionData = {
        sourceAccountId: 1,
        destinationAccountId: 3,
        amount: 10000, 
      };

      const response = await request(app).post('/api/v1/transactions').send(transactionData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Transaksi berhasil');
      createdTransactionId = response.body.id;
    });

    //Testing menampilkan daftar transaksi
    test('retrieve a list of transactions', async () => {
      const response = await request(app).get('/api/v1/transactions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('sourceAccountId');
      expect(transaction).toHaveProperty('destinationAccountId');
      expect(transaction).toHaveProperty('amount');
    });

    //Testing menampilkan detai transaksi
    test('retrieve transaction details by id', async () => {
      const response = await request(app).get(`/api/v1/transactions/${createdTransactionId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdTransactionId);
      expect(response.body).toHaveProperty('sourceAccountId');
      expect(response.body).toHaveProperty('destinationAccountId');
      expect(response.body).toHaveProperty('amount');    
    });

    //Testing menangani kesalahan saat mengambil transaksi yang tidak vald
    const invalidTransactionId = 999;
    test('handle errors when retrieving an transaction id', async () => {
      const response = await request(app).get(`/api/v1/transactions/${invalidTransactionId}`);

      expect(response.status).toBe(404); 
      expect(response.body).toHaveProperty('error');
    });
});
