import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Splash = () => {
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleEnter = () => {
        navigate('/dashboard');
    };

    return (
        <div className="app-bg flex flex-col items-center justify-center">
            {/* Background Prismatic Strata moved to app-bg class and ::before pseudo-element */}

            {/* Content Layer */}
            <AnimatePresence>
                {mounted && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 text-center flex flex-col items-center gap-10 max-w-[800px] px-8"
                    >
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <img
                                src="/PREVENT logo.png"
                                alt="PREVENT Logo"
                                className="w-[clamp(80px,15vw,150px)] h-auto opacity-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            />
                        </div>

                        <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-extralight leading-[1.1] tracking-tight m-0 flex flex-col items-center gap-4">
                            <span className="text-[0.9rem] font-normal tracking-[1.2em] opacity-60 text-primary mb-4 uppercase">D A W N</span>
                            Welcome to your<br />
                            <span className="text-prismatic font-normal">new beginning.</span>
                        </h1>

                        <p className="text-lg opacity-50 font-light tracking-wide">
                            Personalized Wellness, Illuminated.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05, letterSpacing: '0.2em' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleEnter}
                            className="dawn-button mt-4"
                        >
                            ENTER
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-8 text-[0.7rem] opacity-30 tracking-widest uppercase">
                © 2026 PREVENT. All Rights Reserved.
            </div>
        </div>
    );
};

export default Splash;
