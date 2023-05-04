import express, { Request, Response } from "express";
import { Session } from "@prisma/client";
import { Product } from "@prisma/client";
import {
    adminLoginAuth,
    loginAuth,
    tabletMasterLoginAuth,
} from "../middleware/auth";
import { APIError, HttpErrorCode } from "../utils/errors";
import { handleLogin } from "../login/login.service";
import { body, validationResult } from "express-validator";

import * as OrderService from "./order.service";
import * as SessionService from "../session/session.service"
import * as OrderItemService from "../order-item/order-item.service"


export const orderRouter = express.Router();

orderRouter.get("/order/:id", async(request : Request, response : Response) => {
    const id: number = parseInt(request.params.id, 10);
    const order = await OrderService.getOrderById(id);
    if(order){
        return response.status(200).json(order);
    }

    throw new APIError(
        "Order not found",
        HttpErrorCode.NOT_FOUND,
        null
    );
});

orderRouter.post("/order",
            // Validates sessionId exists 
            body("seesionId").custom(async(sessionId) => {
                const session: Session | null = await SessionService.validateSessionId(sessionId)
                if(session){
                    return true;
                }
                return false;
            }),
            // Validates every OrderItem is valid
            body("orderItems").custom(async(orderItems) => {
                for(let i = 0; i < orderItems.length; i++){
                    let productId: number = orderItems[i].productId
                    let product: Product | null = await OrderItemService.validateOrderItem(productId)
                    if(product == null){
                        return false;
                    }
                }
                return true;
            }),
            // Creates the order
            async(request: Request, response: Response) => {
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        throw new APIError(
            "Verify the data and try again",
            HttpErrorCode.BAD_REQUEST,
            null
        );
    }

    const {sessionId, orderItems} = request.body;


    const savedOrder = await OrderService.createOrder({
        sessionId,
    }, orderItems);

    return response.status(201).json(savedOrder);
});

// TODO : update orderItem, method only adds an item to the order