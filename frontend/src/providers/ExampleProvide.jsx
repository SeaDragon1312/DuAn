import React, { createContext, useState } from 'react';

export const ExampleContext = createContext();

const ExampleProvider = ({ children }) => {
    const [exampleState, setExampleState] = useState('example');

    return (
        <ExampleContext.Provider value={{ exampleState, setExampleState }}>
            {children}
        </ExampleContext.Provider>
    );
};

export default ExampleProvider;