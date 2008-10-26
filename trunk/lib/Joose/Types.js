(function (Type) {
	Type('Any', {
	    // Returns true for any type
	    where: function(o) {
			return true
	    }
	});


	Type('Null', {
	    uses: TYPE.Any,
	    where: function(o) {
	        if (o === null) {
	            return true;
	        }
	        return false;
	    }
	});
	
	Type('NotNull', {
        uses: TYPE.Any,
        where: function(o) {
            if (o === null) {
                return false;
            }
            return true;
        }
    });

	Type('Obj', {
	    uses: TYPE.NotNull,
	    where: function (o) {
	        if ( o instanceof Object ) {
	            return true;
	        }
	        return false;
	    }
	});

	Type('Str', {
	    uses: TYPE.NotNull,
	    where: function(S) {
	        if ( typeof S == 'string' || S instanceof String ) {
	            return true;
	        }
	        return false
	    },
	    coerce: [{
	        from: TYPE.Any,
	        via:  function (value) {
	            if(value == null) {
	                return ""
	            } else {
	                return "" + value
	            }
	        }
	    }]
	});

	Type('Num', {
	    uses: TYPE.NotNull,
	    where: function(N) {
	        if ( typeof N == 'number' || N instanceof Number ) {
	            return true;
	        }
	        return false
	    },
	    coerce: [{
	        from: TYPE.Str,
	        via:  function (value) {
	            // TODO parse for valid format
	            return parseFloat(value)
	        }
	    }]
	});

	Type('Bool', {
	    uses: TYPE.NotNull,
	    where: function(B) {
	        if (B === true || B === false) {
	            return true;
	        }
	        return false;
	    },
	    coerce: [{
            from: TYPE.Any,
            via:  function (value) {
                if(value == 1 || value == "1") {
                    return true
                }
                if(value == null || value == 0 || value == "0" || value == "") {
                    return false
                }
                return null
            }
        }]
	});

	Type('Int', {
	    uses: TYPE.Num,
	    where: function(n) {
	        var sn = String(n);
	        if ( sn.match(/^\d*\.\d$/) ) {
	            return false;
	        }
	        return true;
	    },
	    coerce: [{
            from: TYPE.Str,
            via:  function (value) {
                if(value.match(/^-{0,1}\d+$/)) {
                    return parseInt(value)
                }
                return
            }
        }]
	});

	//TODO(jwall): Float is starting to look superfluous Floats are a superset of Int
	//and javascript has no good way to differentiate between Num and Float
	//It's only benefit is semantic sugar. TYPE.Float = TYPE.Num?
	Type('Float', {
	    uses: TYPE.Num,
	    where: function(n) {
	        return true
	    }
	});

	Type('Func', {
	    uses: TYPE.Obj,
	    where: function (f) {
	        if ( typeof f == 'function' ) {
	            return true;
	        }
	        return false;
	    }
	});

	Type('Array', {
	    uses: TYPE.Obj,
	    where: function (A) {
	        if ( A instanceof Array ) {
	            return true;
	        }
	        return false;
	    }
	});

	Type('Date', {
	    uses: TYPE.Obj,
	    where: function (D) {
	        if ( D instanceof Date ) {
	            return true;
	        }
	        return false;
	    },
	    coerce: [{
	        from: TYPE.Str,
	        via:  function (value) {
	            var match;
	            if(match = value.match(/\s*(\d+)-(\d+)-(\d+)/)) {
	                return new Date(match[1], match[2]-1, [match[3]])
	            }
	            return null
	        }
	    }]
	});

	Type('Joose', {
	    uses: TYPE.Obj,
	    where: function (o) {
	        //TODO not sure if this is correct yet.
	        if ( o.meta && o.meta.meta.isa(Joose.Class) ) {
	            return true;
	        }
	        return false;
	    }
	});	
})(JooseType)