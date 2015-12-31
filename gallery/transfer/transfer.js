define(function(require, exports, module) {

    // require('./transfer.css');

    // var $ = require('$');
    // var Widget = require('widget');

    var i18n = {
        'zh-cn': {
            'unselected': '未选择',
            'selected': '已选择'
        },
        'en': {
            'unselected': 'Unselected',
            'selected': 'Selected'
        },
    };

    var source = $('#J_tpl').html();
    var tpl = Handlebars.compile(source);   
    // var tpl = require('./transfer.handlebars');
    var config = {
        locale: 'zh-cn',
        model: [],
        autoFocus: false
    };
    function Transfer(opt){
        this.opt = opt;
        $.extend({},this.opt,config);

        this.render();
    }

    Transfer.prototype = {
        constructor : Transfer,
        render : function(){

            this.element = $(this.opt.element);

            this._onRenderModel(this.opt.model);

            this.setup();
            this.bindEvent();
        },
        bindEvent : function(){
            this.onTransfer();
            this.onChoose();
        },
        get : function(key){
            // if(key && this.opt['key']){
                return this.opt[key];
            // }
        },
        setup : function(){
            var me = this;
            if (me.get('autoFocus')) {
                setTimeout(function() {
                    me.$('.J_Item').eq(0).focus();
                }, 0);
            }
        },
        _onRenderModel: function(model) {
            var me = this;
            var locale = me.get('locale');
            if (typeof locale === 'string') {
                locale = i18n[me.get('locale')];
            }
            me.element.html(tpl({
                i18n: locale || {},
                data: model
            }));
        },
        set : function(){
            this._onRenderModel(this.get('model'));
            this.bindEvent();

            this.element.trigger('change:model');
        },
        _transfer: function(direction) {
            var me = this;
            var model = me.get('model') || [];
            if (direction === 'left') {
                $('.J_Right').find('.selected').each(function() {
                    model[$(this).data('index')].choose = false;
                });
                setTimeout(function() {
                    $('.J_Left').find('.J_Item').eq(0).focus();
                }, 0);
            } else {
                $('.J_Left').find('.selected').each(function() {
                    model[$(this).data('index')].choose = true;
                });
                setTimeout(function() {
                    $('.J_Right').find('.J_Item').eq(0).focus();
                }, 0);
            }
            me.set();
        },
        getSelected: function() {
            var me = this;
            return $.grep(me.get('model') || [], function(n) {
                return n.choose;
            });
        },
        onTransfer : function(){
            var me = this;
            $('.J_Transfer').bind('click keydown',function(evt){
                var target = $(evt.currentTarget);
                var direction = target.data('direction');
                if (evt.type === 'click' || evt.keyCode === 32) {
                    if (target.hasClass('enable')) {
                        me._transfer(direction);
                        if (evt.keyCode) {
                            evt.preventDefault();
                        }
                    }
                }
            })
        },
        onChoose: function(){
            var me = this;
            $('.J_Item').bind('click keydown',function(evt){
                var target = $(evt.currentTarget);
                var jLeft = $('.J_Left');
                var jRight = $('.J_Right');
                var jTransfer = $('.J_Transfer');
                if (evt.type === 'click' || evt.keyCode === 32) {
                    target.toggleClass('selected');
                    jTransfer.removeClass('enable');
                    if (jLeft.find('.selected').size()) {
                        jTransfer.eq(1).addClass('enable');
                    }
                    if (jRight.find('.selected').size()) {
                        jTransfer.eq(0).addClass('enable');
                    }
                } else if (evt.keyCode === 37) { // left
                    if (jRight.find('.selected').size()) {
                        me._transfer('left');
                    } else {
                        jLeft.find('.J_Item').eq(0).focus();
                    }
                } else if (evt.keyCode === 38) { // up
                    target.parent().prev().children().focus();
                } else if (evt.keyCode === 39) { // right
                    if (jLeft.find('.selected').size()) {
                        me._transfer('right');
                    } else {
                        jRight.find('.J_Item').eq(0).focus();
                    }
                } else if (evt.keyCode === 40) { // down
                    target.parent().next().children().focus();
                }
                if (evt.keyCode === 32 || evt.keyCode === 37 ||evt.keyCode === 38 ||
                    evt.keyCode === 39 || evt.keyCode === 40) {
                    evt.preventDefault();
                }
            });
        },

        on : function(type,fn){
            this.element.bind(type,function(){
                fn && fn();
            })
        }

    }

    module.exports = Transfer;
});