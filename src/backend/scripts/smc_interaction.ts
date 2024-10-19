import { bcs, fromHex, toHex } from "@mysten/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, USERS_ID } from "../utils/smc_address.json";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromB64 } from "@mysten/sui/utils";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

export class SMCInteraction {
    private keypair: Ed25519Keypair;
    private client: SuiClient;
    private Address;
    constructor() {
        const privateKey = import.meta.env.VITE_PRIVATE_KEY;

        if (!privateKey) {
            throw new Error("Please set your private key in a .env file");
        }
        const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey).slice(1));
        const rpcUrl = getFullnodeUrl("devnet");
        this.keypair = keypair;
        this.client = new SuiClient({ url: rpcUrl });
        this.Address = bcs.bytes(32).transform({
            input: (val: string) => fromHex(val),
            output: (val) => toHex(val),
        });
    }

    /**
     * Inspects the given transaction using the Sui client's devInspectTransactionBlock function
     * @param {Transaction} transaction the transaction to inspect
     * @returns {Promise<(Uint8Array[][] | null)>} an array of return values of the transaction, or null if there was an error
     */
    private async devInspectTransactionBlock(transaction: Transaction): Promise<(any | null)> {
        try {
            const result = await this.client.devInspectTransactionBlock({
                transactionBlock: transaction,
                sender: this.keypair.getPublicKey().toSuiAddress(),
            });
            const returnValues = result.results ? result.results.map(result => result.returnValues) : [];
            return returnValues;
        } catch (error) {
            console.error("Error executing transaction:", error);
            return null; // Return false in case of an exception
        }
    }

    private async signAndExecuteTransaction(transaction: Transaction): Promise<boolean> {
        try {
            const { objectChanges, balanceChanges } = await this.client.signAndExecuteTransaction({
                signer: this.keypair,
                transaction: transaction,
                options: {
                    showBalanceChanges: true,
                    showEvents: true,
                    showInput: false,
                    showEffects: true,
                    showObjectChanges: true,
                    showRawInput: false,
                }
            });

            // console.log(objectChanges, balanceChanges);
            if (!objectChanges) {
                console.error("Error: RPC did not return objectChanges");
                return false; // Return false in case of an error
            }

            // If everything works fine, return true
            return true;

        } catch (error) {
            console.error("Error executing transaction:", error);
            return false; // Return false in case of an exception
        }
    }

    async CreateElection(name: string, description: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::create_election`,
            arguments: [transaction.pure.string(name), transaction.pure.string(description), transaction.object(USERS_ID)],
        });
        return transaction;
    }

    async StartElection(election_id: string, endTime: number) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::start_election`,
            arguments: [transaction.object(election_id), transaction.pure.u64(endTime), transaction.object("0x6")],
        });
        return transaction;
    }

    async EndElection(election_id: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::end_election`,
            arguments: [transaction.object(election_id), transaction.object("0x6")],
        });
        return transaction;
    }

    async RegisterVoter(name: string, voters_address: string, election: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::register_voter`,
            arguments: [transaction.pure.string(name), transaction.pure.address(voters_address), transaction.object(election), transaction.object(USERS_ID)],
        });
        return transaction;
    }

    async AddCandidate(name: string, candidate_address: string, description: string, image: string, election: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::add_candidate`,
            arguments: [transaction.pure.string(name), transaction.pure.address(candidate_address), transaction.pure.string(description), transaction.pure.string(image), transaction.object(election)],
        });
        return transaction;
    }

    async RemoveCandidate(candidate_address: string, election: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::remove_candidate`,
            arguments: [transaction.pure.address(candidate_address), transaction.object(election)],
        });
        return transaction;
    }

    async vote(candidate_address: string, election: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::vote`,
            arguments: [transaction.pure.address(candidate_address), transaction.object(election)],
        });
        return transaction;
    }

    async unvote(candidate_address: string, election: string) {
        const transaction = new Transaction();
        transaction.moveCall({
            target: `${PACKAGE_ID}::smart_contract::unvote`,
            arguments: [transaction.pure.address(candidate_address), transaction.object(election)],
        });
        return transaction;
    }

    async checkIfElectionTimeIsElapsed(election: string) {
        const electionInfo = await this.getElectionInfo(election);
        if (electionInfo) {
            if (Number(electionInfo.end_time) < Date.now() && electionInfo.taken_place === false) {
                const transaction = new Transaction();
                transaction.moveCall({
                    target: `${PACKAGE_ID}::smart_contract::end_election`,
                    arguments: [transaction.object(election), transaction.object("0x6")],
                });
                await this.signAndExecuteTransaction(transaction);
            }
        }
    }

    async getElectionInfo(election: string) {
        const trx = new Transaction();
        trx.moveCall({
            target: `${PACKAGE_ID}::smart_contract::get_election_info`,
            arguments: [trx.object(election)],
        });
        const returnValues = await this.devInspectTransactionBlock(trx);
        if (returnValues) {
            if (returnValues[0] !== undefined) {
                const election_name = bcs.string().parse(Uint8Array.from(returnValues[0][0][0]));
                const election_description = bcs.string().parse(Uint8Array.from(returnValues[0][1][0]));
                const num_candidates = bcs.u64().parse(Uint8Array.from(returnValues[0][2][0]));
                const num_voters = bcs.u64().parse(Uint8Array.from(returnValues[0][3][0]));
                const num_votes = bcs.u64().parse(Uint8Array.from(returnValues[0][4][0]));
                const start_time = bcs.u64().parse(Uint8Array.from(returnValues[0][5][0]));
                const end_time = bcs.u64().parse(Uint8Array.from(returnValues[0][6][0]));
                const election_status = bcs.bool().parse(Uint8Array.from(returnValues[0][7][0]));
                const taken_place = bcs.bool().parse(Uint8Array.from(returnValues[0][8][0]));

                return {
                    election_name: election_name,
                    description: election_description,
                    address: election,
                    num_candidates: num_candidates,
                    number_of_registered_voters: num_voters,
                    vote: num_votes,
                    start_time: start_time,
                    end_time: end_time,
                    election_status: election_status,
                    taken_place: taken_place
                }
            }
            else {
                return null
            }
        } else {
            return null
        }
    }

    async GetUserInfo(user_address: string) {
        const trx = new Transaction();
        trx.moveCall({
            target: `${PACKAGE_ID}::smart_contract::get_user_info`,
            arguments: [trx.object(USERS_ID), trx.pure.address(user_address)],
        });
        const returnValues = await this.devInspectTransactionBlock(trx);
        if (returnValues) {
            if (returnValues[0] !== undefined) {
                const created_elections = bcs.vector(this.Address).parse(Uint8Array.from(returnValues[0][0][0]));
                const elections_involved = bcs.vector(this.Address).parse(Uint8Array.from(returnValues[0][1][0]));

                return {
                    created_elections: created_elections,
                    elections_involved: elections_involved,
                }
            }
            else {
                return null
            }
        } else {
            return null
        }
    }

    async getUserElectionInfo(user_address: string) {
        const userInfo = await this.GetUserInfo(user_address);
        console.log(userInfo)
        if (userInfo) {
            let created_elections = [];
            for (let i = 0; i < userInfo.created_elections.length; i++) {
                let election = await this.getElectionInfo(userInfo.created_elections[i]);
                if (election) {
                    let status = ""
                    if (election.taken_place) {
                        status = "ended"
                    } else if (election.election_status) {
                        status = "in-progress"
                    } else if (!election.election_status && !election.taken_place) {
                        status = "not started"
                    }
                    let created_election = {
                        id: `0x${userInfo.created_elections[i]}`,
                        name: election.election_name,
                        status: status
                    }
                    created_elections.push(created_election);
                }
            }
            let elections_involved = [];
            for (let i = 0; i < userInfo.elections_involved.length; i++) {
                let election = await this.getElectionInfo(userInfo.elections_involved[i]);
                if (election) {
                    let status = ""
                    let voted = false;
                    if (election.taken_place) {
                        status = "ended"
                        let v_status = await this.getVoterVoteStatus(userInfo.elections_involved[i], user_address);
                        if (v_status) {
                            voted = true
                        }
                    } else if (election.election_status) {
                        status = "in-progress"
                        let v_status = await this.getVoterVoteStatus(userInfo.elections_involved[i], user_address);
                        if (v_status) {
                            voted = true
                        }
                    } else if (!election.election_status && !election.taken_place) {
                        status = "not started"
                    }
                    let elections_inv = {
                        id: `0x${userInfo.elections_involved[i]}`,
                        name: election.election_name,
                        status: status,
                        voter_status: voted ? "voted" : "not voted"

                    }
                    elections_involved.push(elections_inv);
                }
            }
            return {
                created_elections: created_elections,
                elections_involved: elections_involved
            }
        } else {
            return {
                created_elections: [],
                elections_involved: [],
            };
        }
    }

    async getCandidates(election: any) {

        await this.checkIfElectionTimeIsElapsed(election);
        const trx = new Transaction();
        trx.moveCall({
            target: `${PACKAGE_ID}::smart_contract::get_candidates`,
            arguments: [trx.object(election)],
        });
        const returnValues = await this.devInspectTransactionBlock(trx);
        if (returnValues) {
            if (returnValues[0] !== undefined) {
                const Candidate = bcs.struct('Candidate', {
                    address: this.Address,
                    name: bcs.string(),
                    description: bcs.string(),
                    image: bcs.string(),
                    vote: bcs.u64(),
                });
                let candidates = bcs.vector(Candidate).parse(Uint8Array.from(returnValues[0][0][0]));
                candidates = candidates.map(candidateObj => ({
                    ...candidateObj,
                    candidate_address: `0x${candidateObj.address}`
                }));
                return candidates;
            }
            else {
                return null
            }
        } else {
            return null
        }
    }

    async getVoters(election: any) {

        await this.checkIfElectionTimeIsElapsed(election);
        const trx = new Transaction();
        trx.moveCall({
            target: `${PACKAGE_ID}::smart_contract::get_voters`,
            arguments: [trx.object(election)],
        });
        const returnValues = await this.devInspectTransactionBlock(trx);
        if (returnValues) {
            if (returnValues[0] !== undefined) {
                const Voter = bcs.struct('Voters', {
                    name: bcs.string(),
                    address: this.Address,
                    voted: bcs.bool(),
                });
                let voters = bcs.vector(Voter).parse(Uint8Array.from(returnValues[0][0][0]));
                voters = voters.map(voterObj => ({
                    ...voterObj,
                    voter_address: `0x${voterObj.address}`
                }));
                return voters;
            }
            else {
                return null;
            }
        } else {
            return null;
        }
    }

    async getVoterVoteStatus(election: string, voter_address: string) {
        await this.checkIfElectionTimeIsElapsed(election);
        const trx = new Transaction();
        trx.moveCall({
            target: `${PACKAGE_ID}::smart_contract::get_voter_vote_status`,
            arguments: [trx.object(election), trx.pure.address(voter_address)],
        });
        const returnValues = await this.devInspectTransactionBlock(trx);
        if (returnValues) {
            if (returnValues[0] !== undefined) {
                const status = bcs.bool().parse(Uint8Array.from(returnValues[0][0][0]));
                return status;
            }
            else {
                return null;
            }
        } else {
            return null;
        }
    }
}