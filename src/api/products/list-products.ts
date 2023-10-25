import {
  CartService,
  PricingService,
  ProductVariantInventoryService,
  StoreGetProductsParams,
  cleanResponseData,
  defaultStoreCategoryScope,
} from "@medusajs/medusa";
import ProductService from "../../services/product";

export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService");
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService");
  const pricingService: PricingService = req.scope.resolve("pricingService");
  const cartService: CartService = req.scope.resolve("cartService");

  const validated = req.validatedQuery as StoreGetProductsParams;

  let {
    cart_id,
    region_id: regionId,
    currency_code: currencyCode,
    ...filterableFields
  } = req.filterableFields;
  const listConfig = req.listConfig;

  const promises: Promise<any>[] = [
    // @ts-ignore
    productService.listAndCountQueryBuilder(validated, listConfig),
  ];

  if (validated.cart_id) {
    promises.push(
      cartService.retrieve(validated.cart_id, {
        select: ["id", "region_id"] as any,
        relations: ["region"],
      })
    );
  }

  const [[rawProducts, count], cart] = await Promise.all(promises);

  if (validated.cart_id) {
    regionId = cart.region_id;
    currencyCode = cart.region.currency_code;
  }

  // Create a new reference just for naming purpose
  const computedProducts = rawProducts;

  // We only set prices if variants.prices are requested
  const shouldSetPricing = ["variants", "variants.prices"].every((relation) =>
    listConfig.relations?.includes(relation)
  );

  // We only set availability if variants are requested
  const shouldSetAvailability = listConfig.relations?.includes("variants");

  const decoratePromises: Promise<any>[] = [];

  if (shouldSetPricing) {
    decoratePromises.push(
      pricingService.setProductPrices(computedProducts, {
        cart_id: cart_id,
        region_id: regionId,
        currency_code: currencyCode,
        customer_id: req.user?.customer_id,
        include_discount_prices: true,
      })
    );
  }

  if (shouldSetAvailability) {
    decoratePromises.push(
      productVariantInventoryService.setProductAvailability(
        computedProducts,
        filterableFields.sales_channel_id
      )
    );
  }

  // We can run them concurrently as the new properties are assigned to the references
  // of the appropriate entity
  await Promise.all(decoratePromises);

  res.json({
    products: cleanResponseData(computedProducts, req.allowedProperties || []),
    count,
    offset: validated.offset,
    limit: validated.limit,
  });
};
