import { NextResponse } from "next/server";
import User from '../../../../../models/user';
import dbConnect from '../../../../utils/dbConnect'
//import handler from "../../../../utils/handler";
//const {errorHandler} = require('../../../helpers/dbErrorHandler')

interface Body {
    username:string;
    email:string;
    password:string;
}

export async function POST(req:Request) {
    const reqData = await req.json()
    const {username, email, password}:Body = reqData

    dbConnect();

    try{
        const newUser = await User.create({username, email, password})
        return NextResponse.json({ message: 'Created user!', user:newUser });
    }catch(err:any){
        return NextResponse.json({ message: 'Error creating user!', error:err });
    }    
}

  //export const handledPost = handler.post(POST)