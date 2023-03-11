import { createOrder } from "controllers/order";
import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware, handlerCORS, schemaMiddleware } from "lib/middlewares";

const querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown()
  .strict();

const bodySchema = yup
  .object()
  .shape({
    qty: yup.number().required(),
    additionalInfo: yup.object(),
  })
  .noUnknown()
  .strict();

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) {
  const { productId } = req.query;
  const { qty, additionalInfo } = req.body;

  const correctedAdditionalInfo = additionalInfo ? additionalInfo : null;

  const newOrder = await createOrder(
    token,
    productId as string,
    qty,
    correctedAdditionalInfo
  );

  res.send(newOrder);
}

const authorizedHandler = authMiddleware(postHandler);

const validatedPostHandlerQuerySchema = schemaMiddleware(
  querySchema,
  authorizedHandler,
  "query"
);
const validatedPostHandlerQueryAndBodySchema = schemaMiddleware(
  bodySchema,
  validatedPostHandlerQuerySchema,
  "body"
);

const handler = methods({
  post: validatedPostHandlerQueryAndBodySchema,
});

export default handlerCORS(handler);
