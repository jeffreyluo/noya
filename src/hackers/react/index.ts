import * as React from 'react';
import { sendMsg } from '../../lib/utils';
import { getPath } from '../../lib/dom';
import stateMachine from '../../lib/stateMachine';
import timer from '../../lib/timer';
import { MODE_CONFIG } from '../../config';
import { REACT_EVENT } from './event';
import { REACT_LIFECYCLE } from './lifecycle';
import { UI_MAP } from '../../config';
import { reportLifecycle } from '../../lib/report'

const tm = new timer();

export const inject = ()=>{
    injectCreateElement();
}

const injectCreateElement = ()=>{
    const createElement = React.createElement;

    // @ts-ignore: inject react source code (event)
    React.createElement = function(){

        const args = Array.prototype.slice.call(arguments);

        const type = args[0];
        const props = args[1];    
        const sm = new stateMachine();
        // inject event
        
        sm.addState('string', ()=>{
            args[1] = nuoyaProps(type, props || {});
        });

        // inject event&&lifecycle
        sm.addState('function', ()=>{
            args[0] = window.NOYA_DATA.lifeReport ? nuoyaClass(type) : type;
            args[1] = nuoyaProps(type, props || {});
        });
        
        sm.getState(typeof type)();
           
        return createElement.apply(null, args);
    }
}

/**
 * 修改组件props中的事件处理,增加noya逻辑
 * @param type 
 * @param props 
 */
const nuoyaProps = (type, props)=>{
    
    let tmp:NUOYA_PROPS = {};

    for (let key in props) {
        tmp[key] = props[key];
    }
    
    REACT_EVENT.forEach((event)=>{
        // 当onClick被调用的时候，会将参数插到props.onClick后面
        if(props[event]){
            tmp[event] = eventProxy.bind(null, props[event]);
        }
    });
    
    return tmp;
}

/**
 * 修改组件props中的生命周期钩子
 * @param type 
 */
const nuoyaClass = (component)=>{
    
    let tmp = component.prototype;

    REACT_LIFECYCLE.forEach((life)=>{
        const fn = tmp[life];
        if(fn){
            tmp[life] = lifeProxy(fn, {
                name : component.name,
                life
            });
        }     
    });

    component.prototype = tmp;
    return component;
}

/**
 * 包装react事件
 * @param fn react onXX
 * @param event react event
 */
const eventProxy = (fn, event)=>{

    // 是否上报模式、shift+click
    const { mode, page_info } = window.NOYA_DATA;
    const target = event.currentTarget||event.target
    const isEvent = event && target;

    const isConfig = mode == MODE_CONFIG && event.shiftKey;
    console.log(`>>>> event:`, event);
    console.log(`>>>> fn:`, fn);
    if(isConfig){
        // 配置的时候禁止事件冒泡
        event.stopPropagation();
        sendMsg({
            path : getPath(event),
            tag : target.tagName,
            attr : {
                innerText : target.innerText,
                className : target.className,
                id : target.id,
                title : target.title,
                offsetX : target.offsetX,
                offsetY : target.offsetY,
                pageX : target.pageX,
                pageY : target.pageY
            }
        })
        return ;
    }
    if(isEvent){
        tm.add({
            pid : page_info.pid,
            id : page_info.id,
            ele_path : getPath(event),
            ele_tag : target.tagName,
            type: event.type
        });
        tm.run();
    }
    
    if (typeof fn === 'function') {
        fn(event);
    }
}

/**
 * 生命周期装饰器，增加生命周期上报
 * @param fn 
 */
const lifeProxy = function(fn, component){  
    return function(){
        const args = Array.prototype.slice.call(arguments);
        reportLifecycle(component);
        fn.apply(this, args);
    };
}

