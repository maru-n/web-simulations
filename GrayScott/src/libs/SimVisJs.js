/*
 * polyfill requestAnimationFrame
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

let SimVisJs = {
    _models: {},

    register: function(name, obj) {
        obj.init()
        this._models[name] = {
            name: name,
            sim: obj,
            update_listeners: [],
            running: false,
            runner: ()=>{
                SimVisJs.update(name)
                if (this._models[name].running) {
                    requestAnimationFrame(this._models[name].runner)
                }
            }
        }
    },

    addUpdateListener(name, listener) {
        this._get_model(name).update_listeners.push(listener)
    },
    
    get_sim: function(name) {
        return this._models[name].sim
    },
    
    get_parameter(name, parameter) {
        let s = this.get_sim(name)
        return s[parameter]
    },
    
    set_parameter(name, parameter, value) {
        let s = this.get_sim(name)
        s[parameter] = value
        this._call_update_listeners(name)
    },
    
    update(name) {
        this.get_sim(name).update()
        this._call_update_listeners(name)
    },
    
    init(name) {
        this.get_sim(name).init()
        this._call_update_listeners(name)
    },
    
    refresh(name) {
        this._call_update_listeners(name)
    },

    _get_model: function(name) {
        return this._models[name]
    },
    
    _call_update_listeners(name) {
        let m = this._get_model(name)
        for (let f of m.update_listeners) {
            f(m.sim)
        }
    },
    
    is_running(name) {
        return this._get_model(name).running
    },
    
    start(name) {
        this._get_model(name).running = true
        this._get_model(name).runner()
    },
    
    stop(name) {
        this._get_model(name).running = false
    },
}

export default SimVisJs
