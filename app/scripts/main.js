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

    var User = Backbone.Model.extend({
        schema: {
            title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
            name:       {type:'Text',validators:['required']},
            email:      { validators: ['required', 'email'] },
        },
        url:'test'
    });

    var user = new User();
     form = new Juggler.Views.Test({model:user,submitButton:'提交'});
     console.log(form)
     
    //var progressbar = new Juggler.Views.Progressbar({progress:20});
    
    Juggler.mainRegion.show(form);
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
