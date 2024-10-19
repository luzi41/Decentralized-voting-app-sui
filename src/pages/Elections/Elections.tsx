import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Elections.css";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { userElections } from "../../utils";

interface Election {
    id: string;
    name: string;
    status: "ended" | "not started" | "in-progress" | "voted";
}

interface RegisteredElection {
    id: string;
    name: string;
    status: "in-progress" | "ended" | "not started";
    voter_status: "voted" | "not voted";
}

const Elections: React.FC = () => {
    const currentAccount = useCurrentAccount();
    const navigate = useNavigate();
    const [createdElections, setCreatedElections] = useState<Election[]>([]);
    const [registeredElections, setRegisteredElections] = useState<RegisteredElection[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetching elections
    useEffect(() => {
        if (currentAccount) {
            const getElections = async () => {
                setLoading(true);
                try {
                    const elections = await userElections(currentAccount.address);
                    setCreatedElections(elections.created_elections as Election[]);
                    setRegisteredElections(elections.elections_involved as RegisteredElection[]);
                    // console.log(elections);
                } finally {
                    setLoading(false);
                }
            };

            getElections();
        }
    }, [currentAccount]);

    const handleCreatedElectionClick = useCallback(
        (id: string, electionStatus: string) => {
            console.log(id);
            if (electionStatus === "in-progress" || electionStatus === "ended") {
                navigate(`/election2/${id}`);
            } else if (electionStatus === "not started") {
                navigate(`/register/${id}`);
            } else {
                navigate(`/election/${id}`);
            }
        },
        [navigate]
    );

    const handleElectionClick = useCallback(
        (id: string, electionStatus: string) => {
            if (electionStatus === "not started") { 

            } else {
                navigate(`/election/${id}`);
            }
        },
        [navigate]
    );

    const handleCreateElection = useCallback(() => {
        navigate("/create-election");
    }, [navigate]);

    const getStatusColor = useCallback((status: string) => {
        switch (status) {
            case "ended":
                return "red";
            case "not voted":
                return "orange";
            case "not started":
                return "yellow";
            case "in-progress":
            case "in progress":
                return "green";
            case "voted":
                return "blue";
            default:
                return "gray";
        }
    }, []);

    if (loading) {
        return <div className="loading">
            <div className="loader"></div>
            <div className="loading-text">Wait a minute, Loading elections...</div>
        </div>
    }

    return (
        <div className="elections-container">
            {/* Heading for the voting system */}
            <img
                className="main-image"
                src="https://cryptologos.cc/logos/sui-sui-logo.png"
                alt="Sui Logo"
            />
            <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>

            <button className="create-election-button" onClick={handleCreateElection}>
                Create Election
            </button>

            <div className="elections-list">
                <h2>Created Elections</h2>
                <ul>
                    {createdElections.map((election) => (
                        <li
                            key={election.id}
                            className="election-item"
                            style={{ borderLeft: `6px solid ${getStatusColor(election.status)}` }}
                            onClick={() => handleCreatedElectionClick(election.id, election.status)}
                        >
                            <span className="election-name-main">{election.name}</span>
                            <span className="election-status">{election.status}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="elections-list">
                <h2>Elections Registered In</h2>
                <ul>
                    {registeredElections.map((election) => (
                        <li
                            key={election.id}
                            className="election-item"
                            style={{
                                borderLeft: `6px solid ${getStatusColor(election.status)}`,
                                borderRight: `6px solid ${getStatusColor(election.voter_status)}`,
                            }}
                            onClick={() => handleElectionClick(election.id, election.status)}
                        >
                            <span className="election-name-main">{election.name}</span>
                            <span className="election-status">
                                Status: {election.status} | Voter Status: {election.voter_status}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Elections;
