/* 
 * A Controller object to run the lifecycle of a model.
 * Works in conjunction with Jquery.
 * At default, Postal is used as the Broker, yet that can be customized.
 * 
 * @param broker- the broker that recieves messages. 
 */
var Revive = function(brokerImpl){
 
    /** Holds the states. */
    var states = {};
    /** Holds the broker. */
    var broker = brokerImpl;
 
    /**
     * Clean the store.
     * 
     * @return this object for chaining.
     */
    this.clear = function(){
        
        states = {};
        
        return this;
    };
    
    /**
     * Introduce a new broker here.
     * 
     * @param brokerImpl- the broker.
     * 
     * @return this object for chaining.
     */
    this.setBroker = function(brokerImpl){
        
        broker = brokerImpl;
        
        return this;
    };
 
    /**
     * Try to emit the model with a new message.
     * 
     * @param channel- the channel to register to.
     * @param topic- the topic in the channel to register to.
     * @param data- the data to send to.
     * 
     * @return this object for chaining.
     */
    this.emit = function(channel, topic, data){
        
        broker.publish({
            channel: channel,
            topic: topic,
            data: data
        });
        
        return this;
    };
    
    /**
     * Try to apply on a registration to the model.
     * 
     * @param channel- the channel to register to.
     * @param topic- the topic in the channel to register to.
     * @param callback- the callback to apply by.
     * 
     * @return this object for chaining.
     */
    this.apply = function(channel, topic, callback){
        
        broker.subscribe({
            channel: channel,
            topic: topic,
            callback: function(data,envelope){
                callback(data,envelope);
            }
        });
        
        return this;
    };
    
    /**
     * A quick wrapper for catching events from an element.
     * 
     * @param id- the id of the element that triggers the event.
     * @param type- the type of the event to catch.
     * @param fn- the callback function.
     * 
     * @return this object for chaining.
     */
    this.on = function(id, type, fn){
        
        var elem = $("#"+id);
        elem.on(type,function(event){
            if(type==="click" && elem.attr("disabled"))
            {   // Disabled, just block the event.
                // Actually, that's not needed and can be removed.
                event.preventDefault();
                
                return;
            }
            
            fn(event);
            event.preventDefault();
        });
        
        return this;
    };
    
    /**
     * Returns the state of a given element.
     * 
     * @param id- the id of the lement.
     *  
     * @return the state of a given element.
     */
    this.asState = function(id){
        
        var state = {};
        var elem = $("#"+id);
        state["html"] = elem.html();
        state["text"] = elem.text();
        state["css"] = elem.attr("style");
        state["class"] = elem.attr("class");
        state["id"] = id;
        state["disabled"] = elem.attr("disabled");
        state["src"] = elem.attr("src");
        state["href"] = elem.attr("href");
        state["width"] = elem.attr("width");
        state["height"] = elem.attr("height");
        state["alt"] = elem.attr("alt");
        state["title"] = elem.attr("title");
        state["checked"] = elem.attr("checked");
        state["selected"] = elem.attr("selected");
        
        return state;
    };
    
    /**
     * Add a new state to the store.
     * Might be a single state, or multiple states.
     * 
     * @param label- the label tied to the state.
     * @param state- the state itself.
     * 
     * @return this object for chaining.
     */
    this.store = function(label, state){
        
        states[label] = state;
        
        return this;
    };
    
    /**
     * Restore a batch of elements.
     * 
     * @param label- the label of the states to restore.
     * 
     * @return this object for chaining.
     */
    this.restoreAll = function(label){

        var multiStates = states[label];
        
        try
        {
            multiStates.forEach(function(state){
                restoreState(state);
            });
        }
        catch(error)
        {   // Die gracefully. That's probably due to one that's not defined well.
        }
        
        return this;
    };
    
    /**
     * Restore a specified state.
     * 
     * @param label- the label which is tied to the state.
     * 
     * @return this object for chaining.
     */
    this.restore = function(label){
        
        var state = states[label];
        restoreState(state);
        
        return this;;
    };
    
    /**
     * Restore a given state.
     * 
     * @param state- the state to restore.
     */
    var restoreState = function(state){
        
        var id = state.id;
        
        if(state.html)
        {
            html(id,state.html);
        }
        
        if(state.text)
        {
            text(id,state.text);
        }
        
        if(state.css)
        {
            css(id,state.css);
        }
        
        sync(id,"class",state.class);
        sync(id,"src",state.src);
        sync(id,"href",state.href);
        sync(id,"width",state.width);
        sync(id,"height",state.height);
        sync(id,"alt",state.alt);
        sync(id,"title",state.title);
        sync(id,"disabled",state.disabled);
        sync(id,"checked",state.checked);
        sync(id,"selected",state.selected);
    };
    
    /**
     * Set the html attribute into a given element.
     * 
     * @param id- the id of the element to set in.
     * @param html- the html to set.
     */
    var html = function(id, html){

        $("#"+id).html(html);
    };
    
    /**
     * Set the text attribute into a given element.
     * 
     * @param id- the id of the element to set in.
     * @param text- the text to set.
     */
    var text = function(id, text){

        $("#"+id).text(text);
    };

    /**
     * Set css attribute into a given element.
     * 
     * @param id- the id of the element to set in.
     * @param css- the css to add.
     */
    var css = function(id, css){

        $("#"+id).css(css);
    };
    
    /**
     * Try to sync a given attribute into the element.
     * 
     * @param id- the id of the element.
     * @param name- the name of the attribute.
     * @param attr- the attribute itself.
     */
    var sync = function(id, name, attr){
        
        var elem = $("#"+id);
        
        if(attr)
        {   // Should exist, we need to sync into the element.
            elem.attr(name,attr);
        }
        else
        {   // Not exists, need to be removed. 
            elem.removeAttr(name);
        }
    };
};

// Create a new instance of Revivve.
// Please not, this creates a dependency on Pastal, so it might be removed..
revive = new Revive(this.postal);
/**
 * That's an elegant way of an implementation for revive.on(), above.
 */
(function(){ 
    var elements = document.querySelectorAll('[revive-data]');
    
    if(elements)
    {
        for(var i=0;i<elements.length;i++)
        {
            var data = elements[i].getAttribute('revive-data');
            var fn = elements[i].getAttribute('revive-fn');
            var id = elements[i].getAttribute('id');
            var type = elements[i].getAttribute('revive-type');
            
            if(fn)
            {   
                revive.on(id,type,function(event){
                    // That will only work if the function is declared global.
                    // AKA, window.fn = function().
                    var fun = window[fn];

                    if(typeof fun==='function')
                    {
                        fun(event,data);
                        event.preventDefault();
                    } 
                });
            }
            else
            {   // Will trigger firing a message on click.
                var json = JSON.parse(data);
                
                revive.on(id,type,function(event){
                    revive.emit(json.channel,json.topic,json.data);
                });
            }
        }
    }
})();
