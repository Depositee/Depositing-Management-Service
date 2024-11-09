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
        const { depositorId, depositeeId, package_id, package_name, package_description, package_weight, status, payment_type, payment_amount } = orderData;
        const { rows: createOrderData } = await pg.query(
            `
            INSERT INTO
                orders(
                    "depositor_id",
                    "depositee_id",
                    "package_id",
                    "package_name",
                    "package_description",
                    "package_weight",
                    "status",
                    "payment_type",
                    "payment_amount"
                )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING "id", "depositor_id", "depositee_id", "package_id", "package_name", "package_description", "package_weight", "status", "payment_type", "payment_amount"
            `,
            [depositorId, depositeeId, package_id, package_name, package_description, package_weight, status, payment_type, payment_amount],
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

        const { depositorId, depositeeId, package_id, package_name, package_description, package_weight, status } = orderData;
        const { rows: updateOrderData } = await pg.query(
            `
            UPDATE
                orders
            SET
                "depositor_id" = $2,
                "depositee_id" = $3,
                "package_id" = $4,
                "package_name" = $5,
                "package_description" = $6,
                "package_weight" = $7,
                "status" = $8
            WHERE
                "id" = $1
            RETURNING "depositor_id", "depositee_id", "package_id", "package_name", "package_description", "package_weight", "status"
            `,
            [orderId, depositorId, depositeeId, package_id, package_name, package_description, package_weight, status],
        );

        await sendUpdateOrderStatusNotification(depositorId, depositeeId, package_id, status);

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
            RETURNING "id", "depositor_id", "depositee_id", "package_id", "package_name", "package_description", "package_weight", "status", "payment_type", "payment_amount"
            `,
            [orderId, status],
        );

        const updatedOrderData = updatedOrder[0];

        return {
            depositorId: updatedOrderData.depositor_id,
            depositeeId: updatedOrderData.depositee_id,
            package_id: updatedOrderData.package_id,
            package_name: updatedOrderData.package_name,
            package_description: updatedOrderData.package_description,
            package_weight: updatedOrderData.package_weight,
            status: updatedOrderData.status,
            payment_type: updatedOrderData.payment_type,
            payment_amount: updatedOrderData.payment_amount
        };
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
            RETURNING "depositor_id", "depositee_id", "package_id", "package_name", "package_description", "package_weight", "status"
            `,
            [orderId],
        );
        return deleteOrderData;
    }

    public async getAllOrdersByDepositorId(targetDepositorId: string): Promise<Order[]> {
        const { rows } = await pg.query(
            `
            SELECT
                *
            FROM
                orders
            WHERE
                depositor_id = $1
            `,
            [targetDepositorId],
        );

        if (rows.length === 0) throw new HttpException(404, "No orders found for the specified depositor");

        return rows;
    }
}
