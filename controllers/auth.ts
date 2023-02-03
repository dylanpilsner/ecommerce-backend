import { Auth } from "../models/auth";
import { User } from "../models/user";
import { sendCodeEmail } from "lib/sendinblue";
import addMinutes from "date-fns/addMinutes";
import { generateToken } from "lib/jwt";

function generateSixDigitNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function findOrCreateAuth(
  email: string,
  address?: string,
  name?: string,
  phoneNumber?: string
): Promise<Auth> {
  const cleanEmail = Auth.cleanEmail(email);
  const auth = await Auth.findAuthByEmail(cleanEmail);

  if (!auth) {
    const createdUser = await User.createNewUser({
      email: cleanEmail,
      name: name ? name : null,
      address: address ? address : null,
      phoneNumber: phoneNumber ? phoneNumber : null,
      created_at: new Date(),
    });

    const createdAuth = await Auth.createNewAuth({
      userId: createdUser.id,
      email: cleanEmail,
      expires: null,
      code: null,
      created_at: new Date(),
    });

    return createdAuth;
  }
  return auth;
}

export async function sendCode(email: string): Promise<any> {
  const cleanEmail = Auth.cleanEmail(email);
  const auth = await findOrCreateAuth(cleanEmail);
  const code = generateSixDigitNumber();
  const now = new Date();
  const tenMinutesFromNow = addMinutes(now, 10);

  auth.data.code = code;
  auth.data.expires = tenMinutesFromNow;
  await auth.push();

  // Mail al usuario
  await sendCodeEmail(code, cleanEmail);
  return true;
}

export async function signIn(email: string, code: number) {
  const auth = await Auth.findAuthByEmailAndCode(email, code);

  if (!auth) {
    throw "invalid email or code";
  }

  const isExpired = auth.isCodeExpired();

  if (isExpired) {
    throw "expired code";
  }

  const token = generateToken({ userId: auth.data.userId });
  auth.data.code = null;
  auth.push();

  return { token };
}
