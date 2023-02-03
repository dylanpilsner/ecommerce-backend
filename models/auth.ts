import { isAfter } from "date-fns";
import { firestore } from "../lib/firestore";

type AuthData = {
  userId: string;
  email: string;
  expires: Date;
  code: number;
  created_at: Date;
};

const collection = firestore.collection("auth");

export class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  created_at: Date;

  constructor(id: string) {
    this.ref = collection.doc(id);
    this.id = id;
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    this.ref.update(this.data);
  }

  static async createNewAuth(data: AuthData) {
    const newAuthSnap = await collection.add(data);
    const newAuth = new Auth(newAuthSnap.id);
    newAuth.data = data;
    return newAuth;
  }

  static cleanEmail(email) {
    return email.trim().toLowerCase();
  }

  static async findAuthByEmail(email: string) {
    const cleanEmail = Auth.cleanEmail(email);
    const results = await collection.where("email", "==", cleanEmail).get();
    if (results.docs.length) {
      const firstDoc = results.docs[0];
      const foundAuth = new Auth(firstDoc.id);
      foundAuth.data = firstDoc.data();
      return foundAuth;
    } else {
      return;
    }
  }

  static async findAuthByEmailAndCode(email: string, code: number) {
    const cleanEmail = Auth.cleanEmail(email);
    const results = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();

    if (results.empty) {
      return;
    } else {
      const doc = results.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
    }
  }

  isCodeExpired() {
    const now = new Date();
    const expiredDate = this.data.expires.toDate();
    return isAfter(now, expiredDate);
  }
}
