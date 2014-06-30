

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

  });

  Juggler.module('Views',function(Views,Juggler,Backbone,Marionette,$,_){

  });

  Juggler.module('Widgets',function(Widgets,Juggler,Backbone,Marionette,$,_){

  });

  Juggler.module('Enities',function(Enities,Juggler,Backbone,Marionette,$,_){

  });


  Juggler.on('initialize:after',function(){
    if(Backbone.history)
        Backbone.history.start();
  });


  return Juggler;
}));
