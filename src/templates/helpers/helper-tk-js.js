module.exports.register = function (Handlebars)  {
  'use strict';

  Handlebars.registerHelper('tk-js', function (context)  {
    var html = '';

    if(context) {
      html = html.concat('<script src="//',
        context.host, '/', context.id, '.js"></script>',
      '<script>try{Typekit.load();}catch(e){}</script>');
    }

    return new Handlebars.SafeString(html);
  });
};
