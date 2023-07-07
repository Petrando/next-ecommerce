'use client'

import { FunctionComponent, ReactNode } from 'react';

interface IPageContainer {
    children: ReactNode;
}
export const PageContainer:FunctionComponent<IPageContainer> = ({ children }) => {
    return (
        <div className="w-full max-w-screen-xl mx-auto px-6 bg-green-400">
            <div className="flex justify-center p-4 px-3 py-10">
                <div className="w-full max-w-screen-xl">
                    { children}
                </div>
            </div>
        </div>
    );
}