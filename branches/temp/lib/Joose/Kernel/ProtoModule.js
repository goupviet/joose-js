var protoModuleMeta = new Joose.Kernel.Roles('Joose.Kernel.ProtoModule');

protoModuleMeta.addAttribute('_allModules', { init : [] });

// Joose.NameSpace is a pseudo class that makes namespace spots created by Joose.Module discoverable
Joose.NameSpace = function () {}

protoModuleMeta.initializeFromProps({
	
    has: {
        _name: {
            is: "rw"
        },
        _elements: {
            is: "rw"
        },
        _container: {
            is: "rw"
        }
    },
    
    
    classMethods: {
    	
        setup: function (name, functionThatCreatesClassesAndRoles) {
            var me      = this;
            var parts   = name.split(".");
            var object  = joose.top;
            var soFar   = []
            var module;
            for(var i = 0, len = parts.length; i < len; ++i) {
                var part = parts[i];
                if(part == "meta") {
                    throw "Module names may not include a part called 'meta'."
                }
                var cur = object[part];
                soFar.push(part)
                var subName = soFar.join(".")
                if(typeof cur == "undefined") {
                    object[part]      = new Joose.NameSpace();
                    module            = new this(subName)
                    module.setContainer(object[part])
                    object[part].meta = module
                    this.prototype._allModules.push(object[part])
                    
                } else {
                    module = cur.meta;
                    if(
                        i === (len-1) && // only check on last iteration
                        !(module && module.meta && (module.meta.isa(Joose.Kernel.ProtoModule)))) {
                        throw "Trying to setup module "+name+" failed. There is already something else: "+cur
                    }
                }
                object = object[part]
            }
            var before = joose.currentModule
            joose.currentModule = module
            if(functionThatCreatesClassesAndRoles) {
                functionThatCreatesClassesAndRoles(object);
            }
            joose.currentModule = before;
            return object
        },
        
        getAllModules: function () {
            return this.prototype._allModules
        }
    },
    
    
    methods: {
        
        alias: function (destination) {
            var me = this;
            
            if(arguments.length == 0) {
                return this
            }

            Joose.A.each(this.getElements(), function (thing) {
                var global        = me.globalName(thing.meta.className());
                
                if(destination[global] === thing) { // already there
                    return
                }
                if(typeof destination[global] != "undefined") {
                    throw "There is already something else in the spot "+global
                }
                
                destination[global] = thing;
            })
        },
        
        globalName: function (name) {
            var moduleName = this.getName();
            if(name.indexOf(moduleName) != 0) {
                throw "All things inside me should have a name that starts with "+moduleName+". Name is "+name
            }
            var rest = name.substr(moduleName.length + 1); // + 1 to remove the trailing dot
            if(rest.indexOf(".") != -1) {
                throw "The things inside me should have no more dots in there name. Name is "+rest
            }
            return rest
        },
        
        removeGlobalSymbols: function () {
            Joose.A.each(this.getElements(), function (thing) {
                var global = this.globalName(thing.getName());
                delete joose.top[global]
            })
        },
        
        initialize: function (name) {
            this.setElements([])
            this.setName(name);
        },
        
        isEmpty: function () {
            return this.getElements().length == 0
        },
        
        addElement: function (ele) {
            if(!(ele || ele.meta)) {
                throw "You may only add things that are Joose objects"
            }
            this._elements.push(ele)
        },
        
        getNames: function () {
            var names = [];
            Joose.A.each(this.getElements(), function (ele) { names.push(ele.meta.getName()) });
            return names
        }
    }
});


    
Joose.Kernel.ProtoModule = protoModuleMeta.getClassObject();


__global__ = Joose.Kernel.ProtoModule.setup("__global__");
__global__.meta.setContainer(__global__);
__global__.meta._allModules.push(__global__);


Joose.Kernel.ProtoModule.setup("__global__.nomodule", function () {});
__global__.nomodule.meta._elements = joose.globalObjects;

