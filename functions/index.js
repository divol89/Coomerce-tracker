const admin = require('firebase-admin');
admin.initializeApp();

// Inicializa la app de Firebase solo una vez
if (admin.apps.length === 0) {
    admin.initializeApp();
}

const sendDailySalesSummary = require('./sendDailySalesSummary');
const recordSale = require('./recordSale');


exports.sendDailySalesSummary = sendDailySalesSummary;
exports.recordSale = recordSale;
