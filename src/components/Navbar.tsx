'use client' 
import React, { useState, useEffect, useRef, FunctionComponent, ReactNode } from 'react';
//import { getServerSession } from 'next-auth';
//import { authOptions } from '@/lib/auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/dist/client/components/navigation';
import { ChevUp, ChevDown } from './Icons';
import { ShopIcon } from './Icons/ShopIcon';
import { useContainerDimensions } from './hooks/useContainerDimensions';

interface ISession {
    //setNavHeight:(h:number)=>void;
    _id: string;
    username: string;
    role: string;
    profilePic:  string;
}

interface INavbar { 
    user:ISession | null;
}


interface INavItem {
    label: string;
    to: string; 
    condition: boolean;
    icon: null|ReactNode;
    onClick:()=>void;
    subMenu?:ISubNav[];
}

interface ISubNav {
    label: string;
    to: string; 
    icon: null|ReactNode;
    onClick:()=>void
}

export const Navbar:FunctionComponent = () => {
    const [ navbar, setNavbar ] = useState(false);
    const navRef = useRef(null);
    const pathname = usePathname()
    const { width, height } = useContainerDimensions(navRef);

    const { data: session, status } = useSession()

    const isAdmin = session && session.user.role === "admin"
    const isUser = session && session.user.role === "user"
    console.log('session : ', session)
    useEffect(()=>{
        //setNavHeight(height);
    }, [width, height])

    useEffect(()=>{
        setNavbar(false);        
    }, [/*location.pathname*/]);

    const navAdmin:INavItem[] = [
        {
            label:"Home",
            to:"/admin/home", 
            condition:true,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Categories",
            to:"/admin/category", 
            condition:true,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Log out",
            to:"#", 
            condition:session?true:false,
            icon:null,
            onClick:()=>{signOut({
                callbackUrl:'/'
            })}
        }
    ]

    const navUser:INavItem[] = [
        {
            label:"Home",
            to:"/", 
            condition:true,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Cart",
            to:"/user/cart", 
            condition:isUser?true:false,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"User Profile",
            to:"/user/profile", 
            condition:isUser?true:false,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Transactions",
            to:"/user/transactions", 
            condition:isUser?true:false,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Log out",
            to:"#", 
            condition:session?true:false,
            icon:null,
            onClick:()=>{signOut({
                callbackUrl:'/'
            })}
        },
        {
            label:"Log In",
            to:"/login", 
            condition:!session?true:false,
            icon:null,
            onClick:()=>{}
        },
        {
            label:"Register",
            to:"/register", 
            condition:!session?true:false,
            icon:null,
            onClick:()=>{}
        }
    ]

    const navItems:INavItem[] = !session?navUser:session?session.user.role==='admin'?navAdmin:navUser:navUser 

    return (
        <header className="bg-emerald-200" ref={navRef}>            
            <nav
                className="
                    flex flex-wrap
                    items-center
                    justify-between
                    w-full
                    py-4
                    md:py-0
                    px-4                    
                "
                >
                <div className="p-0 md:p-2 flex items-center justify center">
                    <div className="w-14 h-13 cursor-pointer">
                        <ShopIcon />
                    </div>
                </div>               
                <button
                    className="md:hidden p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick={() => setNavbar(!navbar)}
                >
                    {navbar ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    )}
                </button>
                
                <div className={`w-full md:flex md:items-center md:w-auto ${
                    navbar ? "block" : "hidden"
                }`} id="menu">
                    <ul
                        className="
                            pt-4                           
                            md:flex
                            md:justify-between 
                            md:pt-0"
                    >
                    {
                        navItems.map((menu, i)=>{                            
                            if(menu.condition){
                                return (
                                    <MenuItem
                                        key={menu.to}
                                        menu={menu}
                                        path={pathname?pathname:''}                                  
                                    />
                                );
                            }
                        })
                    }                 
                    </ul>
                </div>
            </nav>
        </header>
    );
}

interface IMenuItem {
    menu: INavItem;
    path: string;
}
const MenuItem:FunctionComponent<IMenuItem> = ({menu, path}) => {
    const [ showSubMenu, setShowSub ] = useState(false);

    const subMenuPaths = menu.subMenu?menu.subMenu.map(d=>d.to):[];
    const fontWeightActive = menu.subMenu?subMenuPaths.indexOf(path) >=0:path === menu.to;
    const fontWeightStyle = fontWeightActive?"font-bold":"font-base";
    const canHover = path!==menu.to;
    const fontStyle = fontWeightStyle + (canHover?" group-hover:text-purple-500":"");//menuActive?"font-bold":"font-base group-hover:text-purple-500";    

    const displayChev = () => {
        return (
             showSubMenu?<ChevUp />:<ChevDown />
        );
    }

    const menuLabel = () => {
        return (
            <span className={`flex text-base text-emerald-700 mr-1 ${fontStyle}`}>
                {menu.icon}{menu.label}{menu.subMenu && displayChev()}
            </span>
        );
    }

    const linkClass = `group text-white flex md:p-4 py-2 block`;

    return (
        <div 
            className="relative overflow-hidden md:overflow-visible flex flex-col h-fit md:h-full"            
            onMouseEnter={()=>{setShowSub(true);}}
            onMouseLeave={()=>{setShowSub(false);}}
            onTouchStart={()=>{setShowSub(true);}}
        >
            {
                menu.to === "/#"?
                    <div
                        key={menu.to}
                        className={linkClass}
                        onClick={menu.onClick}                                        
                    >
                    { 
                        menuLabel() 
                    }                   
                    </div>:
                        <Link
                            key={menu.to}
                            className={linkClass}
                            href={menu.to}
                            onClick={menu.onClick}                                        
                        >
                        { 
                            menuLabel() 
                        }                   
                        </Link>
            }
            
            {
                menu.subMenu && showSubMenu &&
                    <div    
                        className="z-50 w-full md:w-fit md:h-fit md:absolute md:top-full md:left-0 bg-emerald-200"
                    >
                        {
                            menu.subMenu.map((subMenu)=>{
                                const subMenuActive = path === subMenu.to;
                                const fontStyle = subMenuActive?"font-bold":"font-base group-hover:text-purple-500";
                                return (
                                    <Link
                                        key={subMenu.to}
                                        className={`group text-white flex md:p-4 py-2 block`}
                                        href={subMenu.to}
                                        onClick={subMenu.onClick}                                        
                                    >
                                        <span className={`flex text-base text-emerald-700 ml-2 md:ml-0 mr-1 ${fontStyle}`}>
                                            {subMenu.icon}{subMenu.label}
                                        </span>
                                    </Link>
                                )
                            })
                        }
                    </div>
            }
        </div>
    )
}