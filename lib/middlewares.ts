import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decodeToken } from "lib/jwt";
import parseToken from "parse-bearer-token";
import * as yup from "yup";

export function schemaMiddleware(
  yupSchema: yup.AnyObjectSchema,
  callback,
  dataLocation: "body" | "query"
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await yupSchema.validate(req[dataLocation]);
    } catch (err) {
      return res.status(400).send({ field: dataLocation, err: err.errors });
    }
    callback(req, res);
  };
}

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseToken(req);
    if (!token) {
      return res.status(401).send({ message: "token required" });
    }

    const decodedToken = decodeToken(token);

    if (decodedToken) {
      callback(req, res, decodedToken["userId"]);
    } else {
      return res.status(401).send({ message: "invalid token" });
    }
  };
}
