import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OrderService } from '@/services/orders.service';
import { Order } from '@interfaces/orders.interface';

export class OrderController {
  public orderService = Container.get(OrderService);

  // Get all orders
  public getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allOrders: Order[] = await this.orderService.findAllOrders();
      res.status(200).json({ data: allOrders, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  // Get a specific order by ID
  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId: number = Number(req.params.id);
      const order: Order = await this.orderService.findOrderById(orderId);

      res.status(200).json({ data: order, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  // Create a new order
  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData: Order = req.body;
      orderData.status = 'placed';
      const newOrder: Order = await this.orderService.createOrder(orderData);

      res.status(201).json({ data: newOrder, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  // Update an existing order
  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId: number = Number(req.params.id);
      const orderData: Order = req.body;
      const updatedOrder: Order[] = await this.orderService.updateOrder(orderId, orderData);

      res.status(200).json({ data: updatedOrder, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  // Delete an order
  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId: number = Number(req.params.id);
      const deletedOrder: Order[] = await this.orderService.deleteOrder(orderId);

      res.status(200).json({ data: deletedOrder, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
