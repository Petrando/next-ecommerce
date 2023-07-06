import mongoose, { Document,  Schema} from "mongoose"

export interface ISubOption {
	category: string;
}

export interface IOption {
	category: string;
	options?: ISubOption[];
}

export interface iCategory extends Document {
	category: string;
	options?: IOption[];
}

const categorySchema:Schema<iCategory> = new Schema({
	category: {
		type:String,
		required:true
	},
	options:[
		{
			category: {
				type: String,
				required:true,
			},
			options: [{
				category : {
					type: String
				}
			}]
		}
	]
});	

export default mongoose.models.Category || mongoose.model<iCategory>('Category', categorySchema)