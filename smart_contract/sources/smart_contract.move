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

    public struct User has store, drop, copy{
        user_address : address,
        created_elections : vector<address>,
        elections_involved : vector<address>,
    }

    public struct Users has key{
        id : UID,
        users : vector<User>,
    }

    public struct Election has key{
        id: UID,
        name: String,
        description: String,
        vote_count: u64,
        candidates: vector<Candidate>,
        registered_voters: vector<Voters>,
        created_by: address,
        start_time: u64,
        end_time: u64,
        election_in_progress: bool,
        taken_place : bool
    }

    fun init(ctx : &mut TxContext){
        let users: Users = Users{
            id: object::new(ctx),
            users : vector::empty<User>(),
        };
        transfer::share_object(users)
    }

    public fun create_election(name: String, description: String, users : &mut Users, ctx : &mut TxContext){
        let sender: address = tx_context::sender(ctx);
        let election : Election = Election {
            id: object::new(ctx),
            name: name,
            description: description,
            vote_count: 0,
            candidates: vector::empty<Candidate>(),
            registered_voters: vector::empty<Voters>(),
            created_by: sender,
            start_time: 0,
            end_time: 0,
            election_in_progress: false,
            taken_place : false
        };
        let election_id : address = object::id_address(&election);

        let (user_exists , index) = check_user(sender, users);
        if (user_exists){
            let user = vector::borrow_mut(&mut users.users, index);
            vector::push_back(&mut user.created_elections, election_id);
        }else{
            let mut user : User = User{
                user_address : sender,
                created_elections : vector::empty<address>(),
                elections_involved : vector::empty<address>(),
            };
            vector::push_back(&mut user.created_elections, election_id);
            vector::push_back(&mut users.users, user);
        };

        transfer::share_object(election);
    }

    public fun start_election(election : &mut Election, end_time_ms: u64,clock: &mut Clock, ctx : &mut TxContext){
        let sender: address = tx_context::sender(ctx);
        assert!(sender == election.created_by, INVALID);
        assert!(election.taken_place == false, INVALID);
        election.election_in_progress = true;
        election.start_time = clock.timestamp_ms();
        election.end_time = clock.timestamp_ms() + end_time_ms;
    }

    public fun end_election(election : &mut Election, clock: &mut Clock){
        assert!(election.election_in_progress && clock.timestamp_ms() > election.end_time, INVALID);
        election.election_in_progress = false;
        election.taken_place = true;
    }


    public fun register_voter(name: String, voters_address : address, election : &mut Election, users : &mut Users){
        let voter : Voters = Voters {
            name: name,
            voters_address : voters_address,
            voted : false
        };
        vector::push_back(&mut election.registered_voters, voter);

        let election_id : address = object::id_address(election);

        let (user_exists , index) = check_user(voters_address, users);
        if (user_exists){
            let user = vector::borrow_mut(&mut users.users, index);
            vector::push_back(&mut user.elections_involved, election_id);
        }else{
            let mut user : User = User{
                user_address : voters_address,
                created_elections : vector::empty<address>(),
                elections_involved : vector::empty<address>(),
            };
            vector::push_back(&mut user.elections_involved, election_id);
            vector::push_back(&mut users.users, user);
        };

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

    public fun remove_candidate(candidate_address : address, election : &mut Election){
        let (valid_candidate, index) = check_candidate(candidate_address, election);
        assert!(valid_candidate, INVALID);
        vector::remove(&mut election.candidates, index);
    }

    fun check_user(user_address : address, users : &Users) : (bool, u64){
        let mut i = 0;
        let num_users = vector::length(&users.users);
        while(i < num_users){
            let voter = vector::borrow(&users.users, i);
            if (voter.user_address == user_address){
                return (true, i)
            };
            i = i + 1;
        };
        return (false, 0)
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
    
    fun check_candidate(candidate_address : address, election : &Election) : (bool, u64){
        let mut i = 0;
        let num_candidates = vector::length(&election.candidates);
        while(i < num_candidates){
            let candidate = vector::borrow(&election.candidates, i);
            if (candidate.candidate_address == candidate_address){
                return (true, i)
            };
            i = i + 1;
        };
        return (false, 0)
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
        let (valid_candidate, _) = check_candidate(candidate_address, election);
        let check_voted : bool = check_voted(sender, election);
        assert!(valid_voter && !check_voted && valid_candidate && election.election_in_progress && !election.taken_place, INVALID);
        let voted : bool = user_vote(sender, candidate_address, election);
        return voted
    }

    public fun unvote(candidate_address : address, election : &mut Election, ctx : &mut TxContext): bool{
        let sender: address = tx_context::sender(ctx);
        let valid_voter : bool = check_voter(sender, election);
        let (valid_candidate, _) = check_candidate(candidate_address, election);
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

    public fun get_voter_vote_status(election : &Election, voters_address : address, ctx : &mut TxContext) : bool{
        let valid_voter : bool = check_voter(voters_address, election);
        assert!(valid_voter, INVALID);
        return check_voted(sender, election)
    }

}
