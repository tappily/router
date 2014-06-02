(function($) {
  'use strict';

  var tabs = $.document.querySelectorAll('.tabs');

  for(var i= 0, l, ls = $.document.querySelectorAll('.tabs'); l = ls[i];i++) {
    l.addEventListener('change', function(e) {
      if(e.target.name && e.target.name === 'tab-visible') {
        $.scroll(0,0);
        $.document.querySelector('body').scrollTop = 0;
      }
    });
  }
})(window);
