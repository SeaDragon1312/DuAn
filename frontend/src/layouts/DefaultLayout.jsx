import React from 'react';

const DefaultLayout = ({ children }) => {
    return (
        <div>
            <header>
                <h1>My MERN App</h1>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>&copy; 2025 My MERN App</p>
            </footer>
        </div>
    );
};

export default DefaultLayout;