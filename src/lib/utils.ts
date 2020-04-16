

/**
 * 从script中获取参数
 * mark:当前执行的script肯定是当前已加载的所有script中的最后一个
 */
export const getOpt = (key:string)=>{
    const scripts=document.getElementsByTagName("script"); 
    const sdk = scripts[ scripts.length - 1 ];
    
    return (sdk.src.match(new RegExp("(?:\\?|&)"+key+"=(.*?)(?=&|$)"))||['',null])[1];
}

/**
 * 获取querystring参数
 * @param key 
 */
export const getQueryString = (key)=>{
    const queryString = location.search;
    const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
    const ret = queryString.substr(1).match(reg)
    return  ret ? unescape(ret[2]) : null; 
}

/**
 * 像parent postmessage
 * @param content 
 */
export const sendMsg = (content)=>{
    console.log('sending msg to parent');
    window.parent.postMessage(content,'*');
}


/**
 * 装饰器:函数防抖
 * @param delay 
 */

export const debounce = (delay) =>{
    let timeout = null;
    return function (target, key, descriptor) {
        return Object.assign({}, descriptor, {
            value: function value() {
                const context = this; 
                const args = arguments;
                const fn = descriptor.value;
                clearTimeout(timeout);
                timeout = setTimeout(() => {   
                    fn.apply(context, args);
                }, delay);
            }
          })
    }
}

