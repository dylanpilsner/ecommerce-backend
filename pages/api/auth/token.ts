import { signIn } from "controllers/auth";
import { handlerCORS, schemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const validationSchema = yup
  .object()
  .shape({
    email: yup.string().required(),
    code: yup.number().required(),
  })
  .noUnknown()
  .strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;

  try {
    const token = await signIn(email, code);
    res.send({ token });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
}

const postHandlerWithSchemaValidation = schemaMiddleware(
  validationSchema,
  postHandler,
  "body"
);

const handler = methods({
  post: postHandlerWithSchemaValidation,
});

export default handlerCORS(handler);
