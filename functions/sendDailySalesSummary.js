const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');


// Configura Nodemailer con tu servicio de correo electrónico
const mailTransport = nodemailer.createTransport({
  service: 'gmail', // Ejemplo con Gmail, ajusta según tu proveedor
  auth: {
    user: 'tu-email@gmail.com',
    pass: 'tu-contraseña', // Considera usar variables de entorno o Firebase Config para manejar esto de manera segura
  },
});

const sendDailySalesSummary = functions.pubsub.schedule('0 23 * * *')
  .timeZone('America/New_York') // Ajusta a tu zona horaria
  .onRun(async (context) => {
    const summary = await compileSalesSummary(); // Compila el resumen de ventas del día

    const mailOptions = {
      from: '"Tu Tienda" <tu-email@gmail.com>',
      to: 'admin@tu-tienda.com',
      subject: 'Resumen de Ventas Diarias',
      text: summary, // Considera usar HTML para un formato más rico
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log('Resumen de ventas enviado.');
    } catch (error) {
      console.error('Hubo un problema al enviar el correo electrónico:', error);
    }
  });

async function compileSalesSummary() {
  // Obtén la fecha de hoy y la fecha de ayer en formato adecuado
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Consulta Firestore por las ventas del día anterior
  const salesSnapshot = await admin.firestore().collection('sales')
    .where('date', '>=', yesterday)
    .where('date', '<', today)
    .get();

  // Procesa los datos para compilar el resumen
  let totalSales = 0;
  let totalRevenue = 0.0;
  const productCounts = {}; // Un objeto para contar las ventas por producto

  salesSnapshot.forEach(doc => {
    const sale = doc.data();
    totalSales++;
    totalRevenue += sale.totalAmount;

    sale.items.forEach(item => {
      if (!productCounts[item.name]) {
        productCounts[item.name] = 0;
      }
      productCounts[item.name] += item.quantity;
    });
  });

  // Encuentra el producto más vendido
  const topProduct = Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b);

  // Formatea el resumen
  const summary = `Resumen de Ventas del ${yesterday.toLocaleDateString()}:\n` +
                  `Total de Ventas: ${totalSales}\n` +
                  `Ingreso Total: $${totalRevenue.toFixed(2)}\n` +
                  `Producto Más Vendido: ${topProduct} con ${productCounts[topProduct]} unidades.`;

  return summary;
}

module.exports = sendDailySalesSummary;
