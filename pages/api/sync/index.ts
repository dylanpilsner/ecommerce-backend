import type { NextApiRequest, NextApiResponse } from "next";
import { synchronizeDatabases } from "controllers/product";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const synchronize = await synchronizeDatabases("Products");

  res.send(synchronize);
}
