const {onRequest} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

const WEBHOOK_SECRET = "45xMN90";

exports.recordSale = onRequest((req, res) => {
  if (req.method !== "POST") {
    console.error("Se recibió un método HTTP no permitido:", req.method);
    return res.status(405).send("Método no permitido");
  }

  if (req.headers["x-wc-webhook-secret"] !== WEBHOOK_SECRET) {
    console.error("Acceso no autorizado. Secreto del webhook inválido.");
    return res.status(401).send("No autorizado");
  }

  const saleData = req.body;

  if (saleData.status === "completed") {
    const salesRef = admin.firestore().collection("sales");
    salesRef.add(saleData)
        .then(() => {
          console.log(
              "Pedido completado registrado con éxito:",
              saleData, // Asegúrate de no tener espacios después de esta línea
          ); // Añade una coma aquí si hay más elementos en el objeto
          return res
              .status(200)
              .send("Venta registrada con éxito");
        })
        .catch((error) => {
          console.error("Error al registrar la venta:", error);
          return res.status(500).send("Error interno del servidor");
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
