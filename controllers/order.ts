import { createPreference, getMerchantOrder } from "lib/mercadopago";
import {
  sendNewSaleNotification,
  sendPurchaseConfirmation,
} from "lib/sendinblue";
import { Order } from "models/order";
import { Product } from "models/product";
import { User } from "models/user";

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
      "https://ecommerce-backend-indol.vercel.app/api/ipn/mercadopago",
    back_urls: {
      success: "https://apx.school",
    },
  });

  return { url: pref.init_point };
}

export async function getMyOrders(id: string) {
  const myOrders = await Order.searchMyOrders(id);

  if (!myOrders) {
    return { message: "this user has no orders" };
  }

  return myOrders;
}

export async function updateOrderStatus(id: string) {
  const order = await getMerchantOrder(id);
  const orderId = order.external_reference;
  const myOrder = new Order(orderId);
  await myOrder.pull();

  if (order.order_status === "paid") {
    const product = await Product.searchProductById(myOrder.data.productId);
    const vendor = new User(product.singleProduct.vendor_id);
    const buyer = new User(myOrder.data.userId);
    await vendor.pull();
    await buyer.pull();
    if (myOrder.data.status != "closed") {
      await sendNewSaleNotification(
        vendor.data.email,
        product.singleProduct.title
      );
      await sendPurchaseConfirmation(
        buyer.data.email,
        product.singleProduct.title
      );
    }

    myOrder.data.status = "closed";
    await myOrder.push();

    return true;
  }
  if (order.order_status === "payment_required") {
    myOrder.data.status = "pending_payment";
    await myOrder.push();
  }
  if (order.order_status === "payment_in_process") {
    myOrder.data.status = "processing_payment";
    await myOrder.push();
  }
  return;
}
