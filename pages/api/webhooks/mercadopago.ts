import { getMerchantOrder } from "lib/mercadopago";
import methods from "micro-method-router";
import { Order } from "models/order";
import { NextApiRequest, NextApiResponse } from "next";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id as string);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
    }
  }
  return res.send({ message: "mercadopago webhook has done its job" });
}

export default methods({
  post: postHandler,
});
