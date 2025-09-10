import React from 'react';
import NavBar from '@/components/NavBar';
import FooterSection from '@/components/FooterSection';
import Cart from '@/components/Cart';

export default function CartPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <NavBar />
            <Cart />
            <FooterSection bgName="BG1" />
        </div>
    );
}
