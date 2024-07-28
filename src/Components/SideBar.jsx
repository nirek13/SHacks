import React, { useState, useEffect } from 'react';
import Nirek from "./nirek.png"
import Louis from "./louis.png"
import { Link } from 'react-router-dom';

import './sidebar.css'
const SideBar = () => { 
    const [user, setUser] = useState(null);
    useEffect(() => {
        const username = localStorage.getItem("username")
        setUser(username)
    }, []);
    console.log(user)
    return (
        <>
            <div className={`navbar-menu`}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                    {user == "nirek" && 
                        <>
                            <img className="circular-image" src={Nirek} />
                            <div>Nirek</div>
                        </>
                    }
                    {user == "louis" && 
                        <>
                            <img className="circular-image" src={Louis} />
                            <div>Louis</div>
                        </>
                    }
                    
                    </div>
                    
                    <ul >
                        <li className="navbar-item">
                            <Link to="/" className="navbar-link">
                            
                                Home
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/Meditate" className="navbar-link">
                               
                                Meditate
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/journal" className="navbar-link">
                              
                                Journal
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/challenges" className="navbar-link">

                                Challenges
                            </Link>
                        </li>
                        { !user && 
                            <li className="navbar-item">
                            <Link to="/login" className="navbar-link">
                               
                                Login
                            </Link>
                        </li>
                        }
                        

                    </ul>
                </div>
            
 
        </>
        
    );
}
export default SideBar;