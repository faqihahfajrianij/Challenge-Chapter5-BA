const passport = require('./lib/passport');

// Middleware untuk memeriksa apakah pengguna sudah masuk (authenticated)
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Lanjutkan jika user telah masuk
    } else {
        res.redirect('/login'); // Redirect ke halaman login jika user belum masuk
    }
}

//Middleware untuk memeriksa apakah pengguna belum masuk (unauthenticated)
function ensureNotAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next(); // Lanjutkan jika pengguna belum masuk
    } else {
        res.redirect('/dashboard'); // Redirect ke halaman dashboard jika pengguna sudah masuk
    }
}

// Middleware untuk memeriksa izin akses
function checkPermission(permission) {
    return (req, res, next) => {
        if (req.user && req.user.permissions.includes(permission)) {
            return next(); // Lanjutkan jika pengguna memiliki izin yang sesuai
        } else {
            res.status(403).send('Forbidden'); // Kirim status 403 jika pengguna tidak memiliki izin
        }
    };
}

module.exports = {
    ensureAuthenticated,
    ensureNotAuthenticated,
    checkPermission,
};