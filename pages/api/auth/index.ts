import { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import methods from "micro-method-router";
import * as yup from "yup";
import { handlerCORS, schemaMiddleware } from "lib/middlewares";

const signSchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    address: yup.string(),
    name: yup.string(),
    phoneNumber: yup.number(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const code = await sendCode(req.body.email);
  res.send(code);
}

const postHandlerWithSchemaValidation = schemaMiddleware(
  signSchema,
  postHandler,
  "body"
);

const handler = methods({
  post: postHandlerWithSchemaValidation,
});

export default handlerCORS(handler);
