// StartElectionPage.js
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import './StartElection.css';
import { startElection } from '../../utils';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

const StartElectionPage = () => {

    const navigate = useNavigate();
    const [endDate, setEndDate] = useState('');

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [_digest, setDigest] = useState('');
    
    const params = useParams();
    const electionId = params.id;

    // Handle the form submission for starting an election
    const handleStartElection = async(e : any) => {
        e.preventDefault();

        const endTimestamp = new Date(endDate).getTime() / 1000;

        const trx = await startElection(electionId as string, Math.floor(endTimestamp));
        signAndExecuteTransaction(
            {
                transaction: trx,
                chain: 'sui:devnet',
            },
            {
                onSuccess: (result) => {
                    // console.log('executed transaction', result);
                    console.log("Election Started, ends in :", Math.floor(endTimestamp));
                    navigate("/home");
                    setDigest(result.digest);
                },
            },
        );
        
        // navigate("/home");

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
