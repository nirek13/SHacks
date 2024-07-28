import React, { useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
    const frontpageRef = useRef(null);
    const fullnameRef = useRef(null);
    let thread = null;

    useEffect(() => {
        const frontpage = frontpageRef.current;
        const fullname = fullnameRef.current;
        const isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;

        if (!isTouchDevice && frontpage && fullname) {
            const xOrigin = frontpage.offsetWidth / 2;
            const yOrigin = frontpage.offsetHeight / 2;

            const onMouseMove = (e) => {
                transform(((e.clientY - yOrigin) / yOrigin * -15 + 10), ((e.clientX - xOrigin) / xOrigin * 15));
                clearTimeout(thread);
                thread = setTimeout(onMouseStop, 1500);
            };

            const onMouseStop = () => {
                transform(0, 0);
            };

            const transform = (xRot, yRot) => {
                fullname.style.transform = `perspective(1000px) rotateX(${yRot * 0.4}deg) rotateY(${xRot * 0.4}deg)`;
                fullname.style.filter = `drop-shadow(clamp(-8px, ${yRot * -0.5}px, 8px) clamp(-8px, ${xRot * 0.5}px, 8px) 0px var(--name-shadow))`;
            };

            frontpage.addEventListener('mousemove', onMouseMove);

            return () => {
                frontpage.removeEventListener('mousemove', onMouseMove);
            };
        }
    }, []);

    return (
        <div id="frontpage" ref={frontpageRef} className="home-container">
            <h1 id="fullname" ref={fullnameRef}>Welcome to the Oasis</h1>
        </div>
    );
};

export default Home;
