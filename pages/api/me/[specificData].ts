import { updateSingleData } from "controllers/user";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const bodySchema = yup
  .object()
  .shape({
    newValue: yup.string().required(),
  })
  .noUnknown()
  .strict();

const querySchema = yup
  .object()
  .shape({
    specificData: yup
      .string()
      .oneOf(["address", "name", "phoneNumber"])
      .required(),
  })
  .noUnknown()
  .strict();

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) {
  const { specificData } = req.query as any;

  const updatedData = await updateSingleData(
    token,
    specificData,
    req.body.newValue
  );

  return res.send(updatedData);
}

const authorizedPostHandler = authMiddleware(postHandler);
const velidatedQueryAuthorizedPostHandlerSchema = schemaMiddleware(
  querySchema,
  authorizedPostHandler,
  "query"
);
const validatedBodyAuthorizedPostHandlerSchema = schemaMiddleware(
  bodySchema,
  velidatedQueryAuthorizedPostHandlerSchema,
  "body"
);

export default methods({
  patch: validatedBodyAuthorizedPostHandlerSchema,
});
