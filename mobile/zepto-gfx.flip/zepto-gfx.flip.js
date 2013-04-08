(function(root, factory) {
  // Set up Zepto-GFX-Flip appropriately for the environment.
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define('zepto-gfx-flip', ['zepto'], function( Zepto ) {
      factory( Zepto );
    });
  } else {
    // Browser global scope
    factory( root.Zepto );
  }
}(this, function ( $ ) {

  var defaults = {
    width: 120,
    height: 120,
    duration: 400,
    easing: ''
  };

  $.fn.gfxFlip = function (options) {
    var $that = $(this),
        opts = $.extend({}, defaults, options || {}),
        front = $that.find('.front'),
        back = $that.find('.back');
        
    $that.css({
      'position': 'relative',
      '-webkit-perspective': '600',
      '-moz-perspective': '600',
      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-webkit-transform-origin': '50% 50%',
      '-moz-transform-origin': '50% 50%',
      'width': opts.width,
      'height': opts.height
    });
    
    front.add(back).css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'block',
      '-webkit-backface-visibility': 'hidden',
      '-moz-backface-visibility': 'hidden'
    });
    
    back.transform({
      rotateY: '-180deg'
    });
    
    $that.bind('flip', function() {
      var frontRotateY, backRotateY;
      
      $that.toggleClass('flipped');
      flipped = $that.hasClass('flipped');
      
      if (flipped) {
        frontRotateY = '180deg';
        backRotateY = '0deg';
      } else {
        frontRotateY = '0deg';
        backRotateY = '-180deg';
      }
      
      front.animate({rotateY: frontRotateY},
        opts.duration, opts.easing);
      back.animate({rotateY: backRotateY},
        opts.duration, opts.easing, function () {
        $that.trigger('flip:changed');
      });
    });
  };

}));