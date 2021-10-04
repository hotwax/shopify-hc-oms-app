export default interface UserState {
  token: string;
  current: object | null;
  inventoryFeed: object | null;
  refundForAutoCancelledOrders: boolean;
  orderSync: object | null;
  connectConfig: object | null;
}