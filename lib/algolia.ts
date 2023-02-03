import algoliasearch from "algoliasearch";

const client = algoliasearch("F8WG38ZBKR", "4455eefc97ef103a948459f1d1067cd3");

export const productsIndex = client.initIndex("products");
