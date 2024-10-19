import { SMCInteraction } from "./backend/scripts/smc_interaction";

const smc_interaction = new SMCInteraction();

export const userElections = async (address: string) => {
    // console.log(address)
    const elections = await smc_interaction.getUserElectionInfo(address);
    return elections;
}

export const createElection = async (name: string, description: string) => {
    const trx = await smc_interaction.CreateElection(name, description);
    return trx
}

export const getCandidatesAndVoters = async (election: string) => {
    const candidates = await smc_interaction.getCandidates(election);
    const voters = await smc_interaction.getVoters(election);
    if (candidates && voters) {
        return {
            candidates: candidates,
            voters: voters
        }
    }
    return {
        candidates: [],
        voters: []
    }
}

export const getElectionInfo = async (election: string) => {
    const info = await smc_interaction.getElectionInfo(election);

    return info
}

export const addCandidate = async (name: string, candidate_address: string, description: string, image: string, election: string) => {
    const trx = await smc_interaction.AddCandidate(name, candidate_address, description, image, election);
    return trx;
}

export const registerVoter = async (name: string, address: string, election: string) => {
    const trx = await smc_interaction.RegisterVoter(name, address, election);
    return trx
}

export const startElection = async (election: string, endTime: number) => {
    const trx = await smc_interaction.StartElection(election, endTime);
    // trx.setGasBudget(500000000);
    // const trx = await smc_interaction.EndElection(election);
    return trx
}


export const getElectionDetaisAndCandidates = async (election: string) => {
    let info = await smc_interaction.getElectionInfo(election);
    const candidates = await smc_interaction.getCandidates(election);
    if (candidates && info) {
        (info as any)['candidates'] = candidates
        // console.log(info)
        return info
    }
    return null
}

export const vote = async (candidate_address: string, election: string) => {
    // console.log(candidate_address, election)
    const trx = await smc_interaction.vote(candidate_address, election);
    return trx
}

export const voterStatus = async (election: string, address: string) => {
    const status = await smc_interaction.getVoterVoteStatus(election, address);
    return status
}