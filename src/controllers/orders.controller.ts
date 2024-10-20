/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { OrderService } from '@/services/orders.service';
import { Order, OrderStatus } from '@interfaces/orders.interface';
import { PackageService } from '@/services/package.service';
import { Package } from '@/interfaces/packages.interface';

export class OrderController {
  public orderService = Container.get(OrderService);
  public packageService = Container.get(PackageService);

  // Get all orders
  public getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allOrders: Order[] = await this.orderService.findAllOrders();
      res.status(200).json({ data: allOrders, message: 'findAll'});
    } catch (error) {
      next(error);
    }
  };

  // Get a specific order by ID
  public getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const order: Order = await this.orderService.findOrderById(orderId);

      res.status(200).json({ data: order, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  // Create a new order
  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderData: Order = {
        depositorId: req.body.depositorId,
        status: 'placed'
      }
      const packageData : Package = {
        name: req.body.package_name,
        description: req.body.package_description,
        weight: req.body.package_weight,
        depositorId: req.body.depositorId,
        isAvailable: true,
        isReceived: false
      }
      const newPackage : Package = await this.packageService.createNewPackageFromOrder(orderData,packageData);

      const newOrderData : Order = {
        ...orderData,
        depositorId : newPackage.depositorId,
        package_id : newPackage.id
      }
      const newOrder: Order = await this.orderService.createOrder(newOrderData);


      res.status(201).json({ data: newOrder, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  // Update an existing order
  public updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const orderData: Order = req.body;
      const updatedOrder: Order[] = await this.orderService.updateOrder(orderId, orderData);
      
      const packageId = updatedOrder[0].package_id;
      const packageData : Package = await this.packageService.getPackageById(packageId);

      const updatedPackage : Package = await this.packageService.updatePackageFromOrder(orderData,packageData);

      res.status(200).json({ data: updatedOrder, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };
  public updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const orderStatus: OrderStatus = req.body;
      const updatedOrder: Order = await this.orderService.updateOrderStatus(orderId, orderStatus.status);

      res.status(200).json({ data: updatedOrder, message: 'order status updated' });
    } catch (error) {
      next(error);
    }
  };

  // Delete an order
  public deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const deletedOrder: Order[] = await this.orderService.deleteOrder(orderId);

      res.status(200).json({ data: deletedOrder, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
