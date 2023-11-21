import React, { createContext, useContext, useState } from 'react';

const Location = createContext(null);
const { Provider } = Location;

export const LocationContext = () => useContext(Location);

export const LocContext = ({ children }) => {
    const [mapState, setMapState] = useState(null);

    return (
        <Provider
            value={{
                mapState,
                setMapState,
            }}>
            {children}
        </Provider>
    );
};
