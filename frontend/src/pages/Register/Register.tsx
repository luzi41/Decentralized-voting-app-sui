// RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './RegisterPage.css';

interface Candidate {
  name: string;
  image: string;
  description: string;
  address: string;
}

interface Voter {
  name: string;
  address: string;
}

const RegisterPage = () => {

    const navigate = useNavigate();
    // const [candidates, setCandidates] = useState([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [voters, setVoters] = useState<Voter[]>([]);

    const [candidateName, setCandidateName] = useState('');
    const [candidateAddress, setCandidateAddress] = useState('');
    const [candidateImage, setCandidateImage] = useState('');
    const [candidateDescription, setCandidateDescription] = useState('');
    const [voterName, setVoterName] = useState('');
    const [voterAddress, setVoterAddress] = useState('');

    const handleAddCandidate = (e : any ) => {
        e.preventDefault();
        const newCandidate = {
            name: candidateName,
            image: candidateImage,
            description: candidateDescription,
            address: candidateAddress
        };
        setCandidates([...candidates, newCandidate]);
        setCandidateName('');
        setCandidateAddress('');
        setCandidateImage('');
        setCandidateDescription('');
    };

    const handleRegisterVoter = (e : any) => {
        e.preventDefault();
        const newVoter = {
            name: voterName,
            address: voterAddress,
        };
        setVoters([...voters, newVoter]);
        setVoterName('');
        setVoterAddress('');
    };

    const handleStartElection = () => {
        navigate("start-election");
    };

    return (
        <div className="register-page">
            <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" />
            <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>

            <h2 className="election-name">Presidential Election 2024</h2>
            <p className="election-description">The election for the president of the country.</p>
            <p className="election-address">0x48dfdd7c1acb1b4919e1b4248206af584bef882f126f1733521ac41eb13fb77b</p>

            <button className="start-election-button" onClick={handleStartElection}>
                Start Election
            </button>

            <div className="sections-container">
                {/* Candidates Section */}
                <div className="section">
                    <h2>Add Candidate</h2>
                    <form onSubmit={handleAddCandidate}>
                        <div className="form-group">
                            <label htmlFor="candidateName">Name:</label>
                            <input
                                type="text"
                                id="candidateName"
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateAddress">Address:</label>
                            <input
                                type="text"
                                id="candidateAddress"
                                value={candidateAddress}
                                onChange={(e) => setCandidateAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateImage">Image URL:</label>
                            <input
                                type="text"
                                id="candidateImage"
                                value={candidateImage}
                                onChange={(e) => setCandidateImage(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="candidateDescription">Description:</label>
                            <textarea
                                id="candidateDescription"
                                value={candidateDescription}
                                onChange={(e) => setCandidateDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className='register-button'>Add Candidate</button>
                    </form>

                    {/* Registered Candidates */}
                    <div className="list-section">
                        <h2>Registered Candidates</h2>
                        <ul>
                            {candidates.map((candidate, index) => (
                                <li key={index}>
                                    <img src={candidate.image} alt={candidate.name} className="candidate-image-m" />
                                    <div>
                                        <strong>{candidate.name}</strong>
                                        <p>{candidate.description}</p>
                                        <p>{candidate.address}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Voters Section */}
                <div className="section">
                    <h2>Register Voter</h2>
                    <form onSubmit={handleRegisterVoter}>
                        <div className="form-group">
                            <label htmlFor="voterName">Name:</label>
                            <input
                                type="text"
                                id="voterName"
                                value={voterName}
                                onChange={(e) => setVoterName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="voterAddress">Address:</label>
                            <input
                                type="text"
                                id="voterAddress"
                                value={voterAddress}
                                onChange={(e) => setVoterAddress(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className='register-button'>Register Voter</button>
                    </form>

                    {/* Registered Voters */}
                    <div className="list-section">
                        <h2>Registered Voters</h2>
                        <ul>
                            {voters.map((voter, index) => (
                                <li key={index}>
                                    <strong>{voter.name}</strong>
                                    <p className='voter-address'>{voter.address}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
