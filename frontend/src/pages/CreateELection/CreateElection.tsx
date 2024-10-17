// CreateElectionPage.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './CreateElection.css';

const CreateElectionPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Handle the form submission for creating an election
    const handleCreateElection = (e : any) => {
        e.preventDefault();

        // Logic for creating election (you can replace this with API call)
        const newElection = {
            name: name,
            description: description,
        };

        console.log("Election Created:", newElection);

        navigate("/home");
        // Reset form fields
        setName('');
        setDescription('');
    };

    return (
        <div className="create-election-page">
            <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="https://cryptologos.cc/logos/sui-sui-logo.png" />
            <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>
            <h2>Create Election</h2>
            <form onSubmit={handleCreateElection}>
                <div className="form-group">
                    <label htmlFor="electionName">Election Name:</label>
                    <input
                        type="text"
                        id="electionName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="electionDescription">Description:</label>
                    <textarea
                        id="electionDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className='create-election-button-2'>Create Election</button>
            </form>
        </div>
    );
};

export default CreateElectionPage;
