import { pullProfileData, updateProfileData } from "controllers/user";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

const updateProfileSchema = yup
  .object()
  .shape({
    name: yup.string(),
    address: yup.string(),
    phoneNumber: yup.string(),
  })
  .noUnknown()
  .strict()
  .test(
    "hasOne",
    "You must provide at least one piece of information",
    function (value) {
      return Object.values(value).some(Boolean);
    }
  );

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const data = await pullProfileData(token);

  return res.send(data);
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
  const updatedData = await updateProfileData(token, req.body);

  return res.send(updatedData);
}

const authorizedGetHandler = authMiddleware(getHandler);
const authorizedPatchHandler = authMiddleware(patchHandler);
const validatedAuthorizedPatchHandlerSchema = schemaMiddleware(
  updateProfileSchema,
  authorizedPatchHandler,
  "body"
);

export default methods({
  get: authorizedGetHandler,
  patch: validatedAuthorizedPatchHandlerSchema,
});
