import { updateOrderStatus } from "controllers/order";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    await updateOrderStatus(id as string);
    return res.send({ message: "mercadopago webhook has done its job" });
  }
  return;
}
