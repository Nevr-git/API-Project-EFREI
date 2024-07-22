"use client"



const RedirectButton = () => {

    return (
        <button className="add-todo">
            <a href="http://localhost:3005/auth/google" style={{ textDecoration: 'none', color: 'inherit' }}>
                Login with Google
            </a>
        </button>
    );
};

export default RedirectButton;