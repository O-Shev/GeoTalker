import {createContext, useContext, useEffect, useState} from "react";
import {getMe} from "../api/apiCore";


const context = createContext(null);
export const UserAccountProvider = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [userAccount, setUserAccount] = useState({});

    const loadUserAccount = () => {
        getMe()
            .then((response)=>{
                setIsAuthorized(true);
                console.log(response)
                response.data && setUserAccount(response.data)
            })
            .catch((response)=>{
                console.log(response)
                setIsAuthorized(false);
                setUserAccount({})
            })
    }

    useEffect(() => {
        loadUserAccount();
    }, []);
    
    
    
    return (
        <context.Provider value={{
            isAuthorized,
            userAccount,
            loadUserAccount
        }}>
            {children}
        </context.Provider>
    );
}

export const useUserAccountContext = () => useContext(context);