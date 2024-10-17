// StartElectionPage.js
import React, { useState } from 'react';
import './StartElection.css';

const StartElectionPage = () => {
    const [endDate, setEndDate] = useState('');

    // Handle the form submission for starting an election
    const handleStartElection = (e : any) => {
        e.preventDefault();

        const endTimestamp = new Date(endDate).getTime() / 1000;

        const electionDetails = {
            endDate: endDate,
            endTimestamp: Math.floor(endTimestamp),
        };

        console.log("Election Start Details:", electionDetails);

        setEndDate('');
    };

    return (
        <div className="start-election-page">
            <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Blockchain Logo" />
            <h1 className="main-heading">BlockchainBard's Decentralized Election Start Page</h1>
            <h2>Start Election</h2>
            <form onSubmit={handleStartElection}>
                <div className="form-group">
                    <label htmlFor="endDate">End Date and Time:</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className='start-election-button-2'>Start Election</button>
            </form>
        </div>
    );
};

export default StartElectionPage;
