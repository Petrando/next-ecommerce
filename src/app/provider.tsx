'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { CartContext } from '@/context/cartContext';
type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
    const [itemCount, setCount] = useState(0);
    const [ productToDelete, setToDelete ] = useState(null); 
    return <SessionProvider>{children}</SessionProvider>;
};
