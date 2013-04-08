(function(root, factory) {
  // Set up Zepto-GFX-Cube appropriately for the environment.
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define('zepto-gfx-cube', ['zepto'], function( Zepto ) {
      factory( Zepto );
    });
  } else {
    // Browser global scope
    factory( root.Zepto );
  }
}(this, function ( $ ) {
  
  var sides = {
    front: {rotateY: '0deg',    rotateX: '0deg'},
    back: {rotateY: '-180deg', rotateX: '0deg'},
    right: {rotateY: '-90deg',  rotateX: '0deg'},
    left: {rotateY: '90deg',   rotateX: '0deg'},
    top: {rotateY: '0deg',    rotateX: '-90deg'},
    bottom: {rotateY: '0deg',    rotateX: '90deg'}
  },
  
  defaults = {
    width: 300,
    height: 300,
    duration: 400,
    easing: ''
  },
  
  chromeRegex,
  chromeMatch,
  chrome11;
  
  $.fn.gfxCube = function (options) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        tZ = opts.translateZ || (opts.width / 2),
        wrapper = $('<div />'),
        front, back, right, left, top, bottom;
        
    if (typeof tZ === 'number') { tZ += 'px'; }
    
    $that.transform({
      position: 'relative',
      width: opts.width,
      height: opts.height,
      '-webkit-perspective': '3000',
      '-moz-perspective': '3000',
      '-webkit-perspective-origin': '50% 50%',
      '-moz-perspective-origin': '50% 50%'
    });
    
    wrapper.addClass('gfxCubeWrapper').transform({
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      overflow: 'visible',
      rotateY: '0deg',
      rotateX: '0deg',
      translateZ: '-' + tZ,
      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-webkit-transform-origin': '50% 50%',
      '-moz-transform-origin': '50% 50%'
    });
    
    $that.children()
      .wrapAll(wrapper)
      .css({
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflow: 'hidden'
    });
    
    front = $that.find('.front');
    back = $that.find('.back');
    right = $that.find('.right');
    left = $that.find('.left');
    top = $that.find('.top');
    bottom = $that.find('.bottom');
    
    front.transform({rotateY: '0deg', translateZ: tZ});
    back.transform({rotateY: '180deg', translateZ: tZ});
    right.transform({rotateY: '90deg',  translateZ: tZ});
    left.transform({rotateY: '-90deg', translateZ: tZ});
    top.transform({rotateX: '90deg', translateZ: tZ});
    bottom.transform({rotateX: '-90deg', translateZ: tZ});
    
    $that.bind('cube', function (e, type) {
      $that.find('.gfxCubeWrapper')
        .animate($.extend({}, {translateZ: '-' + tZ}, sides[type]),
        opts.duration, opts.easing, function () {
          
        $that.trigger('cube:changed', type);
      });
    });
  };
  
  // Disable cubes in Firefox / Chrome < 12.
  chromeRegex = /(Chrome)[\/]([\w.]+)/;
  chromeMatch = chromeRegex.exec(navigator.userAgent) || [];
  chrome11 = chromeRegex[1] && chromeRegex[2].test(/^12\./);
  
  if (!$.browser.webkit || chrome11) {
    $.fn.gfxCube = function (options, cb) {
      var $that = $(this),
          opts = $.extend({}, defaults, options || {}),
          wrapper = $('<div />');
          
      $that.css({
        position: 'relative',
        width: opts.width,
        height: opts.height
      });
      
      wrapper.addClass('gfxCubeWrapper').transform({
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflow: 'visible'
      });
      
      $that.children().wrapAll(wrapper).css({
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        overflow: 'hidden'
      });
      
      wrapper = $that.find('.gfxCubeWrapper');
      wrapper.children('*:not(.front)') .hide();
      
      $that.bind('cube', function (e, type) {
        wrapper.children().hide();
        wrapper.children('.' + type).show();
        $that.trigger('cube:changed', type);
      });
    };
  }
  
}));