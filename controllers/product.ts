import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";
import { Product } from "models/product";
import { NextApiRequest } from "next";

export function getOffsetAndLimitFromReq(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 300
) {
  const queryLimit = parseInt((req.query.limit as string) || "0");
  const queryOffset = parseInt((req.query.offset as string) || "0");

  let limit = 10;

  if (queryLimit > 0 && queryLimit < maxLimit) {
    limit = queryLimit;
  } else if (queryLimit > maxLimit) {
    limit = maxLimit;
  }

  const offset = queryOffset < maxOffset ? queryOffset : 0;

  return {
    limit,
    offset,
  };
}

export async function searchProducts(
  req: NextApiRequest,
  maxLimit: number,
  maxOffset: number
) {
  const products = new Product();

  const { offset, limit } = getOffsetAndLimitFromReq(req, maxLimit, maxOffset);

  const foundProducts = await products.searchProducts(
    req.query.q as string,
    limit,
    offset
  );

  return foundProducts;
}

export async function getProductById(id: string) {
  const product = new Product();

  const foundProduct = await Product.searchProductById(id);

  return foundProduct;
}

export async function synchronizeDatabases(tableToSynchronize: string) {
  airtableBase(tableToSynchronize)
    .select({
      pageSize: 10,
    })
    .eachPage(
      async function (records, fetchNextPage) {
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });
        await productsIndex.saveObjects(objects);

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
  return { message: "successful synchronization" };
}
