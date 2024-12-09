import { Router } from "express";
import { getCachedData, setCachedData } from "../lib/redis";

const router: Router = Router();

const createCart = async (userId: string) => {
  const cart = {
    items: [],
    total: 0,
  };

  await setCachedData(userId, {
    cart,
  });
  return cart;
};

router.get("/cart/:userId", async (req, res) => {
  try {
    const data = await getCachedData(req.params.userId);
    console.log("Fetching cart for user:", req.params.userId, data);
    if (data && data.cart) return res.send(data.cart);
    const newCart = await createCart(req.params.userId);
    res.send(newCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.post("/cart/update", async (req, res) => {
  try {
    const data = await setCachedData(req.body.userId, { cart: req.body.cart });
    res.send(data);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
});

export default router;
