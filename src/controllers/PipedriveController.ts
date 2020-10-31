  import { Request, Response } from "express";

  import PipedriveService from "../services/PipedriveService";
  import BlingService from "../services/BlingService";
  import OrderService from "../services/OrderService";
  import { Order } from "../models/Order";

  class PipedriveController {
    async index(req: Request, res: Response) {


      const deals = await PipedriveService.getWonsPipeDrive();
      if (!deals) {
        return res.status(204);
      }

      deals.forEach(async (deal) => {
        BlingService.castOrder(deal);
        OrderService.saveOrder(deal);
      });

      return res
        .status(201)
        .json({ Message: "Orders placed on the Bling platform" });
    }

    async show(req: Request, res: Response) {


      const orders = await Order.find();
      return res.json(orders);
    }
  }

  export default PipedriveController;
