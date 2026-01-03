import { supabase } from "~/supabase/client";

interface SuggestedRoute {
  title: string;
  uri: string;
}

interface RouteDescription {
  suggestedRoutes: SuggestedRoute[];
  itemTitle: string;
}

export async function getRouteDescription(): Promise<RouteDescription> {
  try {
    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .limit(10);

    return {
      suggestedRoutes: (products || []).map((product) => ({
        title: product.name,
        uri: `/admin/product/${product.id}`,
      })),
      itemTitle: "Product",
    };
  } catch (error) {
    return {
      suggestedRoutes: [],
      itemTitle: "Product",
    };
  }
}
