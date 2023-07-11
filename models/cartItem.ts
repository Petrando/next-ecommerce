import mongoose, { Document, Types, Schema } from "mongoose"

export interface ICartItem extends Document {
    product:Types.ObjectId;
    name: string;
    price: number;
    count: number;
}

export const cartItemSchema:Schema<ICartItem> = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        count: Number
      },
      { timestamps: true }
)

export default mongoose.models.CartItem || mongoose.model<ICartItem>('CartItem', cartItemSchema)