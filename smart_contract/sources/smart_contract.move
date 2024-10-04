/// Module: smart_contract
module smart_contract::smart_contract {
    use std::string::String;
    use sui::clock::{Clock};

    const INVALID : u64 = 0;

    public struct Candidate has store, drop, copy{
        candidate_address: address,
        name: String,
        description: String,
        vote_count: u64,
    }

    public struct Voters has store, drop, copy{
        name: String,
        voters_address : address,
        voted : bool,
    }

    public struct Election has key{
        id: UID,
        name: String,
        description: String,
        vote_count: u64,
        candidates: vector<Candidate>,
        registered_voters: vector<Voters>,
        start_time: u64,
        end_time: u64,
        election_in_progress: bool,
        taken_place : bool
    }

    public fun create_election(name: String, description: String, ctx : &mut TxContext){
        let election : Election = Election {
            id: object::new(ctx),
            name: name,
            description: description,
            vote_count: 0,
            candidates: vector::empty<Candidate>(),
            registered_voters: vector::empty<Voters>(),
            start_time: 0,
            end_time: 0,
            election_in_progress: false,
            taken_place : false
        };

        transfer::share_object(election);
    }

    public fun start_election(election : &mut Election, end_time_ms: u64,clock: &mut Clock){
        election.election_in_progress = true;
        election.start_time = clock.timestamp_ms();
        election.end_time = clock.timestamp_ms() + end_time_ms;
    }

    public fun end_election(election : &mut Election, clock: &mut Clock){
        assert!(election.election_in_progress && clock.timestamp_ms() > election.end_time, INVALID);
        election.election_in_progress = false;
        election.taken_place = true;
    }


    public fun register_voter(name: String, voters_address : address, election : &mut Election){
        let voter : Voters = Voters {
            name: name,
            voters_address : voters_address,
            voted : false
        };
        vector::push_back(&mut election.registered_voters, voter);
    }

    public fun add_candidate(name: String, candidate_address : address, description: String, election : &mut Election){
        let candidate : Candidate = Candidate {
            candidate_address: candidate_address,
            name: name,
            description: description,
            vote_count: 0,
        };
        vector::push_back(&mut election.candidates, candidate);
    }

    fun check_voter(voters_address : address, election : &Election) : bool{
        let mut i = 0;
        let num_voters = vector::length(&election.registered_voters);
        while(i < num_voters){
            let voter = vector::borrow(&election.registered_voters, i);
            if (voter.voters_address == voters_address){
                return true
            };
            i = i + 1;
        };
        return false
    }

    fun check_voted(voters_address : address, election : &Election) : bool{
        let mut i = 0;
        let num_voters = vector::length(&election.registered_voters);
        while(i < num_voters){
            let voter = vector::borrow(&election.registered_voters, i);
            if (voter.voters_address == voters_address && voter.voted == true){
                return true
            };
            i =  i + 1;
        };
        return false
    }
    
    fun check_candidate(candidate_address : address, election : &Election) : bool{
        let mut i = 0;
        let num_candidates = vector::length(&election.candidates);
        while(i < num_candidates){
            let candidate = vector::borrow(&election.candidates, i);
            if (candidate.candidate_address == candidate_address){
                return true
            };
            i = i + 1;
        };
        return false
    }

    fun add_candidate_vote(candidate_address : address, election : &mut Election){
        let mut i = 0;
        let num_candidates = vector::length(&election.candidates);
        while(i < num_candidates){
            let candidate = vector::borrow_mut(&mut election.candidates, i);
            if (candidate.candidate_address == candidate_address){
                candidate.vote_count = candidate.vote_count + 1;
                election.vote_count = election.vote_count + 1;
                break
            };
            i = i + 1;
        };
    }


    fun remove_candidate_vote(candidate_address : address, election : &mut Election){
        let mut i = 0;
        let num_candidates = vector::length(&election.candidates);
        while(i < num_candidates){
            let candidate = vector::borrow_mut(&mut election.candidates, i);
            if (candidate.candidate_address == candidate_address){
                candidate.vote_count = candidate.vote_count - 1;
                election.vote_count = election.vote_count - 1;
                break
            };
            i = i + 1;
        };
    }

    fun user_vote(voters_address : address, candidate_address : address, election : &mut Election) : bool{
        let mut i = 0;
        let num_voters = vector::length(&election.registered_voters);
        while(i < num_voters){
            let voter = vector::borrow_mut(&mut election.registered_voters, i);
            if (voter.voters_address == voters_address){
                voter.voted = true;
                add_candidate_vote(candidate_address, election);
                return true
            };
            i = i + 1;
        };
        return false
    }

    fun user_unvote(voters_address : address, candidate_address : address, election : &mut Election) : bool{
        let mut i = 0;
        let num_voters = vector::length(&election.registered_voters);
        while(i < num_voters){
            let voter = vector::borrow_mut(&mut election.registered_voters, i);
            if (voter.voters_address == voters_address){
                voter.voted = false;
                remove_candidate_vote(candidate_address, election);
                return true
            };
            i = i + 1;
        };
        return false
    }

    public fun vote(candidate_address : address, election : &mut Election, ctx : &mut TxContext): bool{
        let sender: address = tx_context::sender(ctx);
        let valid_voter : bool = check_voter(sender, election);
        let valid_candidate : bool = check_candidate(candidate_address, election);
        let check_voted : bool = check_voted(sender, election);
        assert!(valid_voter && !check_voted && valid_candidate && election.election_in_progress && !election.taken_place, INVALID);
        let voted : bool = user_vote(sender, candidate_address, election);
        return voted
    }

    public fun unvote(candidate_address : address, election : &mut Election, ctx : &mut TxContext): bool{
        let sender: address = tx_context::sender(ctx);
        let valid_voter : bool = check_voter(sender, election);
        let valid_candidate : bool = check_candidate(candidate_address, election);
        let check_voted : bool = check_voted(sender, election);
        assert!(valid_voter && check_voted && valid_candidate && election.election_in_progress && !election.taken_place, INVALID);
        let unvoted : bool = user_unvote(sender, candidate_address, election);
        return unvoted
    }

    public fun get_election_info(election : &Election) : (String, String, u64, u64, u64, u64, u64, bool, bool){
        return (election.name, election.description, vector::length(&election.candidates), vector::length(&election.registered_voters), election.vote_count, election.start_time, election.end_time, election.election_in_progress, election.taken_place)
    }

    public fun get_candidates(election : &Election) : vector<Candidate>{
        return election.candidates
    }

    public fun get_voters(election : &Election) : vector<Voters>{
        return election.registered_voters
    }

}

