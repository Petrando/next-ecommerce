import mongoose, { Document, Model, model, Types, Schema, Query } from "mongoose"

export interface IProduct extends Document {
	itemName: string;
	itemDescription: string;
	price: number;
	category:{
		categoryId:Types.ObjectId;
		option?:{
			optionId:Types.ObjectId;
			subOption?:{
				subOptionId:Types.ObjectId;
			}
		}
	};
	stock: number;
	isNewItem: boolean;
	sold: number;
	productPic: string;
	shipping: boolean;
	rating: number;
	review: any[];
	isActive: boolean;
}

const productSchema:Schema<IProduct> = new Schema({
	itemName: {
		type: String,
		trim: true,
		required: true,
		maxlength: 32
	},
	itemDescription: {
		type: String,
		required: true,
		trim: true,		
	},
	price: {
		type: Number,
		required: true,
		trim: true,		
	},
	category: {
		categoryId: {
			type: Schema.Types.ObjectId,
			ref: 'Category',
			required: true
		},
		option: {
			optionId: {
				type: Schema.Types.ObjectId,
				ref: 'Category',
			},
			subOption : {
				subOptionId: {
					type: Schema.Types.ObjectId,
					ref: 'Category'	
				}
			}	
		}		
	},
	stock: {
		type: Number,
		default:0,
		required:true
	},
	isNewItem: {
		type: Boolean,
		default:true,
		required: true
	},
	sold: {
		type: Number,
		default: 0
	},	
	productPic: {
		type:String,
		default:''
	},
	shipping: {
		type: Boolean,
		default:false
	},
	rating: {
		type:Number,
		default:0
	},
	review: [

	],
	isActive: {
		type: Boolean,
		default: true,
		required: true
	}
	},
	{timestamps:true}
);	

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)