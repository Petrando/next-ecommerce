import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/utils/dbConnect';
import User from '../../models/user';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            // The credentials object is what's used to generate Next Auths default login page - We will not use it however.
            credentials: {
                username: {label: "Username", type: "username"},
                password: {label: "Password", type: "password"},
            },
            authorize:async(credentials) => {
                dbConnect()
                // Try to find the user and also return the password field
                const user = credentials?
                    await User.findOne({username: credentials.username}).select('+password'):false

                if(!user) { throw new Error('No user with a matching username was found.')}

                // Use the comparePassword method we defined in our user.js Model file to authenticate
                const pwValid = credentials?
                    await user.comparePassword(credentials.password):false

                if(!pwValid){ throw new Error("Your password is invalid") }

                return user
            },
        }),
    ],
    // All of this is just to add user information to be accessible for our app in the token/session
    callbacks: {
        // We can pass in additional information from the user document MongoDB returns
        // This could be avatars, role, display name, etc...
        async jwt({token, trigger, session, user}){            
            if (user) {
                token.user = {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    nik: user.nik,
                    profilePic: user.profilePic
                }
            }
           
            if(trigger === 'update' && session){
                if(session.profilePic){
                    token.user.profilePic = session.profilePic                    
                }
            }
            return token
        },
        // If we want to access our extra user info from sessions we have to pass it the token here to get them in sync:
        session: async({session, token}) => {
            if(token){
                session.user = token.user
            }
            return session
        }
    }, 
    pages: {
        // Here you can define your own custom pages for login, recover password, etc.
        signIn: '/login', // we are going to use a custom login page (we'll create this in just a second)
        error: '/',
        signOut: '/'
    }
};