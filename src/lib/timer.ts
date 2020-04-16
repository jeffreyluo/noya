
import { reportEvent } from './report';
import { debounce } from './utils';

export default class Timer{
    
    equeue : NOYA_EVENT[];
    constructor(){
        this.equeue=[];
    }

    add(event:NOYA_EVENT){
        if(this.check(event)){
            this.equeue.push(event);
        }
    }

    check(event:NOYA_EVENT){
        return this.equeue.every((e)=>{
            return event.ele_path != e.ele_path || (event.ele_path == e.ele_path && event.type != e.type )
        });
    }

    @debounce(100)
    run(){
        while(this.equeue&&this.equeue.length>0){
            reportEvent(this.equeue.shift());
        }    
    }
}