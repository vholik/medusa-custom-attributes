import type { MiddlewaresConfig } from "@medusajs/medusa";
import { urlencoded } from "body-parser";

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/store/*",
      middlewares: [urlencoded({ extended: true })],
    },
  ],
};
