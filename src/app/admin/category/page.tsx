
import React from "react";
import { getServerSession } from "next-auth/next";
import {redirect } from "next/navigation"
import { authOptions } from "@/lib/auth";

import { CategoryList } from "@/components/admin/manage-category";

const CategoryPage = async () => {
    const session = await getServerSession(authOptions)
    
    if(!session || session.user.role === 'user'){
      redirect('/')
    }
    return (
        <CategoryList />
    );
};

export default CategoryPage;
