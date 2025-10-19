
export interface InventoryItem {
  id: string;
  itemName: string;
  modelNumber: string | null;
  serialNumber: string | null;
  manufacturer: string | null;
  description: string;
  image?: string;
}
