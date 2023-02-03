import { generateToken, decodeToken } from "./jwt";

import test from "ava";

test("jwt encode/decode", (t) => {
  const payload = { dylan: true };
  const token = generateToken(payload);
  const salida: any = decodeToken(token);
  delete salida.iat;
  t.deepEqual(salida, payload);
});
