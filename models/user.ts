import mongoose, { Document,  Schema} from "mongoose"
import bcrypt from 'bcrypt'
import validator from 'validator'

export interface IUser extends Document {
    email: string;
    username: string;  
    password: string;  
    profilePic: string;
    role: string; 
}

const userSchema:Schema<IUser> = new Schema({    
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    username: {
        type: String,
        required: true,             
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'user',
        enum: {
            values: [
                'user',
                'admin'
            ],
        }
    }   
},
    {
        timestamps: true
    }
)

// ENCRYPTION 
userSchema.pre<IUser>('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(enteredPassword:string){
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)