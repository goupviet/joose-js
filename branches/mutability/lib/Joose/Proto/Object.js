(function(){

    Joose.Proto = function(){ throw "Modules may not be instantiated." };
    
    
    Joose.Proto.Object = function (){
        throw "Joose.Proto.Object can't be instantiated";
    }
    
    
        
    var findSuperCall = function(startFrom){
        //sufficient for Joose.Proto.Class
        var self = startFrom.caller;
        
        if (!self.SUPER) throw "Invalid call to SUPER";
        
        //self._original is always undefined for Joose.Proto.Class
        return self._original || self.SUPER[self.methodName];
    }
    
    var SUPER = function (){
        return findSuperCall(SUPER).apply(this, arguments);
    }
    
    var SUPERARG = function (){
        return findSuperCall(SUPERARG).apply(this, arguments[0]);
    }
    
    //XXX switch to closures    
    var INNER = function (){
        //sufficient for augment modifiers and original methods from Joose.Proto.Class
        var self = INNER.caller.caller;
        
        //required for original methods from Joose.Managed.Class which can be also 'around' modifiers
        if (self.SUPER || self.AROUND) self = self.caller;
        
        var callstack = self.__INNER_STACK__;
        if (!callstack) throw "Invalid call to INNER";
        
        var augmentWrapper = function(){
            var innerCall = callstack.pop();
            
            return innerCall ? innerCall.apply(this, arguments) : undefined;
        }
        
        augmentWrapper.__INNER_STACK__ = callstack;
        
        return augmentWrapper.apply(this, arguments);
    }        
    
    
    Joose.Proto.Object.prototype = {
        
        SUPERARG : SUPERARG,
        SUPER : SUPER,
        INNER : INNER,        
        
        
        initialize: function () {
        },
        
        
        toString: function () {
            return "a " + this.meta.name;
        },
        
        
		detach : function() {
			//already detached
			if (this.meta instanceof Joose.Meta.Class.Detached) return;
			
        	var detachedClass = new Joose.Meta.Class.Detached('', { isa : this.constructor }).c
        	
        	detachedClass.meta.stem.open()
        	
        	detachedClass.prototype = this
        	
        	this.meta = detachedClass.meta
        	this.meta.originalClass = this.constructor
        	this.constructor = detachedClass
        	
        	detachedClass.meta.stem.close()
		},
		
		
		attach : function() {
			//not detached
			if (!(this.meta instanceof Joose.Meta.Class.Detached)) return;
			
			this.meta.stem.open();
			
			this.constructor.prototype = {};
			
			delete this.constructor;
			delete this.meta;
		}
        
    };
        
    
    Joose.Proto.Object.meta = {
    	constructor : Joose.Proto.Object,
    	
        methods : Joose.Proto.Object.prototype,
        attributes : {}
    }
    
    Joose.Proto.Object.prototype.meta = Joose.Proto.Object.meta
    
    
    Joose.Proto.Empty = function(){ throw "Joose.Proto.Empty can't be instantiated" };
    
    Joose.Proto.Empty.meta = {
        methods : {},
        attributes : {}
    }
    

})();