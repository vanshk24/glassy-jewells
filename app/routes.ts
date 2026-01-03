import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("shop", "./routes/shop.tsx"),
  route("product/:id", "./routes/product.$id.tsx"),
  route("search", "./routes/search.tsx"),
  route("wishlist", "./routes/wishlist.tsx"),
  route("cart", "./routes/cart.tsx"),
  route("checkout", "./routes/checkout.tsx"),
  route("order-confirmation/:orderId", "./routes/order-confirmation.$orderId.tsx"),
  route("admin-login", "./routes/admin-login.tsx"),
  route("admin", "./routes/admin.tsx", [
    index("./routes/admin._index.tsx"),
    route("products", "./routes/admin.products.tsx"),
    route("orders", "./routes/admin.orders.tsx"),
    route("product/:id", "./routes/admin.product.$id.tsx"),
    route("users", "./routes/admin.users.tsx"),
    route("settings", "./routes/admin.settings.tsx"),
  ]),
] satisfies RouteConfig;
