import { Order, readData, writeData } from "../utils/databaseManager";
import { v4 as uuidv4 } from "uuid";

export async function getOrdersController(req, res, next) {
  try {
    const user = req.user;
    const orders = await readData("orders");
    const userOrders = orders.filter((order) => order.userId === user.id);
    return res.status(200).json(userOrders);
  } catch (err) {
    next(err);
  }
}

export async function postOrderController(req, res, next) {
  try {
    const userId = req.user.id;
    const order = req.body as Omit<
      Order,
      Order["id"] | Order["userId"] | Order["date"]
    >;
    const id = uuidv4();
    //@ts-ignore
    await writeData("orders", { ...order, id, date: new Date(), userId });
    return res.status(201).json({ ...order, id: uuidv4(), date: new Date() });
  } catch (err) {
    next(err);
  }
}
