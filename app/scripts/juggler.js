

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['marionette','backbone', 'underscore'], function(Marionette, Backbone, _) {
      return (root.Juggler = factory(root, Marionette, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Marionette = require('marionette');
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(root, Marionette, Backbone, _);
  } else {
    root.Juggler = factory(root, root.Marionette, root.Backbone, root._);
  }

}(this, function(root, Marionette, Backbone, _) {
  'use strict';



  var previousJuggler = root.Juggler;

  var Juggler = Backbone.Juggler = new Marionette.Application();

  Juggler.VERSION = '0.0.1';

  Juggler.noConflict = function() {
    root.Juggler = previousJuggler;
    return this;
  };

  Backbone.Juggler = Juggler;


  Juggler.Controller = Marionette.Controller.extend({

  });

  Juggler.Model = Backbone.Model.extend({

  });

  Juggler.Collection = Backbone.Collection.extend({

  });



  Juggler.module('Templates',function(Templates,Juggler,Backbone,Marionette,$,_){

    //通用布局组件的模板
    Templates.layout = function(data){
        var $el = $('<div>');
        $.each(data.regions,function(key,value){
           var $item = $('<div>').addClass(data.regionClass)
            if(value.indexOf('#')==0)
                $item.attr('id',value.replace('#',''))
            else if(value.indexOf('.')==0)
                $item.addClass(value.split('.').join(' '))
            $el.append($item);
        });

        return $el.html();
    };


  });

  Juggler.module('Views',function(Views,Juggler,Backbone,Marionette,$,_){

    Views.ItemView = Marionette.ItemView.extend({
        constructor:function(){
            this.options = Marionette.getOption(this,'defaults');
            Marionette.ItemView.prototype.constructor.apply(this,arguments);
        },
        template:_.template('')
    });

    Views.EmptyView = Views.ItemView.extend({
        className:'alert alert-warning',
        template:Juggler.Templates.empty,
        defaults:{text:'没有找到符合条件的数据！'},
        serializeData:function(){return this.options}
    });

    Views.Layout = Marionette.LayoutView.extend({
        constructor:function(options){
            this.options = Marionette.getOption(this,'defaults');
            this.regions = Marionette.getOption(this,'regions')||{};
            Marionette.Layout.prototype.constructor.apply(this,arguments)
        },
        defaults:{
            regionClass:'layout-region',
            regions:{}
        },
        className:'row',
        template:Juggler.Templates.layout,
        onRender:function(){
            var that= this,
                regions = Marionette.getOption(this,'regions');
            if(!_.isEmpty(regions))
                this.addRegions(regions);
            else
                this.$el.find('.'+this.options.regionClass).each(function(i,item){
                    var id = $(item).attr('id');
                    if(id)that.addRegion(id,'#'+id)
                });
        },
        serializeData:function(){
            return this.options;
        }
    });

    Views.CompositeView = Marionette.CompositeView.extend({
        emptyView: Views.EmptyView,
        itemViewContainer: "",
        template: _.template(''),
        getChildView: function (item) {
            return Views[item.get('viewType')] || Marionette.getOption(this, "childView") || this.constructor;
        }
    });

    Views.Form = Backbone.Form.extend({
        initialize:function(){
            Backbone.Form.prototype.initialize.apply(this,arguments);
            console.log(this)
            this.on('change',function(form){
                console.log(this);
                console.log(form)
            });
        }
    });


  });

  Juggler.module('Widgets',function(Widgets,Juggler,Backbone,Marionette,$,_){

  });

  Juggler.module('Enities',function(Enities,Juggler,Backbone,Marionette,$,_){

  });


  Juggler.on('start',function(){
    
    if(Backbone.history)
        Backbone.history.start();
        
  });


  return Juggler;
}));
