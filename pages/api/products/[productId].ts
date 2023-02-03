import { getProductById } from "controllers/product";
import { schemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const querySchema = yup
  .object()
  .shape({
    productId: yup.string().required(),
  })
  .noUnknown()
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const foundProduct = await getProductById(req.query.productId as string);

  return res.send(foundProduct);
}

const validatedGetHandlerSchema = schemaMiddleware(
  querySchema,
  getHandler,
  "query"
);

export default methods({
  get: validatedGetHandlerSchema,
});
