
import React from "react";
import { getServerSession } from "next-auth/next";
import {redirect } from "next/navigation"
import { authOptions } from "@/lib/auth";
import { EditProductForm } from "@/components/admin/manage-products/edit-product";

const EditProduct = async () => {
    const session = await getServerSession(authOptions)
    
    if(!session || session.user.role === 'user'){
      redirect('/')
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <EditProductForm />
        </div>
    );
};

export default EditProduct;
