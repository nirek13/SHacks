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
            
            {user == "nirek" && 
                <>
                    <img src="./nirek.png" />
                    <div>nirek</div>
                </>
            }
            {user == "louis" && 
                <div>
                    <img className="circular-image" src={Nirek} />

                    <ul className={`navbar-menu`}>
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
            }
        </>
        
    );
}
export default SideBar;