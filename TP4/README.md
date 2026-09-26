# Payments MS — TP4 Sesiones de pago y webhook Stripe

Microservicio HTTP en NestJS que (1) crea sesiones de pago con Stripe Checkout
y (2) recibe el webhook de Stripe cuando el cobro se concreta.

## Cómo levantarlo

1. Instalar dependencias:

npm install


2. Copiar `.env.template` a `.env` y completar los valores reales
   (clave secreta de Stripe, etc.):

cp .env.template .env


3. Levantar el servidor:

npm run start:dev

   El servidor queda escuchando en `http://localhost:3003`.

4. En otra terminal, levantar el puente de Stripe CLI para poder recibir
   webhooks en local:

stripe listen --forward-to localhost:3003/payments/webhook --events charge.succeeded --all-snapshot

   Copiar el `whsec_...` que muestra y pegarlo como `STRIPE_ENDPOINT_SECRET`
   en el `.env`, después reiniciar el servidor.

## Rutas

- `POST /payments/create-payment-session` — crea una Checkout Session en
  Stripe. Devuelve `id` y `url` para redirigir al pago.
- `POST /payments/webhook` — recibe los eventos de Stripe. Verifica la firma
  (`stripe-signature`) y procesa `charge.succeeded`, extrayendo el `orderId`
  de los metadatos.
- `GET /payments/success` y `GET /payments/cancel` — rutas de apoyo para el
  redirect de Checkout.