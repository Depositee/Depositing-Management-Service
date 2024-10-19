/* eslint-disable prettier/prettier */
import { NOTIFICATION_SERVICE_API } from "@/config";
import axios from "axios";

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