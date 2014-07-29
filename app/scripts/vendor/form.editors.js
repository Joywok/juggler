;(function (Form) {
    
    Form.editors.ComboBox = Form.editors.Base.extend({

      tagName: 'div',
      
      className:'dropdown',
      
      container:'.dropdown-menu',
      
      itemLabel:'name',
      
      itemValue:'value',

      multi:false,
      
      template:_.template('<div class="input-group"data-toggle="dropdown" >\
      <div class="form-control form-control-wrapper">\
      <div class="pull-left form-control-static "></div>\
      <div class="input-wrapper"><input class="form-control" /></div>\
      </div>\
      <span class="input-group-btn">\
      <button type="button" class="btn btn-default dropdown-toggle">\
      <span class="caret"></span></button>\
      </span>\
      </div>\
      <ul class="dropdown-menu" role="menu"></ul>'),

      events: {
        'change': function(event) {
          this.trigger('change', this);
        },
        'focus':  function(event) {
          this.trigger('focus', this);
        },
        'blur':   function(event) {
          this.trigger('blur', this);
        },
        'click .dropdown-menu li a':'select'
      },

      initialize: function(options) {
        Form.editors.Base.prototype.initialize.call(this, options);

        if (!this.schema || !this.schema.options) throw new Error("Missing required 'schema.options'");
        
        this.$el.addClass('backbone-forms-dropdown');
        
        this.setOptions(this.schema.options);

        if(this.multi){
            this.selectedValues = new Backbone.Collection();
        }
        
      },

      render: function() {
        
        this.$el.html(this.template());
        
        this.renderOptions(this.schema.options);

        this.$input = this.$el.find('input');

        return this;
      },

      /**
       * Sets the options that populate the <select>
       *
       * @param {Mixed} options
       */
      setOptions: function(options) {
        var self = this;

        //If a collection was passed, check if it needs fetching
        if (options instanceof Backbone.Collection) {
          var collection = this.collection = options;
          
          collection.on('reset',this.render,this);
          
          //Don't do the fetch if it's already populated
          if (collection.length > 0) {
            this.render();
          } else {
            collection.fetch({data:{s:'test'},reset:true});
          }
        }

        //If a function was passed, run it to get the options
        else if (_.isFunction(options)) {
          options(function(result) {
            self.renderOptions(result);
          }, self);
        }

        //Otherwise, ready to go straight to renderOptions
        else {
          this.renderOptions(options);
        }
      },

      /**
       * Adds the <option> html to the DOM
       * @param {Mixed}   Options as a simple array e.g. ['option1', 'option2']
       *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
       *                      or as a string of <option> HTML to insert into the <select>
       *                      or any object
       */
      renderOptions: function(options) {
        var $select = this.$(this.container)||this.$el,
            html;

        html = this._getOptionsHtml(options);

        //Insert options
        $select.html(html);

        //Select correct option
        this.setValue(this.value);
      },

      _getOptionsHtml: function(options) {
        var html;
        //Accept string of HTML
        if (_.isString(options)) {
          html = options;
        }

        //Or array
        else if (_.isArray(options)) {
          html = this._arrayToHtml(options);
        }

        //Or Backbone collection
        else if (options instanceof Backbone.Collection) {
          html = this._collectionToHtml(options);
        }

        else if (_.isFunction(options)) {
          var newOptions;

          options(function(opts) {
            newOptions = opts;
          }, this);

          html = this._getOptionsHtml(newOptions);
        //Or any object
        }else{
          html=this._objectToHtml(options);
        }

        return html;
      },


      getValue: function() {
        return this.multi?this.selectedValues.toJSON():this.$input.val();
      },

      setValue: function(item) {
        this.$el.find('input').val(item[this.itemLabel]);
        this.multi&&this.selectedValues.add(item);
      },

      focus: function() {
        if (this.hasFocus) return;

        this.$el.focus();
      },

      blur: function() {
        if (!this.hasFocus) return;

        this.$el.blur();
      },
      
      select:function(e){
          var index = $(e.target).parent().index();
          var item = this.collection.at(index);
          this.setValue(item.toJSON());
      },

      /**
       * Transforms a collection into HTML ready to use in the renderOptions method
       * @param {Backbone.Collection}
       * @return {String}
       */
      _collectionToHtml: function(collection) {
        //Convert collection to array first
        var array = collection.toJSON();

        //Now convert to HTML
        var html = this._arrayToHtml(array);

        return html;
      },
      /**
       * Transforms an object into HTML ready to use in the renderOptions method
       * @param {Object}
       * @return {String}
       */
      _objectToHtml: function(obj) {
        //Convert object to array first
        var array = [];
        for(var key in obj){
          if( obj.hasOwnProperty( key ) ) {
            array.push({ val: key, label: obj[key] });
          }
        }

        //Now convert to HTML
        var html = this._arrayToHtml(array);

        return html;
      },



      /**
       * Create the <option> HTML
       * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
       *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
       * @return {String} HTML
       */
      _arrayToHtml: function(array, tagName) {
        var html = [];
        tagName = tagName ? tagName : 'li';
        //Generate HTML
        _.each(array, function(option) {
          
            html.push('<'+tagName+'><a>'+option.name+'</a></'+tagName+'>');
          
        }, this);

        return html.join('');
      }

    });

    
    Form.editors.TagsInput = Form.editors.Text.extend({
        
        initialize:function(){
            var that = this;
            var config = {
                itemValue:'text',
                source:function(query){
                    source = $.Deferred();
                    that.collection.fetch({data:{s:query},dataType:'jsonp',jsonpCallback:'test',reset:true});
                    return source;
                }
            };
            var source = $.Deferred();
            
            Form.editors.Text.prototype.initialize.apply(this,arguments);
            
            this.collection = this.collection||this.schema.collection;
            this.collection.on('reset',function(){console.log(this.toJSON())
                source.resolve(this.toJSON());
            });
            
            _.extend(config,_.pick(this.schema,'config'));
            
            _.defer(function(){
                that.$el.tagsinput(config);
            });
        },
        getValue:function(){
            return this.$el.data('tagsinput')?this.$el.tagsinput('items'):this.model.get(this.key);
        },
        remove:function() {
            this.$el.tagsinput('destroy');
            Form.editors.Text.prototype.remove.apply(this,arguments);
        }
    });

})(Backbone.Form)