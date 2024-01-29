const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');


// Configura Nodemailer con tu servicio de correo electrónico
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'eagle1989x1000@gmail.com',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    refreshToken: 'YOUR_REFRESH_TOKEN',
  },
});

const sendSummary = async () => {
  const summary = await compileSalesSummary(); // Compila el resumen de ventas del día

  const mailOptions = {
    from: '"Tu Tienda" <eagle1989x1000@gmail.com>',
    to: 'eagle1989x1000@gmail.com',
    subject: 'Resumen de Ventas Diarias',
    text: summary, // Considera usar HTML para un formato más rico
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log('Resumen de ventas enviado.');
  } catch (error) {
    console.error('Hubo un problema al enviar el correo electrónico:', error);
  }
};







const sendDailySalesSummary = functions.pubsub.schedule('0 23 * * *')
  .timeZone('America/New_York') // Ajusta a tu zona horaria
  .onRun(sendSummary);

  async function compileSalesSummary() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const salesSnapshot = await admin.firestore().collection('sales')
        .where('dateCompleted', '>=', yesterday.toISOString())
        .where('dateCompleted', '<', today.toISOString())
        .get();

    let totalSales = 0;
    let totalRevenue = 0.0;
    let itemsSummary = '';

    salesSnapshot.forEach(doc => {
        const sale = doc.data();
        totalSales++;
        totalRevenue += parseFloat(sale.total || '0');

        sale.items.forEach(item => {
            itemsSummary += `Producto: ${item.name}, ID: ${item.productId}, Cantidad: ${item.quantity}, Total: $${item.total}\n`;
        });
    });

    const summary = `Resumen de Ventas del ${yesterday.toLocaleDateString()}:\n` +
                    `Total de Ventas: ${totalSales}\n` +
                    `Ingreso Total: $${totalRevenue.toFixed(2)}\n` +
                    `Detalle de los ítems vendidos:\n${itemsSummary}`;

    return summary;
}
// Llama a la función inmediatamente al iniciar el servidor
sendSummary();
module.exports = sendDailySalesSummary;
