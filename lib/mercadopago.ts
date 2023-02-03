import mercadopago from "mercadopago";

type preferenceData = {
  external_reference: string;
  items: [
    {
      title: string;
      quantity: number;
      currency_id: "ARS";
      unit_price: number;
    }
  ];
  notification_url: string;
  back_urls: {
    success: string;
  };
};

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export async function getMerchantOrder(id) {
  const merchantOrder = await mercadopago.merchant_orders.get(id);
  console.log(merchantOrder.body);

  return merchantOrder.body;
}

export async function createPreference(data: preferenceData) {
  const preference = await mercadopago.preferences.create(data);

  return preference.body;
}
