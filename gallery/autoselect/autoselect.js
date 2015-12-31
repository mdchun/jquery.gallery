/**
 * @Description: autoselect
 * @Author:madechun
 * @Version:1.1
 * @Github URL:
 * @Date: 2015-12-31
 */
;(function (factory) {
    if (typeof define === "function" || define.amd || define.cmd) {
    	if( define.amd ){
 		    // AMD模式
	        define([ "Zepto" ], factory);
	    }else if( define.cmd ){
	    	// CMD
	        define(function(require,exports,module){
	        	module.exports = factory( window.Zepto || window.jQuery );
	        });
	    }
    } else {
        // 全局模式
        factory( window.Zepto || window.jQuery );
    }
}(function ($) {
    "use strict";

    var config = {
		a : 1
	};

	function AutoSelect(element,opt){
		this.$ele = $(element);

		this.opt = opt || {};

		$.extend(this.opt,config);

		console.log(this.$ele)
		console.log(this.opt);
	}

	AutoSelect.prototype = {
		constructor : AutoSelect,

		init : function(){

		},

		bindEvent : function(){

		},

		getData : function(){

		},

		render : function(){

		},

		destroy : function(){

		}

	}

	$.fn.autoselect = function(opt){
		this.each(function(){
			return new AutoSelect(this,opt);
		});
	}

	var JQ = {};

	JQ.autoselect = function(ele,opt){
		return $(ele).each(function(){
			return new AutoSelect(this,opt);
		});
	}

    return JQ.autoselect;

}));