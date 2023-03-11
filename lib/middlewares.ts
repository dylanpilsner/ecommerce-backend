import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decodeToken } from "lib/jwt";
import parseToken from "parse-bearer-token";
import * as yup from "yup";
import NextCors from "nextjs-cors";

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

export function handlerCORS(callback) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    // Run the cors middleware
    // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
    await NextCors(req, res, {
      // Options
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    // Rest of the API logic
    callback(req, res);
    //res.json({ message: "Hello NextJs Cors!" });
  };
}
