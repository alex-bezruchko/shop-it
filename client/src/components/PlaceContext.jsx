import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const PlaceContext = createContext({});

export function PlaceProvider({children}) {
    const [place, setPlace] = useState(null);

    return (
        <PlaceContext.Provider value={{ place, setPlace }}>
            {children}
        </PlaceContext.Provider>
    )
}
