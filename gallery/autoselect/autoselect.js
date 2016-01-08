/**
 * @Description: autoselect
 * @Author:madechun
 * @Version:1.1
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
    	ajaxURL : '', // 请求的url
    	param : {}, // 请求时额外的参数
    	listNumber : null, // 下拉列表展示的个数 默认展示所有
		activeCallback : null, // hover的回调
		selectedCallback : null // 选中的回调
	};

	var eventType = window.Zepto ? 'tap' : 'click';


	function AutoSelect(element,opt){
		this.$ele = $(element);

		this.opt = opt || {};

		$.extend(true,{},this.opt,config);

		this.init();
	}

	AutoSelect.prototype = {
		constructor : AutoSelect,

		init : function(){
			this.bindInputEvent();
		},

		bindInputEvent : function(){
			var me = this;
			this.$ele.off('propertychange input')
					.on('propertychange input',function(e){
						var oValue = e.target.value;
						me.getData(oValue);
					});
			this.bindItemEvent();
		},

		bindItemEvent : function(){
			var me = this;
			// var oParent = 
			var indexLi = -1;

			// this.$ele.on('blur',function(){
			// 	me.$ele.parent().find('.searchCar-warp').hide();
			// });

			this.$ele.parent().delegate('.searchCar-warp li','mouseenter',function(e){
				indexLi = $(this).index();
				$(this).addClass("active").siblings().removeClass();
				me.opt.activeCallback && me.opt.activeCallback(indexLi);	
			});
			this.$ele.parent().delegate('.searchCar-warp li',eventType,function(e){
				indexLi = $(e.target).index();
				setVal(indexLi);
			});

			function setVal(index){
				if(index) {
					indexLi = index;
				}
				var liVal = me.$ele.parent().find('li').eq(indexLi).text();
				me.$ele.val(liVal);
				blus();
				me.opt.selectedCallback && me.opt.selectedCallback(indexLi,liVal);
			}

			function blus(){
				me.$ele.parent().find('.searchCar-warp').hide();
				indexLi = -1;
			}

			//点击document隐藏下拉层
			// $(document).unbind(eventType);
			$(document).on(eventType,function(event){
				$('.searchCar-warp').hide();
				indexLi = -1;
				// if($(event.target).attr("class") == 'searchCar-warp' || $(event.target).is("li")){
				// 	var liVal = $(event.target).text();
				// 	me.$ele.val(liVal);
				// 	blus();
				// }else{
				// 	blus();
				// }
			});

			//按键盘的上下移动LI的背景色
			this.$ele.unbind('keydown');
			this.$ele.bind('keydown',function(event){
				if(event.which == 38){//向上
					keychang("up")
				}else if(event.which == 40){//向下
					keychang()
				}else if(event.which == 13){ //回车
					setVal();
				}
			});

			//键盘上下执行的函数
			function keychang(up){
				if(up == "up"){
					if(indexLi == 0){
						indexLi = me.$ele.parent().find('li').length-1;
					}else{
						indexLi--;
					}
				}else{
					if(indexLi ==  me.$ele.parent().find('li').length-1){
						indexLi = 0;
					}else{
						indexLi++;
					}
				}
				// console.log(indexLi)
				me.$ele.parent().find('li').eq(indexLi).addClass("active").siblings().removeClass();	
			}

		},

		getData : function(value){
			var me = this;
			// $.ajax({

			// })
			var data = [{
						id : '浙A13456'
						},{
						id : '浙A48965'
						},{
						id : '浙ML4567'
						},{
						id : '浙B78129'
						},{
						id : '浙A1323M'
						},{
						id : '浙A18888'
						},{
						id : '浙A66666'
						},{
						id : '浙A99999'
						}];
			this.render(data);

			// $.ajax({
			// 	url : me.opt.ajaxURL,
			// 	type : 'get',
			// 	data : me.opt.param,
			// 	dataType : 'json',
			// 	error : function(){},
			// 	success : function(data){
			// 		if(data.success && data.content.list && data.content.list.length >0){
			// 			me.render(data.content.list);
			// 		}else{

			// 		}
			// 	}
			// });
		},

		render : function(data){
			var me = this;

			if(!data.length){ 
				return;
			}

			if(me.opt.listNumber && parseInt(me.opt.listNumber)>0 && data.length >= me.opt.listNumber){
				data.length = me.opt.listNumber;
			}

			var tmp = '';
			$.each(data,function(i,v){
				tmp += [
						'<li>',
						v.id,
						'</li>'
					].join('');
			});

			this.oParent = this.$ele.parent();
			if(this.oParent.find('.searchCar-warp').length){
				this.oParent.find('.searchCar-warp').show().html(tmp);
			}else{
				var $ul = $('<ul class="searchCar-warp">');
				$ul.html(tmp);
				this.oParent.append($ul);
			}

			this.setStyle();

			// this.bindListEvent();
			
		},

		setStyle : function(){
			var me = this;
			this.oParent.css({
				position:'relative'
			})
			this.oParent.find('.searchCar-warp').css({
				top: me.oParent.height(),
				width : me.$ele.width()
			});
		},

		bindListEvent : function(){
			var me = this;
			var oParent = this.oParent;
			var indexLi = -1;
			// 鼠标点击和悬停LI
			oParent.find('.searchCar-warp li').off('mouseenter').off('click');
			oParent.find('.searchCar-warp li').on('mouseenter',function(){
				indexLi = $(this).index();//获取当前鼠标悬停时的LI索引值;
				$(this).addClass("active").siblings().removeClass();
				me.opt.activeCallback && me.opt.activeCallback(indexLi);	
			}).click(function(){
				setVal();
			});

			function setVal(){
				var liVal = oParent.find('li').eq(indexLi).text();
				me.$ele.val(liVal);
				blus();
				me.opt.selectedCallback && me.opt.selectedCallback(indexLi,liVal);
			}

			//点击document隐藏下拉层
			$(document).unbind(eventType);
			$(document).bind(eventType,function(event){
				if($(event.target).attr("class") == 'searchCar-warp' || $(event.target).is("li")){
					var liVal = $(event.target).text();
					me.$ele.val(liVal);
					blus();
				}else{
					blus();
				}
			})

			//按键盘的上下移动LI的背景色
			this.$ele.unbind('keydown');
			this.$ele.bind('keydown',function(event){
				if(event.which == 38){//向上
					keychang("up")
				}else if(event.which == 40){//向下
					keychang()
				}else if(event.which == 13){ //回车
					setVal();
				}
			});

			function blus(){
				oParent.find('.searchCar-warp').hide();
			}

			//键盘上下执行的函数
			function keychang(up){
				if(up == "up"){
					if(indexLi == 0){
						indexLi = oParent.find('li').length-1;
					}else{
						indexLi--;
					}
				}else{
					if(indexLi ==  oParent.find('li').length-1){
						indexLi = 0;
					}else{
						indexLi++;
					}
				}
				// console.log(indexLi)
				oParent.find('li').eq(indexLi).addClass("active").siblings().removeClass();	
			}
		},

		destroy : function(){
			this.oParent.find('.searchCar-warp').remove();
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