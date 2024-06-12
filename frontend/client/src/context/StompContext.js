import {createContext, useContext, useEffect, useState} from 'react';
import {Client} from '@stomp/stompjs';

const StompContext = createContext(null);

export const StompProvider = ({children, wsURL}) => {
    const [client] = useState(new Client());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        client.configure({
            brokerURL: wsURL,
            debug: function (str) {
                console.log(str);
            },
            onConnect: () => {
                setIsInitialized(true);
            }
        });
        // client.activate();

        setIsInitialized(true);
        return () => {
            client && client.deactivate();
        };
    }, []);

    return (
        <StompContext.Provider value={{client, isInitialized}} >
            {children}
        </StompContext.Provider>
    );
};

export const useStompContext = () => useContext(StompContext);
