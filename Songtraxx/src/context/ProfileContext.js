import React, { createContext, useContext, useState } from 'react';

const profile = createContext(null);
const { Provider } = profile;

export const ProfileContext = () => useContext(profile);

export const ProfileContexts = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('');

  return (
    <Provider
      value={{
        currentUser,
        setCurrentUser,
      }}>
      {children}
    </Provider>
  );
};
