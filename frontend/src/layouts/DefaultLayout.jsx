import React from 'react';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';

const DefaultLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default DefaultLayout;