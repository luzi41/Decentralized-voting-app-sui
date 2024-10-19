import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './Candidates.css';
import { getElectionDetaisAndCandidates, vote, voterStatus } from '../../utils';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';

// CandidateCard Component to display each candidate's details with a Vote button
const CandidateCard = ({ candidate, handleVote, hasVoted }: any) => {
    return (
        <div className="candidate-card">
            <img src={candidate.image} alt={candidate.name} className="candidate-picture" />
            <h3>{candidate.name}</h3>
            <p>{candidate.description}</p>
            <p>Vote Count: {candidate.vote}</p>
            {!hasVoted && <button onClick={() => handleVote(candidate.address)}>Vote</button>}
        </div>
    );
};

// Main Component to display election details and list of candidates
const ElectionDetails = ({ election, hasVoted, setHasVoted }: any) => {
    if (!election || !election.candidates) {
        return <div className="loading">
            <div className="loader"></div>
            <div className="loading-text">Wait a minute, Loading election details...</div>
        </div>
    }

    const candidates = election.candidates;

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [_digest, setDigest] = useState('');

    const correctedTimestamp = Math.floor(election.start_time / 1000); // Convert to seconds
    const startTime = new Date(correctedTimestamp * 1000).toLocaleString();

    // Handle vote button click
    const handleVote = async (candidateId: any) => {
        const userConfirmed = window.confirm("Are you sure you want to vote for this candidate?");
        if (userConfirmed) {
            try {
                const trx = await vote(`0x${candidateId}`, election.address);
                signAndExecuteTransaction(
                    {
                        transaction: trx,
                        chain: 'sui:devnet',
                    },
                    {
                        onSuccess: async (result) => {
                            console.log("Voted successfully:", candidateId);
                            setDigest(result.digest);
                            setHasVoted(true);
                        },
                        onError: (error) => {
                            console.error("Transaction failed:", error);
                        }
                    }
                );
            } catch (error) {
                console.error("Error during vote transaction:", error);
            }
        }
    };

    return (
        <div className="election-details">
            <h2>{election.election_name}</h2>
            <p>{election.description}</p>
            <p>{election.address}</p>
            <ul>
                <li>Number of Candidates: {election.num_candidates}</li>
                <li>Registered Voters: {election.number_of_registered_voters}</li>
                <li>Vote Count: {election.vote}</li>
                <li>Start Time: {startTime}</li>
                <li>End Time: {new Date(election.end_time * 1000).toLocaleString()}</li>
                <li>{election.election_status ? 'Election In Progress' : 'Election Ended'}</li>
            </ul>

            <div className="candidates-list">
                {candidates.map((candidate: any) => (
                    <CandidateCard key={candidate.address} candidate={candidate} handleVote={handleVote} hasVoted={hasVoted} />
                ))}
            </div>
        </div>
    );
};

// Candidate component with the heading and image
function Candidates() {
    const params = useParams();
    const electionId = params.id;

    const [sampleElection, setSampleElection] = useState({} as any);
    const [hasVoted, setHasVoted] = useState(false);
    const currentAccount = useCurrentAccount(); // Extract outside useEffect to avoid issues

    useEffect(() => {
        const getElectionInfo = async () => {
            try {
                // Ensure current account is loaded properly
                if (currentAccount) {
                    const voter_status = await voterStatus(electionId as string, currentAccount.address);
                    // console.log(voter_status);
                    if (voter_status) {
                        setHasVoted(voter_status);
                    }
                }  

                const electinfo = await getElectionDetaisAndCandidates(electionId as string);
                if (electinfo) {
                    setSampleElection(electinfo);
                }
            } catch (error) {
                console.error("Error fetching election information:", error);
            }
        };

        // Call function if currentAccount is available
        if (currentAccount) {
            getElectionInfo();
        }
    }, [electionId, hasVoted]);  // Added currentAccount to dependency array

    return (
        <div className="Candidates">
            {/* Heading Section */}
            <div className="heading-section">
                <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="Sui Logo" />
                <h1 className="main-heading">BlockchainBard's Decentralized Voting System Powered by Sui Blockchain</h1>

                <a href={`https://suiscan.xyz/devnet/object/${electionId}`} target="_blank" rel="noreferrer"><p className="election-address">{electionId}</p></a>
            </div>

            {/* Election Details */}
            <ElectionDetails election={sampleElection} hasVoted={hasVoted} setHasVoted={setHasVoted} />
        </div>
    );
}

export default Candidates;
