import mongoose, { Document, Types, Schema } from "mongoose"
import { cartItemSchema, ICartItem } from "./cartItem"

interface IOrder {
    products: ICartItem[];
    transaction_id: {};
    amount: number;
    address: string;
    status: "Not processed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";    
    user: Types.ObjectId;
}

const orderSchema:Schema<IOrder> = new Schema({
    products: [cartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"] // enum means string objects
    },
    user: { type: Schema.Types.ObjectId, ref: "User" }
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)