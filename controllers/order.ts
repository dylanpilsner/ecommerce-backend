import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { Product } from "models/product";

export async function createOrder(
  userId: string,
  productId: string,
  qty: number,
  additionalInfo: any
) {
  const product = await Product.searchProductById(productId);
  const order = await Order.createNewOrder({
    userId,
    created_at: new Date(),
    productId,
    status: "pending",
    additionalInfo: additionalInfo,
  });

  const productData = product.singleProduct;

  const pref = await createPreference({
    external_reference: order.id,
    items: [
      {
        title: productData.title,
        quantity: qty,
        currency_id: "ARS",
        unit_price: productData.price,
      },
    ],
    notification_url:
      "https://mp-integration.vercel.app/api/webhooks/mercadopago",
    back_urls: {
      success: "https://apx.school",
    },
  });

  return { url: pref.init_point };
}
