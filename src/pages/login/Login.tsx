import React from "react";
import "./Login.css";
// import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit";

const Login: React.FC = () => {
    // const navigate = useNavigate();
    const handleGoogleLogin = () => {
        console.log("Login with Google clicked");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="https://cryptologos.cc/logos/sui-sui-logo.png" />
                <h1 className="heading">BlockchainBard Decentralized Voting System on Sui</h1>
                <div className="connect-button-container">
                    <div>
                        <button className="google-login-button" onClick={handleGoogleLogin}>
                            Login with Google
                        </button>
                    </div>
                    <div>
                        <ConnectButton />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Login;
