interface SuggestedRoute {
  title: string;
  uri: string;
}

interface RouteDescription {
  suggestedRoutes: SuggestedRoute[];
  itemTitle: string;
}

export function getRouteDescription(): RouteDescription {
  return {
    suggestedRoutes: [
      {
        title: 'Order #1001',
        uri: '/order-confirmation/1001',
      },
      {
        title: 'Order #1002',
        uri: '/order-confirmation/1002',
      },
      {
        title: 'Order #1003',
        uri: '/order-confirmation/1003',
      },
    ],
    itemTitle: 'Order',
  };
}
