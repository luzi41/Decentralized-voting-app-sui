// RegisterPage.js
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import './RegisterPage.css';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { getCandidatesAndVoters, getElectionInfo, addCandidate, registerVoter } from '../../utils';

interface Candidate {
    address: string;
    name: string;
    description: string;
    image: string;
    vote : number
}

interface Voter {
    name: string;
    address: string;
    voted: boolean;
}

const RegisterPage = () => {
    const params = useParams();
    const  electionId  = params.id;

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

    const [electionName, setElectionName] = useState('');
    const [electionDescription, setElectionDescription] = useState('');

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [_digest, setDigest] = useState('');

    useEffect(() => {
        const getElections = async () => {
            const candidatesAndVoters = await getCandidatesAndVoters(electionId as string);
            setCandidates(candidatesAndVoters.candidates.map((candidate: any) => ({ ...candidate, vote: parseInt(candidate.vote) })));
            setVoters(candidatesAndVoters.voters);

            const electionInfo = await getElectionInfo(electionId as string);
            if (electionInfo) { 
                setElectionName(electionInfo.election_name);
                setElectionDescription(electionInfo.description);
            }
        };
        getElections();
    }, [candidates, voters]);

    const handleAddCandidate = async(e: any) => {
        e.preventDefault();
        const trx = await addCandidate(candidateName, candidateAddress, candidateDescription, candidateImage, electionId as string);
        signAndExecuteTransaction(
            {
                transaction: trx,
                chain: 'sui:devnet',
            },
            {
                onSuccess: (result) => {
                    // console.log('executed transaction', result);
                    console.log("Candidate Added:", candidateName);
                    setDigest(result.digest);
                },
            },
        );
        setCandidateName('');
        setCandidateAddress('');
        setCandidateImage('');
        setCandidateDescription('');
    };

    const handleRegisterVoter = async(e: any) => {
        e.preventDefault();
        const trx = await registerVoter(voterName, voterAddress, electionId as string);
        signAndExecuteTransaction(
            {
                transaction: trx,
                chain: 'sui:devnet',
            },
            {
                onSuccess: (result) => {
                    // console.log('executed transaction', result);
                    // console.log("Voter Added:", voterName);
                    setDigest(result.digest);
                },
            },
        );
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

            <h2 className="election-name">{ electionName}</h2>
            <p className="election-description">{ electionDescription }</p>
            <a href={`https://suiscan.xyz/devnet/object/${electionId}` } target="_blank" rel ="noreferrer"><p className="election-address">{electionId}</p></a>

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
                                        <p>{`0x${candidate.address}`}</p>
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
                                    <p className='voter-address'>{`0x${voter.address}`}</p>
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
