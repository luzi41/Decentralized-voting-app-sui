// Candidate.js
import React, { useState } from 'react';
import './Election2.css';

// CandidateCard Component to display each candidate's details with a Vote button
const CandidateCard = ({ candidate}: any) => {
    return (
        <div className="candidate-card">
            <img src={candidate.picture} alt={candidate.name} className="candidate-picture" />
            <h3>{candidate.name}</h3>
            <p>{candidate.description}</p>
            <p>Vote Count: {candidate.vote_count}</p>
        </div>
    );
};

// Main Component to display election details and list of candidates
const ElectionDetails = ({ election }: any) => {
    const [candidates, setCandidates] = useState(election.candidates);

    // Handle vote button click
    const handleVote = (candidateId: any) => {
        const updatedCandidates = candidates.map((candidate: any) => {
            if (candidate.candidate_id === candidateId) {
                return {
                    ...candidate,
                    vote_count: candidate.vote_count + 1, // Increment vote count
                };
            }
            return candidate;
        });
        setCandidates(updatedCandidates);
    };

    return (
        <div className="election-details">
            <h2>{election.election_name}</h2>
            <p>{election.description}</p>
            <p>{election.address}</p>
            <ul>
                <li>Number of Candidates: {candidates.length}</li>
                <li>Registered Voters: {election.number_of_registered_voters}</li>
                <li>Vote Count: {election.vote_count}</li>
                <li>Start Time: {new Date(election.election_start_time).toLocaleString()}</li>
                <li>End Time: {new Date(election.election_end_time).toLocaleString()}</li>
                <li>Election In Progress: {election.election_in_progress ? 'Yes' : 'No'}</li>
                <li>Election Taken Place: {election.election_taken_place ? 'Yes' : 'No'}</li>
            </ul>

            <div className="candidates-list">
                {candidates.map((candidate: any) => (
                    <CandidateCard key={candidate.candidate_id} candidate={candidate}/>
                ))}
            </div>
        </div>
    );
};

// Sample data for the election and candidates
const sampleElection = {
    election_name: 'Presidential Election 2024',
    description: 'The election for the president of the country.',
    address: "0x1234567890123456789012345678901234567890",
    number_of_registered_voters: 500000,
    vote_count: 300000,
    election_start_time: '2024-10-10T08:00:00',
    election_end_time: '2024-10-10T20:00:00',
    election_in_progress: true,
    election_taken_place: true,
    candidates: [
        {
            candidate_id: 1,
            name: 'John Doe',
            description: 'A visionary leader with experience.',
            picture: 'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg',
            vote_count: 150000
        },
        {
            candidate_id: 2,
            name: 'Jane Smith',
            description: 'Focused on economic growth and social justice.',
            picture: 'https://via.placeholder.com/150',
            vote_count: 120000
        },
        {
            candidate_id: 3,
            name: 'Alan Brown',
            description: 'Promising healthcare reforms and better education.',
            picture: 'https://via.placeholder.com/150',
            vote_count: 30000
        },
        {
            candidate_id: 4,
            name: 'John Doe',
            description: 'A visionary leader with experience.',
            picture: 'https://via.placeholder.com/150',
            vote_count: 150000
        },
        {
            candidate_id: 5,
            name: 'Jane Smith',
            description: 'Focused on economic growth and social justice.',
            picture: 'https://via.placeholder.com/150',
            vote_count: 120000
        },
        {
            candidate_id: 6,
            name: 'Alan Brown',
            description: 'Promising healthcare reforms and better education.',
            picture: 'https://via.placeholder.com/150',
            vote_count: 30000
        }
    ]
};

// Candidate component with the heading and image
function Elections2() {
    return (
        <div className="Candidates">
            {/* Heading Section */}
            <div className="heading-section">
                <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" />
                <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>
            </div>

            {/* Election Details */}
            <ElectionDetails election={sampleElection} />
        </div>
    );
}

export default Elections2;
