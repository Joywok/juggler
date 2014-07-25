$(function(){

  Juggler.addRegions({
    headerRegion:'#header',
    bannerRegion:'#banner',
    mainRegion:'#main',
    footerRegion:'#footer',
    dialogRegion:'#dialog',
    notifyRegion:'#notify',
    progressRegion:'#progress'
  });

  Juggler.addInitializer(function(){

    
    var cl = new Juggler.Collection;
    cl.reset([{name:'aaa',value:'aaa'},{name:'bbb',value:'bbb'}]);
    
    var Collection = Juggler.Collection.extend({
      parse:function(resp){
        return resp.data;
      }
    })
    
    var User = Backbone.Model.extend({
        schema: {
            combobox:{type:'ComboBox',options:cl},
            title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
            name:       {type:'TagsInput',validators:['required'],typeahead:{},collection:new Collection()},
            email:      { validators: ['required', 'email'] },
        },
        url:'test'
    });

    var user = new User({name:['aaa','bbb','ccc'],combobox:['aaa','bbb','ccc']});
     form = new Juggler.Views.Form({model:user,submitButton:'提交'});
     
     
     Juggler.Dialog.show({message:form.render().el})
     
    //var progressbar = new Juggler.Views.Progressbar({progress:20});
    
    //Juggler.mainRegion.show(form);
    //Juggler.progressRegion.show(progressbar);
    
    var $button=$('<button>弹</button>');
    //$('#main').append($button)
    //$button.popover({title:'test',content:form.el,html:true})
    /*
    new Juggler.Views.Template({
      template:'div>ul>li*3'
    });
    */
    
    

  });

  Juggler.start();

});
