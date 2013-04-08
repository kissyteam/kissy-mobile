(function(root, factory) {
  // Set up Zepto-GFX appropriately for the environment.
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define('zepto-gfx', ['zepto'], function( Zepto ) {
      factory( Zepto );
    });
  } else {
    // Browser global scope
    factory( root.Zepto );
  }
}(this, function ( $ ) {

  var defaults = {
    duration: 400,
    easing: ''
  },

  vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : 'moz',

  prefix = '-' + vendor + '-',

  vendorNames = n = {
    transition: prefix + 'transition',
    transform: prefix + 'transform',
    transitionEnd: vendor + 'TransitionEnd'
  },

  transformTypes = [
    'scale', 'scaleX', 'scaleY', 'scale3d',
    'rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d',
    'translate', 'translateX', 'translateY', 'translateZ', 'translate3d',
    'skew', 'skewX', 'skewY',
    'matrix', 'matrix3d', 'perspective'
  ];

  // Implement Array.prototype.indexOf if it's not.  This is
  // mainly Internet Explorer.
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
      }
      return -1;
    };
  }

  // Helper function for easily adding transforms.
  $.fn.transform = function (properties) {
    var transforms = [];
    
    for (var key in properties) {
      if (transformTypes.indexOf(key) !== -1) {
        transforms.push(key + '(' + properties[key] + ')');
        delete properties[key];
      }
    }

    if (transforms.length) { properties[n.transform] = transforms.join(' '); }

    return $(this).css(properties);
  };

  // Effects

  $.fn.gfxPopIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});
        
    opts.scale = opts.scale || 0.2;

    $that.transform({
      '-webkit-transform-origin': '50% 50%',
      '-moz-transform-origin': '50% 50%',
      scale: opts.scale,
      opacity: '0',
      display: 'block'
    }).animate({scale: '1', opacity: '1'},
      opts.duration, opts.easing, cb);
  };

  $.fn.gfxPopOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});

    opts.scale = opts.scale || 0.2;

    $that.transform({
      '-webkit-transform-origin': '50% 50%',
      '-moz-transform-origin': '50% 50%',
      scale: '1',
      opacity: '1'
    }).animate({opacity: 0, scale: opts.scale},
      opts.duration, opts.easing, function () {

      $that.transform({display: 'none', opacity: 1, scale: 1});

      cb && cb();
    });
  };

  $.fn.gfxFadeIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});
        
    opts.duration = opts.duration || 1000;
    
    $that.css({opacity: 0}).show().animate({opacity: 1}, opts.duration,
      opts.easing, cb);
  };

  $.fn.gfxFadeOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});
    
    $that.css({opacity: 1}).animate({opacity: 0}, opts.duration,
      opts.easing, function () {
        
      $that.hide().css({opacity: 1});
      cb && cb();
    });
  };

  $.fn.gfxShake = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        distance,
        third = function () {
          $that.animate({translateX: distance + 'px'},
            opts.duration, opts.easing, function () {

            $that.transform({translateX: 0});
            cb && cb();
          });
        },
        second = function () {
          $that.animate({translateX: '-' + distance + 'px'},
            opts.duration, opts.easing, third);
        },
        first = function () {
          $that.animate({translateX: distance + 'px'},
            opts.duration, opts.easing, second);
        };

    opts.duration = opts.duration || 100;
    opts.easing = opts.easing || 'ease-out';
    distance = opts.distance || 20;

    $that.animate({translateX: '-' + distance + 'px'},
      opts.duration, opts.easing, first);
  };

  $.fn.gfxBlip = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        first = function () {
          $that.animate({scale: 1}, opts.duration,
            opts.easing, cb);
        };

    opts.scale = opts.scale || 1.15;

    $that.animate({scale: opts.scale}, opts.duration,
      opts.easing, first);
  };

  $.fn.gfxExplodeIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});

    opts.scale = opts.scale || 3;

    $that.transform({scale: opts.scale, opacity: 0,
      display: 'block'}).animate({scale: 1, opacity: 1},
      opts.duration, opts.easing, cb);
  };

  $.fn.gfxExplodeOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        c = cb,
        first = function() {
          $that.transform({scale: 1, opacity: 1, display: 'none'});
          cb && cb();
        };

    if (opts.reset) c = second;
    opts.scale = opts.scale || 3;

    $that.transform({scale: 1, opacity: 1})
         .animate({scale: opts.scale, opacity: 0}, opts.duration, opts.easing, c);
  };

  $.fn.gfxFlipIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});
    $that.transform({rotateY: '180deg', scale: 0.8,
      display: 'block'}).animate({rotateY: 0, scale: 1},
        opts.duration, opts.easing, cb);
  };

  $.fn.gfxFlipOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        c = cb,
        first = function () {
          $that.transform({scale: 1, rotateY: 0, display: 'none'});
          cb && cb();
        };

    if (opts.reset) { c = first; }

    $that.transform({rotateY: 0, scale: 1})
      .animate({rotateY: '-180deg', scale: 0.8}, opts.duration,
      opts.easing, c);
  };

  $.fn.gfxRotateOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        c = cb
        first = function () {
          $that.transform({rotateY: 0, display: 'none'});
          cb && cb();
        };

    if (opts.reset) { c = first; }

    $that.transform({rotateY: 0}).animate({rotateY: '-180deg'},
      opts.duration, opts.easing, c);
  };

  $.fn.gfxRotateIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {});

    $that.transform({rotateY: '180deg', display: 'block'})
      .animate({rotateY: 0}, opts.duration, opts.easing, cb);
  };

  $.fn.gfxSlideOut = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        distance,
        opacity;

    opts.direction = opts.direction || 'right';
    distance = opts.distance || 100;
    if (opts.direction === 'left') { distance *= -1; }
    distance += '%';

    opacity = opts.fade ? 0 : 1;

    $that.show().animate({translate3d: distance + ',0,0',
      opacity: opacity}, opts.duration, opts.easing, function () {

      $that.transform({translate3d: '0,0,0', opacity: 1}).hide();
      cb && cb();
    });
  };

  $.fn.gfxSlideIn = function (options, cb) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        distance,
        opacity;

    opts.direction = opts.direction || 'right';
    distance = opts.distance || 100;
    if (opts.direction === 'left') { distance *= -1; }
    distance += '%';

    opacity = opts.fade ? 0 : 1;

    $that.transform({translate3d: distance + ',0,0',
      opacity: opacity}).show().animate({translate3d: '0,0,0',
      opacity: 1}, opts.duration, opts.easing, cb);
  };
  
}));