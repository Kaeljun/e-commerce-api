import { Order, readData, writeData } from "../utils/databaseManager";
import { v4 as uuidv4 } from "uuid";

export async function getOrdersController(req, res, next) {
  try {
    const user = req.user;
    const orders = await readData("orders");
    const userOrders = orders?.filter((order) => order.userId === user.id);
    return res.status(200).json(userOrders);
  } catch (err) {
    next(err);
  }
}

export async function postOrderController(req, res, next) {
  try {
    const userId = req.user.id;
    const reqOrder = req.body as Omit<
      Order,
      "id" | "userId" | "date" | "orderNumber"
    >;
    if (reqOrder.deliveryMethod === "shipment" && !reqOrder.address) {
      return res
        .status(400)
        .json({ message: "shipment order requires an address" });
    }
    if (reqOrder.deliveryMethod === "pickup" && !reqOrder.pickupAddress) {
      return res
        .status(400)
        .json({ message: "pickup order requires a pickupAddress" });
    }
    const { cart, deliveryMethod, paymentMethod } = reqOrder;
    if (
      !deliveryMethod ||
      !paymentMethod ||
      !cart?.products ||
      !cart.totalItems ||
      !cart.totalPrice
    ) {
      return res.status(400).json({
        message: "cart or deliveryMethod or paymentMethod is required",
      });
    }
    const id = uuidv4();
    const pastOrders = await readData("orders");
    const userOrders = pastOrders?.filter((order) => order.userId === userId);
    const orderNumber = !!userOrders ? String(userOrders?.length + 1) : "1";
    const newOrder: Order = {
      ...reqOrder,
      id,
      date: new Date().toISOString(),
      userId,
      orderNumber,
    };
    await writeData("orders", newOrder);
    return res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
}
