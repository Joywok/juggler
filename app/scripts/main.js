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
     form = new Juggler.Views.Form({model:user,submitButton:'提交'}).render();
     
    var progressbar = new Juggler.Views.Progressbar({progress:20});
    
    //Juggler.mainRegion.show(form);
    Juggler.progressRegion.show(progressbar);
    
    BootstrapDialog.show({
      title:'填写表单',
      message:form.el
    })

  });

  Juggler.start();

});
