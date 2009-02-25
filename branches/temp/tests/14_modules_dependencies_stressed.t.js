(function (Class, Module, Role, Type, Prototype) {
return (function () {
var t = new Test.TAP.Class();
t.plan(319)

var thistop = Test.prototype.top()

t.testModuleClass = function() {
    var self = this;
    
    self.skip(typeof Joose.Kernel.MetaClass.Depended != 'function', "Depended Role not included", 319, function(){

        Module("StressTest");
        self.ok(StressTest, "Root module created");
        __global__.doubleDeclarations = false;
        __global__.unSatisfiedDeps = false;
        //==================================================================================================================================================================================
        self.diag("Stress testing of dependencies loading");
    
        var start      = new Date();
        Module("StressTest", {
            use : 'StressTest.Test001',
            
            //body is executing after the all dependencies are satisfied
            body : function(){
                var end   = new Date();
                
                self.diag("Duration = " + (end.getTime() - start.getTime()) / 1000);
                
                self.ok(!__global__.doubleDeclarations, "Stress testing passed without redeclarations");
                self.ok(!__global__.unSatisfiedDeps, "Stress testing passed with all dependencies satisfied");
                
                self.ok(StressTest.Test001, "StressTest.Test001 module created");
                self.ok(StressTest.Test001.meta.meta.isa(Joose.Class), "StressTest.Test001 class created");
                self.ok(StressTest.Test001.meta.can('result'), "StressTest.Test001 has method 'result'");
                self.ok(new StressTest.Test001().result() == 1, 'StressTest.Test001 can be instantiated');
                
                for (var i = 2; i <= 100; i++) {
                    var class_name = new String(i).split('');
                    while (class_name.length < 3) class_name.unshift('0');
                    class_name = 'Test' + class_name.join('');
                    
                    if (typeof StressTest[class_name] == 'function') {
                        self.ok(StressTest[class_name], "StressTest." + class_name + " module created");
                        self.ok(StressTest[class_name].meta.meta.isa(Joose.Class), "StressTest." + class_name + " class created");
                        self.ok(StressTest[class_name].meta.can('result'), "StressTest." + class_name + " has method 'result'");
                        self.ok(new (StressTest[class_name])().result() == i, "StressTest." + class_name + " can be instantiated");
                    }
                }
            }
        });
        
    });
}

return t;
})()
}).call(window, JooseClass, JooseModule, JooseRole, JooseType, JoosePrototype)
