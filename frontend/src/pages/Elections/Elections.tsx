import React from "react";
import { useNavigate } from "react-router-dom";
import "./Elections.css";

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
    const navigate = useNavigate();

    const createdElections: Election[] = [
        { id: "1", name: "Presidential Election", status: "in-progress" },
        { id: "2", name: "Senatorial Election", status: "not started" },
        { id: "3", name: "Local Government Election", status: "ended" },
    ];

    const registeredElections: RegisteredElection[] = [
        { id: "1", name: "Presidential Election", status: "in-progress", voter_status: "not voted" },
        { id: "2", name: "Gubernatorial Election", status: "ended", voter_status: "voted" },
    ];

    const handleCreatedElectionClick = (id: string, electionStatus: string) => {
        if (electionStatus === "in-progress" || electionStatus === "ended") {
            navigate(`/election2/${id}`);
        }
        else if (electionStatus === "not started") {
            navigate(`/register/${id}`);
        }
        else {
            navigate(`/election/${id}`);
        }
    };

    const handleElectionClick = (id: string) => {
        navigate(`/election/${id}`);
    };

    const handleCreateElection = () => {
        navigate("/create-election");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ended":
                return "red";
            case "not voted":
                return "orange";
            case "not started":
                return "yellow";
            case "in progress":
            case "in-progress":
                return "green";
            case "voted":
                return "blue";
            default:
                return "gray";
        }
    };

    return (
        <div className="elections-container">
            {/* Heading for the voting system */}
            <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="https://cryptologos.cc/logos/sui-sui-logo.png" />
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
                            style={{ borderLeft: `6px solid ${getStatusColor(election.status)}`, borderRight: `6px solid ${getStatusColor(election.voter_status)}` }}
                            onClick={() => handleElectionClick(election.id)}
                        >
                            {/* {election.name}{" "} */}
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
