/* eslint-disable prettier/prettier */
import { NOTIFICATION_SERVICE_API } from "@/config";
import axios from "axios";

export const sendUpdateOrderStatusNotification = (
    depositor_id: string, 
    depositee_id: string, 
    package_id: string, 
    status: string 
) => {
    let message = "";

    switch (status) {
        case "placed":
            break;
        case "reserved":
            message = `Your order with package ID ${package_id} has been reserved by depositee ID ${depositee_id}.`;
            sendNotification(depositor_id, package_id, message);
            break;
        case "received":
            message = `Your order with package ID ${package_id} has been received by the depositee ID ${depositee_id}. please contact to get your packages`;
            sendNotification(depositor_id, package_id, message);
            break;
        case "completed":
            message = `Your order with package ID ${package_id} has been completed.`;
            sendNotification(depositor_id, package_id, message);
            sendNotification(depositee_id, package_id, message);
            break;
        default:
            return;  
    }
};
const sendNotification = async(userId : string , packageId : string , message : string) =>{
    try {
        const notificationData = {
            userId: userId,  
            packageId: packageId,
            message: message,  
        };
        const response = await axios.post(NOTIFICATION_SERVICE_API, notificationData);
        return response
    } catch (error) {
        console.error('Error creating notification:', error.response?.data || error.message);
    }
}