import { Router } from 'express';
import { OrderController } from '@/controllers/orders.controller';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from '@/dtos/order.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class OrderRoute implements Routes {
  public path = '/orders';
  public router = Router();
  public order = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.order.getOrders);
    this.router.get(`${this.path}/:id(\\d+)`, this.order.getOrderById);
    this.router.get(`${this.path}/my/:depositorId`, this.order.getOrderByDepositorId);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateOrderDto), this.order.createOrder);
    this.router.put(`${this.path}/:id(\\d+)`, ValidationMiddleware(UpdateOrderDto, true), this.order.updateOrder);
    this.router.put(`${this.path}/:id(\\d+)/status`, ValidationMiddleware(UpdateOrderStatusDto, true), this.order.updateOrderStatus);
    this.router.delete(`${this.path}/:id(\\d+)`, this.order.deleteOrder);
  }
}
