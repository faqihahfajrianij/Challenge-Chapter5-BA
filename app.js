const express = require("express"); //Mengimpor modul Express.js
const prisma = require("./prismaClient"); //Mengimpor modul prismaClient

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//POST /api/v1/users : menambahkan user baru beserta profilnya.
app.post("/api/v1/users", async(req, res) =>{
    try{
        const {username, email, password} = req.body;

        const newUser = await prisma.users.create({
            data: {
                username, email, password,
            profile: {
            create: {
                identityType, identityNumber, address
            }
            }
            },
        });
    res.status(201).json(newUser);
    } catch (error){
        console.error("Gagal menambahkan user:", error);
        res.status(500).json({error: "Terjadi kesalahan saat menambahkan user"});
    }
});

//GET /api/v1/users : menampilkan daftar users.
app.get("/api/v1/users", async(req, res) =>{
    try{
        const users = await prisma.users.findMany(); //Mengambil semua data pengguna mengggunakan prisma
        res.json(users); //Mengirim data pengguna sebagai respon JSON
    } catch(error){
        console.error("Gagal mengambil daftar pengguna:", error);
        res.status(500).json({error: "Terjadi kesalahan"});
    }
});

//GET /api/v1/users/:userId : menampilkan detail informasi user (tampilkan juga profilnya)
app.get("/api/v1/users/:userId", async(req, res) => {
    try{
        const{userId} = req.params;

        const user = await prisma.users.findUnique({
            where: {id: parseInt(userId)}, 
            include: {profile: true},
        });
        if(!user){
            return res.status(404).json({error: "User tidak ditemukan"})
        }
        res.json(user);
    } catch(error){
        console.error("Gagal mengambil informasi user:", error);
        res.status(500).json({error:"Terjadi kesalahan"});
    }
});

//POST /api/v1/accounts : menambahkan akun baru ke user yang sudah didaftarkan.
app.post("api/v1/accounts", async(req, res) =>{
    try{
        const{userId, accountName} = req.body;

        //Menambahkan akub baru ke user menggunakan prisma
        const newAccount = await prisma.account.create({
            data: {
                name: accountName,
                userId: parseInt(userId),
            },
        });
        res.status(201).json(newAccount);
    }catch(error){
        console.error("Gagal menambahkan akun baru:", error);
        res.status(500).json({error:"Terjadi kesalahan"})
    }
});

//GET /api/v1/accounts: menampilkan daftar akun.
app.get("/api/v1/accounts", async(req, res) =>{
    try{
        const accounts = await prisma.accounts.findMany(); //Mengambil semua data akun dari database mengggunakan prisma
        res.json(accounts); //Mengirim data pengguna sebagai respon JSON
    } catch(error){
        console.error("Gagal mengambil daftar akun:", error);
        res.status(500).json({error: "Terjadi kesalahan"});
    }
});

//GET /api/v1/accounts/:accountId : menampilkan detail akun.
app.get("/api/v1/accounts/:accountId", async (req, res) => {
    try {
        const {accountId} = req.params;
    
        // Mengambil data akun berdasarkan accountId dari database menggunakan Prisma
        const account = await prisma.account.findUnique({
          where: {id: parseInt(accountId)},
        });
        if (!account) {
            return res.status(404).json({error: "Akun tidak ditemukan"});
          }
        res.json(account);
    }   catch (error) {
        console.error("Gagal mengambil detail akun:", error);
        res.status(500).json({ error: "Terjadi kesalahan"});
    }
});

//POST /api/v1/transactions: mengirimkan uang dari 1 akun ke akun lain (tentukan request body nya).
app.post("/api/v1/transactions", async (req, res) => {
    try{
        const {sourceAccountId, destinationAccountId, amount} = req.body;
        // Mengambil informasi akun pengirim dan akun penerima dari database menggunakan Prisma
        const sourceAccount = await prisma.account.findUnique({
            where: { id: sourceAccountId },
        });
        const destinationAccount = await prisma.account.findUnique({
            where: { id: destinationAccountId },
        });

        //Melakukan Transaksi
        await prisma.$transaction([
            prisma.account.update({
              where: { id: sourceAccountId },
              data: {
                balance: {
                  decrement: amount,
                },
              },
            }),
            prisma.account.update({
                where: { id: destinationAccountId },
                data: {
                  balance: {
                    increment: amount,
                  },
                },
              }),
              prisma.transactions.create({
                data: {
                  sourceAccountId,
                  destinationAccountId,
                  amount,
                },
              }),
            ]);
    res.json({message: "Transaksi berhasil"});
    } catch (error){
        console.error("Gagal melakukan transaksi:", error);
        res.status(500).json({error: "Terjadi kesalahan saat melakukan transaksi"});
    }
});

//GET /api/v1/transactions: menampilkan daftar transaksi.
app.get("/api/v1/transactions", async (req, res) => {
    try {
        // Mengambil semua data transaksi dari database menggunakan Prisma
        const transactions = await prisma.transactions.findMany();
    
        // Mengirim data transaksi sebagai respons JSON
        res.json(transactions);
    } catch (error) {
        console.error("Gagal mengambil daftar transaksi:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat mengambil daftar transaksi" });
    }
});

//GET /api/v1/transactions/:transaction: menampilkan detail transaksi (tampilkan juga pengirim dan penerimanya).
app.get("/api/v1/transactions/:transactionId", async (req, res) => {
    try {
        const {transactionId} = req.params;
    
        // Mengambil data transaksi dari database menggunakan Prisma
        const transaction = await prisma.transactions.findUnique({
          where: {id: parseInt(transactionId)},
          include: {
            sourceAccount: true,
            destinationAccount: true,
          },
        });
        if (!transaction) {
            return res.status(404).json({error: "Transaksi tidak ditemukan"});
          }
        res.json(transaction);
    }   catch (error) {
        console.error("Gagal mengambil detail transaksi:", error);
        res.status(500).json({ error: "Terjadi kesalahan"});
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


