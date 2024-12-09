import { Router } from "express";
import * as Users from "../controllers/ressources/users";
import * as Accounts from "../controllers/ressources/accounts";
import * as Campaigns from "../controllers/ressources/campaigns";
import * as Tickets from "../controllers/ressources/tickets";
import * as Withdrawals from "../controllers/ressources/withdrawals";
import * as Reviews from "../controllers/ressources/reviews";
import * as Proposals from "../controllers/ressources/proposals";
import * as Payments from "../controllers/ressources/payments";
import * as Invoices from "../controllers/ressources/invoices";
import * as Subscriptions from "../controllers/ressources/subscriptions";
import * as Orders from "../controllers/ressources/orders";
import * as Notifications from "../controllers/ressources/notifications";
import { checkCache } from "../middleware";
import { deleteCachedData } from "../lib/redis";

const router: Router = Router();

// Helper to generate CRUD routes
const createRoutes = (entityName: string, controller: any) => {
  router.post(`/${entityName}/create`, async (req, res) => {
    try {
      const data = await controller.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      console.error(`Error creating ${entityName}:`, error);
      res.status(500).json({ error: `Failed to create ${entityName}` });
    }
  });

  router.get(`/${entityName}/:id`, checkCache, async (req, res) => {
    try {
      const data = await controller.getById(req.params.id);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching ${entityName}:`, error);
      res.status(500).json({ error: `Failed to fetch ${entityName}` });
    }
  });

  router.put(`/${entityName}/:id`, async (req, res) => {
    try {
      await controller.update(req.params.id, req.body);
      await deleteCachedData(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error(`Error updating ${entityName}:`, error);
      res.status(500).json({ error: `Failed to update ${entityName}` });
    }
  });

  router.delete(`/${entityName}/:id`, async (req, res) => {
    try {
      await controller.remove(req.params.id);
      await deleteCachedData(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      res.status(500).json({ error: `Failed to delete ${entityName}` });
    }
  });

  router.post(`/${entityName}`, async (req, res) => {
    try {
      const filters = req.body.filters || [];
      const data = await controller.getAll(filters);
      res.json(data);
    } catch (error) {
      console.error(`Error fetching ${entityName}s:`, error);
      res.status(500).json({ error: `Failed to fetch ${entityName}s` });
    }
  });
};

// Create routes for each entity
createRoutes("accounts", Accounts);
createRoutes("campaigns", Campaigns);
createRoutes("notifications", Notifications);
createRoutes("orders", Orders);
createRoutes("payments", Payments);
createRoutes("invoices", Invoices);
createRoutes("subscriptions", Subscriptions);
createRoutes("proposals", Proposals);
createRoutes("reviews", Reviews);
createRoutes("tickets", Tickets);
createRoutes("users", Users);
createRoutes("withdrawals", Withdrawals);

export default router;
