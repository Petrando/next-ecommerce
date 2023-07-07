
import React from "react";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next";
import {redirect } from "next/navigation"
import { authOptions } from "@/lib/auth";

import { CategoryList } from "@/components/admin/manage-category";

const CategoryPage = async () => {
    const session = await getServerSession(authOptions)
    console.log('session in server page : ', session)
    return (
        <CategoryList />
    );
};
/*

export async function getServerSideProps(context:GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) {
    return {
      props: {
        session: await getServerSession(
          context.req,
          context.res,
          authOptions
        ),
      },
    }
  }
*/
export default CategoryPage;
