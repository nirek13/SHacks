import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import DashboardJournal from './DashboardJournal';
const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem("username");
        setUser(username);
    }, []);

    console.log(user);

    return (
        <>
        { !user &&
            <div>not signed in</div>
        }
        { user &&
            <div className="dashboard">
                <header className="header">
                    <h1>Mirror</h1>
                </header>
                {user === "nirek" &&
                    <div className="user-section">
                        <h2>Hello, Nirek!</h2>
                    </div>
                }
                {user === "louis" &&
                    <div className="user-section">
                        <h2>Hello, Louis!</h2>
                    </div>
                }
                <section className="affirmations">
                    <h2>Daily Affirmations</h2>
                    <p>"You are capable of amazing things."</p>
                    <p>"Believe in yourself and all that you are."</p>
                    <p>"Every day is a second chance."</p>
                </section>
                <section className="mood-tracker">
                    <DashboardJournal />
                </section>
                <section className="tips">
                    <h2>Mental Health Tips</h2>
                    <ul>
                        <li>Take regular breaks and relax.</li>
                        <li>Stay connected with friends and family.</li>
                        <li>Practice mindfulness and meditation.</li>
                        <li>Exercise regularly.</li>
                    </ul>
                </section>
            </div>
        }
        </>
    );
};

export default Home;
