class stateMachine {

    state : any;
    defaultState : ()=>void;

    constructor(){
        this.state={};
        this.defaultState = ()=>{};
    }

    addState(key, state){
        if(!this.state[key]){
            this.state[key] = state;
        }    
    }

    getState(key){
        return this.state[key] ? this.state[key] : this.defaultState;
    }

}

export default stateMachine;
