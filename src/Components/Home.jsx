import React, { useEffect, useRef, useState } from 'react';
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const username = localStorage.getItem("username")
        setUser(username)
    }, []);
    console.log(user)
    return (
        <>
            
            {user == "nirek" && 
                <div>nirek</div>
            }
            {user == "louis" && 
                <div>louis</div>
            }
        </>
        
    );
};

export default Home;
