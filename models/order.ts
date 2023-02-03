import { firestore } from "../lib/firestore";

type OrderData = {
  userId: string;
  created_at: Date;
  productId: string;
  status: "pending" | "closed";
  additionalInfo?: any;
};

const collection = firestore.collection("orders");

export class Order {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;

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

  static async createNewOrder(data: OrderData) {
    const newOrderSnap = await collection.add(data);
    const newOrder = new Order(newOrderSnap.id);
    newOrder.data = data;
    return newOrder;
  }

  static async searchMyOrders(id: string) {
    const results = await collection.where("userId", "==", id).get();
    if (results.empty) {
      return;
    } else {
      const docs = results.docs;
      const dataDocs = docs.map((d) => {
        return d.data();
      });
      return dataDocs;
    }
  }
}
