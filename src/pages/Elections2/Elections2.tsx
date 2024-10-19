import './Election2.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getElectionDetaisAndCandidates } from '../../utils';

// CandidateCard Component to display each candidate's details
const CandidateCard = ({ candidate }: any) => {
    return (
        <div className="candidate-card">
            <img src={candidate.image} alt={candidate.name} className="candidate-picture" />
            <h3>{candidate.name}</h3>
            <p>{candidate.description}</p>
            <p>Vote Count: {candidate.vote}</p>
        </div>
    );
};

// Main Component to display election details and list of candidates
const ElectionDetails = ({ election }: any) => {
    if (!election || Object.keys(election).length === 0) {
        return <div className="loading">
            <div className="loader"></div>
            <div className="loading-text">Wait a minute, Loading election details...</div>
        </div>;
    }

    const candidates = election.candidates || [];

    const correctedTimestamp = Math.floor(election.start_time / 1000); // Convert to seconds
    const startTime = new Date(correctedTimestamp * 1000).toLocaleString();
    // console.log(startTime);

    return (
        <div className="election-details">
            <h2>{election.election_name}</h2>
            <p>{election.description}</p>
            <p>{election.address}</p>
            <ul>
                <li>Number of Candidates: {candidates.length}</li>
                <li>Registered Voters: {election.number_of_registered_voters}</li>
                <li>Vote Count: {election.vote}</li>
                <li>Start Time: {startTime}</li>
                <li>End Time: {new Date(election.end_time * 1000).toLocaleString()}</li>
                <li>{election.election_status ? 'Election In Progress' : 'Election Ended'}</li>
            </ul>

            <div className="candidates-list">
                {candidates.map((candidate: any) => (
                    <CandidateCard key={candidate.address} candidate={candidate} />
                ))}
            </div>
        </div>
    );
};

// Candidate component with the heading and image
function Elections2() {
    const params = useParams();
    const electionId = params.id;

    const [sampleElection, setSampleElection] = useState({} as any);

    useEffect(() => {
        const getElectionInfo = async () => {
            try {
                const electinfo = await getElectionDetaisAndCandidates(electionId as string);
                if (electinfo) {
                    console.log(electinfo);
                    setSampleElection(electinfo);
                }
            } catch (error) {
                console.error('Error fetching election details:', error);
            }
        };

        if (electionId) {
            getElectionInfo();
        }
    }, [electionId]); // Add electionId as a dependency

    return (
        <div className="Candidates">
            {/* Heading Section */}
            <div className="heading-section">
                <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" />
                <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>

                <a href={`https://suiscan.xyz/devnet/object/${electionId}`} target="_blank" rel="noreferrer"><p className="election-address">{electionId}</p></a>
            </div>

            <ElectionDetails election={sampleElection} />
        </div>
    );
}

export default Elections2;
