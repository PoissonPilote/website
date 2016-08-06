/*********************
 * aau-menutoggle.js *
 *********************/

(function ($) {

  /* MENUTOGGLE CLASS DEFINITION */

  var MenuToggle = function (element, options) {
    this.$element = $(element);
    this.options = options;
    this.init();
  };

  MenuToggle.prototype = {

    // Build
    init: function () {
      this.$element.on('click', $.proxy(this.toggle, this));
      return this;
    },

    toggle: function (data) {
      if(typeof(data) === 'object'){
        data.preventDefault();
      }
      var target = this.options.target;
      if(target!==""){
        target = $(target);
      }else{
        target = this.$element;
      }
      if(target.hasClass('open')){
        this._close();
      }else{
        this._open();
      }
    },

    _open: function () {
      var target = this.options.target;
      if(target!==""){
        $(target).addClass('open');
      }else{
        this.$element.addClass('open');
      }
    },

    _close: function () {
      var target = this.options.target;
      if(target!==""){
        $(target).removeClass('open');
      }else{
        this.$element.removeClass('open');
      }
    }
  };

  /* MENUTOGGLE PLUGIN DEFINITION */
  var old = $.fn.menutoggle;

  $.fn.menutoggle = function (option) {
    return this.each(function() {
      var data = $(this).data('aau.menutoggle'),
          options = $.extend({}, $.fn.menutoggle.defaults, $(this).data(), typeof option === 'object' && option);
      if (!data) {
        $(this).data('aau.menutoggle', (data = new MenuToggle(this, options)));
      }
      if (typeof option === 'string') {
        data['_'+option]();
      }
    });
  };

  $.fn.menutoggle.defaults = {
    target: ''
  };

  $.fn.menutoggle.Constructor = MenuToggle;

  /* MENUTOGGLE NO CONFLICT */
  $.fn.menutoggle.noConflict = function () {
    $.fn.menutoggle = old;
    return this;
  };

  /* MENUTOGGLE ON LOAD */
  $(window).on('load', function (){
    $('[data-aau="menutoggle"]').each(function(){
      var options = {
        target : $(this).attr("data-target")
      };
      $(this).menutoggle(options);
    });

  });
})(window.jQuery);
