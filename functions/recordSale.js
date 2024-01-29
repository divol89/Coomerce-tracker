const functions = require('firebase-functions');
const admin = require("firebase-admin");
// const WEBHOOK_SECRET = "45xMN90";

const recordSale = functions.https.onRequest((req, res) => {
  console.log('Cabeceras de la solicitud:', req.headers);
  if (req.method !== "POST") {
    console.error("Se recibió un método HTTP no permitido:", req.method);
    return res.status(405).send("Método no permitido");
  }
  console.log('Received webhook secret:', req.headers['x-wc-webhook-secret']);

  // if (req.headers["x-wc-webhook-secret"] !== WEBHOOK_SECRET) {
  //   console.error("Acceso no autorizado. Secreto del webhook inválido.");
  //   return res.status(401).send("No autorizado");
  // }

  const saleData = req.body;
  
  // Extrae los datos que necesitas
  const items = saleData.line_items.map(item => ({
    name: item.name,
    productId: item.product_id,
    quantity: item.quantity,
    total: item.total
  }));

  const dataToSave = {
    dateCompleted: saleData.date_completed_gmt,
    items: items
  };


  if (saleData.status === "completed") {
    
    // Guarda los datos en Firestore
  const salesRef = admin.firestore().collection('sales');
  salesRef.add(dataToSave)
    .then(docRef => {
      console.log(`Pedido completado registrado con éxito con ID: ${docRef.id}`);
      res.status(200).send(`Pedido registrado con éxito con ID: ${docRef.id}`);
    })
    .catch(error => {
      console.error('Error al agregar el documento: ', error);
      res.status(500).send('Error al registrar el pedido');
    });
  } else {
    console.log(
        "El pedido no está completado. Estado del pedido:",
        saleData.status);
    return res.status(200).send(
        "Pedido no completado, no se registró la venta",
    );
  }
});

module.exports = recordSale;
