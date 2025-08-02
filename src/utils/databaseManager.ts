import fs from "fs/promises";

const databasePath = "db.json";

type Entity = "users" | "products" | "orders";

type User = {
  id: string;
  email: string;
  password: string;
  refreshToken?: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export interface Address {
  city: string;
  street: string;
  addressName: string;
  neighborhood: string;
  number: string;
  cep: string;
}

export interface Cart {
  products: Product[];
  totalItems: number;
  totalPrice: number;
}

export type Order = {
  id: string;
  userId: string;
  paymentMethod: string;
  cart: Cart;
  deliveryMethod: string;
  address?: Address;
  date: string;
  orderNumber: string;
  pickupAddress?: string;
};

type Data = {
  users: User[];
  products: Product[];
  orders: Order[];
};

type EntityData = {
  users: User;
  products: Product;
  orders: Order;
};

type EntityMap = Data;

/**
 * Reads data from the specified entity in the database.
 * @param entity - The entity to read data from (e.g., "users", "products").
 * @returns The data from the specified entity.
 * @throws Will throw an error if the entity is not found.
 */

export async function readData<K extends Entity>(
  entity: K
): Promise<EntityMap[K] | undefined | null> {
  const data = await fs.readFile(databasePath);
  const dataParse = JSON.parse(data.toString());

  if (!dataParse[entity]) {
    throw new Error("entity not found.");
  }

  return dataParse[entity];
}

/**
 * Writes data to the specified entity in the database.
 * If an entityId is provided, it updates the existing entity; otherwise, it adds a new entity.
 * @param entity - The entity to write data to (e.g., "users", "products").
 * @param saveData - The data to save in the specified entity.
 * @param entityId - Optional ID of the entity to update.
 * @returns A promise that resolves when the data is written.
 * @throws Will throw an error if the entity is not found or if the ID does not match any existing entity.
 */
export async function writeData<K extends Entity>(
  entity: K,
  saveData: EntityData[K],
  entityId?: string
): Promise<void> {
  const data = await fs.readFile(databasePath);
  const dataParse: Data = JSON.parse(data.toString());

  if (!dataParse[entity]) {
    throw new Error("entity not found.");
  }

  if (entityId !== undefined) {
    const index = dataParse[entity].findIndex((item) => item.id === entityId);
    if (index === -1) {
      throw new Error("Entity with the specified ID not found.");
    }
    dataParse[entity][index] = saveData;
  } else {
    //@ts-ignore
    dataParse[entity].push(saveData);
  }

  await fs.writeFile(databasePath, JSON.stringify(dataParse, null, 2));
}
