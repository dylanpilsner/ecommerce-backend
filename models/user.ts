import { firestore } from "../lib/firestore";

type UserData = {
  email: string;
  created_at: Date;
  address?: string;
  name?: string;
  phoneNumber?: string;
};

const collection = firestore.collection("users");

export class User {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

  constructor(id: string) {
    this.ref = collection.doc(id);
    this.id = id;
  }

  static cleanEmail(email: string) {
    return email.trim().toLowerCase();
  }

  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }

  async push() {
    this.ref.update(this.data);
  }

  static async createNewUser(data: UserData) {
    const newUserSnap = await collection.add(data);
    const newUser = new User(newUserSnap.id);
    newUser.data = data;
    return newUser;
  }
}
