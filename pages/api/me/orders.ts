import { getMyOrders } from "controllers/order";
import { authMiddleware, handlerCORS } from "lib/middlewares";
import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) {
  const data = await getMyOrders(token);

  return res.send(data);
}

const authorizedGetHandler = authMiddleware(getHandler);

const handler = methods({
  get: authorizedGetHandler,
});

export default handlerCORS(handler);
