// CreateElectionPage.js
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './CreateElection.css';
import { createElection } from '../../utils';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';

const CreateElectionPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [_digest, setDigest] = useState('');
    // const currentAccount = useCurrentAccount();

    // Handle the form submission for creating an election

    const handleCreateElection = async (e : any) => {
        e.preventDefault();
        // console.log(currentAccount?.address)
        const newElection = {
            name: name,
            description: description,
        };
        const trx = await createElection(newElection.name, newElection.description);
        signAndExecuteTransaction(
            {
                transaction: trx,
                chain: 'sui:devnet',
            },
            {
                onSuccess: (result) => {
                    // console.log('executed transaction', result);
                    console.log("Election Created:", newElection);
                    navigate("/home");
                    setDigest(result.digest);
                },
            },
        );
        setName('');
        setDescription('');
    };

    return (
        <div className="create-election-page">
            <img className="main-image" src="https://cryptologos.cc/logos/sui-sui-logo.png" alt="https://cryptologos.cc/logos/sui-sui-logo.png" />
            <h1 className="main-heading">luzi's Decentralized Voting System Powered by Sui Blockchain</h1>
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
