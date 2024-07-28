import React, { useState, useEffect } from 'react';
import Nirek from "./nirek.png"
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
                            <img className="circular-image" src={Nirek} />
                            <div>Louis</div>
                        </>
                    }
                    
                    </div>
                    
                    <ul >
                        <li className="navbar-item">
                            <Link to="/Meditate" className="navbar-link">
                               
                                Meditate
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/about" className="navbar-link">
                              
                                Milestones
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/challenges" className="navbar-link">

                                Challenges
                            </Link>
                        </li>

                    </ul>
                </div>
            
            {user == "louis" && 
                
            }
        </>
        
    );
}
export default SideBar;