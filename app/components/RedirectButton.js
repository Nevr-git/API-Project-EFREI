"use client"

import { useRouter } from 'next/router';

const RedirectButton = () => {
    const router = useRouter();

    const handleRedirect = () => {
        // Use the router to redirect to the microservice
        router.push('http://localhost:3005/auth/google');
    };

    return (
        <button onClick={handleRedirect} className="add-todo">
            Login with Google
        </button>
    );
};

export default RedirectButton;