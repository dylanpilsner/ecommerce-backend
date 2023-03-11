import { searchProducts } from "controllers/product";
import * as yup from "yup";
import methods from "micro-method-router";
import { handlerCORS, schemaMiddleware } from "lib/middlewares";
import { NextApiRequest, NextApiResponse } from "next";

const querySchema = yup
  .object()
  .shape({
    q: yup.string(),
    limit: yup.string(),
    offset: yup.string(),
  })
  .noUnknown()
  .strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const foundProducts = await searchProducts(req, 15, 200);

  return res.send({
    results: foundProducts.results,
    pagination: foundProducts.pagination,
  });
}

const validatedGetHandlerSchema = schemaMiddleware(
  querySchema,
  getHandler,
  "query"
);

const handler = methods({
  get: validatedGetHandlerSchema,
});

export default handlerCORS(handler);
