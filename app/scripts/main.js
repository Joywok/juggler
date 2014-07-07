$(function(){

  Juggler.addRegions({
    headerRegion:'#header',
    bannerRegion:'#banner',
    mainRegion:'#main',
    footerRegion:'#footer',
    dialogRegion:'#dialog',
    notifyRegion:'#notify'
  });

  Juggler.addInitializer(function(){

    var User = Backbone.Model.extend({
        schema: {
            title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
            name:       {type:'Text',validators:['required']},
            email:      { validators: ['required', 'email'] },
            birthday:   'Date',
            //password:   'Password',
            //address:    { type: 'NestedModel', model: Address },
            //notes:      { type: 'List', itemType: 'Text' }
        }
    });

    var user = new User();
     form = new Juggler.Views.Form({model:user});
    
    Juggler.mainRegion.show(form);

  });

  Juggler.start();

});
