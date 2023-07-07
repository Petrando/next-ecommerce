import Link from "next/link";
import React from "react";
import { ProductList } from "@/components/ProductList";

const AdminPage = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-start">            
            <ProductList />
        </div> 
    );
};

export default AdminPage;
