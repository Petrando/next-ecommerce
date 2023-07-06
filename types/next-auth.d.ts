import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            _id: string,
            username: string,
            nik: string,
            role: string,
            profilePic: string
        },
        token: {
            user: {
                _id: string,
                username: string,
                nik: string,
                role: string,
                profilePic: string
            }
        }
    }
    
    interface User {
        _id: string,
        username: string,
        nik: string,
        role: string,
        profilePic: string
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        user: {
            _id: string,
            username: string,
            nik: string,
            role: string,
            profilePic: string
        },
        token: {
            user: {
                _id: string,
                username: string,
                nik: string,
                role: string,
                profilePic: string
            }
        }
    }
  }