(function () {
var testobj = new Test.TAP.Class();
testobj.plan(22)

testobj.testSanity = function() {
    //==================================================================================================================================================================================
    this.diag("Symbiont - separate, built-in class, (analog of class-methods + class-attributes + class-roles + ...)");
    
    this.ok(Joose.Meta.Class, "Joose.Meta.Class is here");
    this.ok(Joose.Meta.Role, "Joose.Meta.Role is here");
    
    this.ok(Joose.Meta.Class.meta.hasAttribute('myClass'), "Joose.Meta.Class has 'myClass' attribute");
    this.ok(Joose.Meta.Role.meta.hasAttribute('myClass'), "Joose.Meta.Role has 'myClass' attribute");
    
    Class('TestClass', {
        have : {
            res : 'instance'
        },
        
        methods : {
            result : function() { return 'TestClass:instance' }
        },
        
        
        my : {
            have : {
                res : 'class'
            },
            
            methods : {
                result : function() { return 'TestClass:class' }
            }
        }
        
    });
    
    this.ok(typeof TestClass == 'function', "TestClass was created");
    this.ok(TestClass.my && TestClass.my.meta, "Class-level symbiont was created");
    
    this.ok(TestClass.meta.hasAttribute('res'), "TestClass has 'res' attribute"); 
    this.ok(TestClass.meta.hasMethod('result'), "TestClass has 'result' method");

    this.ok(TestClass.my.meta.hasAttribute('res'), "TestClass.my has 'res' attribute"); 
    this.ok(TestClass.my.meta.hasMethod('result'), "TestClass.my has 'result' method");
    
    
    var testClass = new TestClass();
    
    this.ok(testClass, "TestClass was instantiated");
    this.ok(testClass.res == 'instance', "Usual attribute was correctly installed");
    this.is(testClass.result(), 'TestClass:instance', "Method was correctly installed");
    
    this.ok(TestClass.my.res == 'class', "Symbiont's attribute was correctly installed");
    this.is(TestClass.my.result(), 'TestClass:class', "Symbiont's method was correctly installed");
    
    
    //==================================================================================================================================================================================
    this.diag("Role with symbiont creation");
    
    Role('Walk', { 
        my : {
            have : {
                walking : false
            },
            
            methods : {
                walk : function (where) { this.walking = true },
                stop : function () { this.walking = false }
            }
        }
    });
    
    this.ok(Walk.my.hasAttribute('walking') && Walk.my.getAttribute('walking').value == false, 'Walk has correct attribute walking');
    this.ok(Walk.my.hasMethod('walk'), 'Walk has method walk');
    this.ok(Walk.my.hasMethod('stop'), 'Walk has method stop');


    //==================================================================================================================================================================================
    this.diag("Role with symbiont applying");
    
    TestClass.meta.extend({ 
        does : [ Walk ]
    });
    
    this.ok(TestClass.my.meta.hasAttribute('walking'), "TestClass.my has 'walking' attribute"); 
    this.ok(TestClass.my.meta.hasMethod('walk'), "TestClass.my has 'walk' method");
    
    
    TestClass.my.walk('there');
    this.ok(TestClass.my.walking, 'TestClass is walking');
    TestClass.my.stop();
    this.ok(!TestClass.my.walking, 'TestClass is not walking');
        
    //==================================================================================================================================================================================
    this.diag("Symbiont inheritance");
    
    Class('SubTestClass', {
    	isa : TestClass,
    	
    	my : {
    		
    		after : {
    			initialize : function () { this.res = 'SubTestClass:res' }
    		},
    		
            methods : {
                result : function() { return 'SubTestClass:class' }
            }
    	}
    })
    
    this.ok(SubTestClass.my.meta.hasAttribute('res'), "SubTestClass.my has 'res' attribute"); 
    this.ok(SubTestClass.my.meta.hasMethod('result'), "SubTestClass.my has 'result' method");
    this.is(SubTestClass.my.res, 'SubTestClass:res', "Symbiont's 'after' modifier was executed");
    this.is(SubTestClass.my.result(), 'SubTestClass:class', "Symbiont's method was correctly overriden");
};

return testobj;
})()