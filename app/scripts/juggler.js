

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
           var $item = $('<div>').addClass(data.regionClass);
            if(value.indexOf('#')==0)
                $item.attr('id',value.replace('#',''));
            else if(value.indexOf('.')==0)
                $item.addClass(value.split('.').join(' '));
            $el.append($item);
        });

        return $el.html();
    };
    
    Templates.form = _.template('\
        <form class="form-horizontal" role="form">\
          <div data-fieldsets></div>\
          <% if (submitButton) { %>\
            <div class="form-group">\
            <div class="col-sm-10 col-sm-offset-2">\
            <button type="submit" class="btn btn-primary "><%= submitButton %></button>\
            </div>\
            </div>\
          <% } %>\
        </form>\
      ');



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
            Marionette.Layout.prototype.constructor.apply(this,arguments);
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
                    if(id)that.addRegion(id,'#'+id);
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
    
    Views.Item = Views.ItemView.extend({
        tagName:'li',
        template:_.template('<a data-target="#<%- value %>" data-toggle="tab"><%- name %></a>'),
        ui:{
            links:'a'
        },
        events:{
            'click @ui.links':'onClick'
        },
        onClick:function(){
            this.trigger('clicked',this.model)
        }
    });
    
    

    Views.List = Views.CompositeView.extend({
        tagName:'ul',
        template:_.template(''),
        itemView:Views.Item
    });
    
    
    Views.Form = Backbone.Form.extend({
      template:Juggler.Templates.form,
      events:{
        'submit':'onSubmit'
      },
      initialize:function(options){
        Backbone.Form.prototype.initialize.apply(this,arguments);
        this.options=options;
        this.errors = {};
        this.complete=true;
        this.submitButton = null;
        this.values = this.getValue();
        this.on('field:change field:blur',this.validateField,this);
        this.on('validate',this.toggleSubmit,this);
        this.model.on('request',this.onRequest,this);
        this.model.on('change',this.onModelChange,this);
      },
      handleEditorEvent:function(e,editor){
        Backbone.Form.prototype.handleEditorEvent.apply(this,arguments);
        this.trigger('field:'+e,editor.key);
      },
      templateData:function(){
        return {submitButton:this.options.submitButton||false}
      },
      render:function(){
        Backbone.Form.prototype.render.apply(this,arguments);
        this.trigger('render');
        this.validateEditors();
        
        return this;
      },
      validateField:function(key){
        var error = this.fields[key].validate();
        error?this.errors[key]=error:delete this.errors[key];
        this.trigger('validate',this.errors);
      },
      validateEditors:function(){
        for(var i in this.fields){
          var error = this.fields[i].editor.validate();
          if(error)this.errors[i]=error;
        };
        this.trigger('validate',this.errors);
      },
      getSubmitButton:function(){
        return this.submitButton?this.submitButton:this.$el.find(':submit');
      },
      toggleSubmit:function(){
        _.isEmpty(this.errors)&&this.complete
        ?this.getSubmitButton().removeClass('disabled').removeAttr('disabled')
        :this.getSubmitButton().addClass('disabled').attr('disabled','disabled')
      },
      onSubmit:function(e){
        e.preventDefault();
        if(this.commit())return;
        this.model.save();
      },
      onModelChange:function(){
        var values = this.model.toJSON();
        this.setValue(_.isEmpty(values)?this.values:values);
        this.validateEditors();
      },
      onRequest:function(model,xhr){
        var that = this;
        that.complete=false;
        this.toggleSubmit();
        xhr.always(function(){
          that.complete=true;
          that.toggleSubmit();
        })
        .success(function(){
          that.setValue(that.values);
        });
      }
    });
    
    
    Views.Progressbar = Views.ItemView.extend({
        className:'progress',
        template:_.template('<div class="progress-bar"></div>'),
        defaults:{
            type:'success',
            progress:0
        },
        ui:{
            bar:'.progress-bar'
        },
         modelEvents:{
          'request':'onRequest'
        },
        collectionEvents:{
          'request':'onRequest'
        },
        initialize:function(){
          this.progress = this.options.progress;
          _.bindAll(this,'onProgress','onComplete');
        },
        serializeData:function(){
            return this.options;
        },
        setProgress:function(progress){
            this.progress = progress;
            this.ui.bar.css('width',progress+'%')
              .text(progress+'%');
        },
        onRender:function(){
          this.ui.bar.addClass('progress-bar-'+this.options.type);
          this.setProgress(this.progress);
        },
        onRequest:function(enity,xhr){
          xhr.progress(this.onProgress).complete(this.onComplete);
        },
        onProgress:function(progress){
          this.setProgress(progress);
        },
        onComplete:function(){
          this.destroy();
        }
    });
    
    Views.Node = Marionette.ItemView.extend({
      initialize:function(){
        this.pNode=null;
        this.childNodes=[];
      }
    });
    
    Views.Template = Marionette.LayoutView.extend({
      //template:'aaa',
      initialize:function(){
        this.depth=0;
        this.cursor=0;
        this.state='blank';
        this.node = new Views.Node();
        this.tpl = this.getOption('template');
        this.triggerMethod('blank');
      },
      onBlank:function(){
        console.log(this.cursor);
        //console.log(this.node);
        if(this.cursor==this.tpl.length-1)return;
        var cur = this.tpl[this.cursor];
        switch(cur){
          case '.':
            this.triggerMethod('class');
            break;
          case  '#':
            this.triggerMethod('id');
            break;
          case '(':
            this.triggerMethod('group');
            break;
          case '+':
            this.triggerMethod('siblings');
            break;
          case '>':
            this.triggerMethod('children');
            break;
          default :
            //if(cur.match(/\w/))
            this.triggerMethod('tag');
        }
      },
      onTag:function(){
        console.log('on tag')
        var tagName = this.tpl.match(/\w+/)[0];
        this.node.tagName=tagName;
        this.cursor+=tagName.length;
        this.triggerMethod('blank');
      },
      onId:function(){
        console.log('on id')
      },
      onSiblings:function(){
        console.log('on siblings')
        this.state='children';
        this.cursor++;
        
        this.triggerMethod('blank')
      },
      onGroup:function(){
        console.log('on group')
      },
      onChildren:function(){
        console.log('on children')
        this.state='children';
        this.cursor++;
        this.depth++;
        this.triggerMethod('blank')
      },
      onClass:function(){
        console.log('on class')
      },
      render:function(){
        return this;
      }
    })
    
    
    Views.Test = Views.ItemView.extend({
      defaults:{
        submitButton:'提交'
      },
      template:Juggler.Templates.form,
      serializeData:function(){
        return this.options;
      },
      getTemplate:function(){
        var that = this;
        return function(){
          return Backbone.Form.prototype.render.apply(that).$el.html()
        }
      },
      templateData:function(){
        return this.serializeData();
      }
    });
    
    //整合Backbone.Form与Marionette.ItemView
    _.extend(Views.Test.prototype,_.omit(Backbone.Form.prototype,'render'))


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
