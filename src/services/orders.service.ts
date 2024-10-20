/* eslint-disable prettier/prettier */
import { Service } from 'typedi';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { Order } from '@/interfaces/orders.interface';
import { sendUpdateOrderStatusNotification } from '@/utils/notificationUtils';

@Service()
export class OrderService {
    public async findAllOrders(): Promise<Order[]> {
        const { rows } = await pg.query(`
            SELECT
                *
            FROM
                orders
        `);
        return rows;
    }

    public async findOrderById(orderId: number): Promise<Order> {
        const { rows, rowCount } = await pg.query(
            `
            SELECT
                *
            FROM
                orders
            WHERE
                id = $1
            `,
            [orderId],
        );
        if (!rowCount) throw new HttpException(409, "Order doesn't exist");
        return rows[0];
    }

    public async createOrder(orderData: Order): Promise<Order> {
        const { depositorId, depositeeId, package_id, status } = orderData;
        const { rows: createOrderData } = await pg.query(
            `
            INSERT INTO
                orders(
                    "depositor_id",
                    "depositee_id",
                    "package_id",
                    "status"
                )
            VALUES ($1, $2, $3, $4)
            RETURNING "id","depositor_id", "depositee_id", "package_id", "status"
            `,
            [depositorId, depositeeId, package_id, status],
        );
        return createOrderData[0];
    }

    public async updateOrder(orderId: number, orderData: Order): Promise<Order[]> {
        const { rows: findOrder } = await pg.query(
            `
            SELECT EXISTS(
                SELECT
                    "id"
                FROM
                    orders
                WHERE
                    "id" = $1
            )
            `,
            [orderId],
        );
        if (!findOrder[0].exists) throw new HttpException(409, "Order doesn't exist");

        const { depositorId, depositeeId, package_id, status } = orderData;
        const { rows: updateOrderData } = await pg.query(
            `
            UPDATE
                orders
            SET
                "depositor_id" = $2,
                "depositee_id" = $3,
                "package_id" = $4,
                "status" = $5
            WHERE
                "id" = $1
            RETURNING "depositor_id", "depositee_id", "package_id", "status"
            `,
            [orderId, depositorId, depositeeId, package_id, status],
        );

        await sendUpdateOrderStatusNotification(
            depositorId, 
            depositeeId, 
            package_id, 
            status
        );
        
        return updateOrderData;
    }

    public async updateOrderStatus(orderId: number, status: string): Promise<Order> {
        const { rows: findOrder } = await pg.query(
            `
            SELECT EXISTS(
                SELECT
                    "id"
                FROM
                    orders
                WHERE
                    "id" = $1
            )
            `,
            [orderId],
        );
        if (!findOrder[0].exists) throw new HttpException(409, "Order doesn't exist");

        const { rows: updatedOrder } = await pg.query(
            `
            UPDATE
                orders
            SET
                "status" = $2
            WHERE
                "id" = $1
            RETURNING "id", "depositor_id", "depositee_id", "package_id", "status"
            `,
            [orderId, status],
        );

        const updatedOrderData = updatedOrder[0];


        return updatedOrderData;
    }

    public async deleteOrder(orderId: number): Promise<Order[]> {
        const { rows: findOrder } = await pg.query(
            `
            SELECT EXISTS(
                SELECT
                    "id"
                FROM
                    orders
                WHERE
                    "id" = $1
            )
            `,
            [orderId],
        );
        if (!findOrder[0].exists) throw new HttpException(409, "Order doesn't exist");

        const { rows: deleteOrderData } = await pg.query(
            `
            DELETE
            FROM
                orders
            WHERE
                id = $1
            RETURNING "depositor_id", "depositee_id", "package_id", "status"
            `,
            [orderId],
        );
        return deleteOrderData;
    }
}
