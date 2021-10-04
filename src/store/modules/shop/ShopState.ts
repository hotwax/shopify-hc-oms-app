export default interface ShopState {
  token: string;
  inventoryFeed: object | null;
  refundForAutoCancelledOrders: boolean;
  orderSync: object | null;
  connectConfig: object | null;
}