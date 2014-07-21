;(function (Form) {
    
    Form.editors.ComboBox = Form.editors.Text.extend({
        initialize:function(options){
            Form.editors.Base.prototype.initialize.call(this, options);
            
        },
        render:function(){
            //this.$el.popover()
            return this;
        },
        getValue:function () {
            //return this.$el.tagsinput('items');
        },
        setValue:function(value){console.log(value)
            //this.$el.tagsinput('add',value);
        },
        remove:function(){
            Form.editors.Text.prototype.remove.apply(this,arguments);
            
        }
    });
    
    Form.editors.TagsInput = Form.editors.Text.extend({
        initialize:function(){
            Form.editors.Text.prototype.initialize.apply(this,arguments);
            _.bindAll(this,'initTagsInput');
            _.defer(this.initTagsInput);
        },
        initTagsInput:function(){
            var that = this,
                tagsinput_defaults={},
                typeahead_defaults={
                    minLength:0,
                    freeInput:true,
                    source:function(query){
                        return that.schema.collection.fetch({data:{s:query}});
                    }
                },
                tagsinput = _.extend(tagsinput_defaults,this.schema.tagsinput);
                
            tagsinput.typeahead=_.extend(typeahead_defaults,this.schema.typeahead);
            
            this.$el.tagsinput(tagsinput);
        },
        getConfig:function(){
            var schema = this.schema;
            return {
                typeahead:{
                    minLength:0,
                    freeInput:true,
                    source:function(query){
                        return schema.collection.fetch({data:{s:query}});
                    },
                    updater:function(item){
                        console.log(item)
                        return item;
                    }
                }
            };
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