export default interface UserState {
  token: string;
  current: object | null;
  inventoryFeed: object | null;
  orderUpdates: object | null;
  orderSync: object | null;
}