// Generated by CoffeeScript 1.3.3

/*
  Superslides 0.4.1
  Fullscreen slideshow plugin for jQuery
  by Nic Aitch @nicinabox
  http://nicinabox.github.com/superslides/
*/


(function() {
  var $children, $container, $control, $nav, $window, adjust_image_position, adjust_slides_size, animate, animating, first_load, height, is_mobile, load_image, multiplier, play, play_interval, size, start, stop, width;

  $window = $(window);

  width = $window.width();

  height = $window.height();

  is_mobile = navigator.userAgent.match(/mobile/i);

  first_load = true;

  play_interval = 0;

  animating = false;

  size = 0;

  multiplier = 3;

  $control = '';

  $container = '';

  $nav = '';

  $children = '';

  load_image = function($img, callback) {
    return $("<img />").attr('src', $img.attr('src')).load(function() {
      if (typeof callback === 'function') {
        callback(this);
      }
      return this;
    });
  };

  adjust_image_position = function($img) {
    if (!($img.data('original-height') && $img.data('original-width'))) {
      load_image($img, function(image) {
        $img.data('original-height', image.height).removeAttr('height');
        $img.data('original-width', image.width).removeAttr('width');
        return adjust_image_position($img);
      });
    }
    if (height < $img.data('original-height')) {
      $img.css({
        top: -($img.data('original-height') - height) / 2
      });
    }
    if (width < $img.data('original-width')) {
      $img.css({
        left: -($img.data('original-width') - width) / 2
      });
    } else {
      $img.css({
        left: 0
      });
    }
    if ($img.data('original-height') && $img.data('original-width')) {
      return $container.trigger('slides.image_adjusted');
    }
  };

  adjust_slides_size = function($el) {
    $el.each(function(i) {
      $(this).width(width).height(height);
      if (size > 1) {
        $(this).css({
          left: width
        });
      }
      return adjust_image_position($('img', this).not('.keep-original'));
    });
    return $container.trigger('slides.sized');
  };

  start = function() {
    var index;
    if (size > 1) {
      if (location.hash) {
        index = location.hash.replace(/^#/, '');
      } else {
        index = (first_load ? 0 : "next");
      }
      animate(index);
      return play();
    }
  };

  stop = function() {
    return clearInterval(play_interval);
  };

  play = function() {
    if ($.fn.superslides.options.play) {
      if (play_interval) {
        stop();
      }
      return play_interval = setInterval(function() {
        return animate((first_load ? 0 : "next"));
      }, $.fn.superslides.options.delay);
    }
  };

  animate = function(direction) {
    var next, position, prev, self;
    self = this;
    self.current = (self.current >= 0 ? self.current : null);
    if (!(animating || direction >= size || +direction === self.current)) {
      prev = self.current || +direction - 1 || 0;
      animating = true;
      switch (direction) {
        case 'next':
          position = width * 2;
          direction = -position;
          next = self.current + 1;
          if (size === next) {
            next = 0;
          }
          break;
        case 'prev':
          position = direction = 0;
          next = self.current - 1;
          if (next === -1) {
            next = size - 1;
          }
          break;
        default:
          next = +direction;
          if (next > prev) {
            position = width * 2;
            direction = -position;
          } else {
            position = direction = 0;
          }
      }
      self.current = next;
      $children.removeClass('current');
      $children.eq(self.current).css({
        left: position,
        display: 'block'
      });
      $control.animate({
        useTranslate3d: (is_mobile ? true : false),
        left: direction
      }, $.fn.superslides.options.slide_speed, $.fn.superslides.options.slide_easing, function() {
        $control.css({
          left: -width
        });
        $children.eq(next).css({
          left: width,
          zIndex: 2
        });
        $children.eq(prev).css({
          left: width,
          display: 'none',
          zIndex: 0
        });
        $children.eq(self.current).addClass('current');
        if (first_load) {
          $container.fadeIn('fast');
          $container.trigger('slides.initialized');
          first_load = false;
        }
        animating = false;
        return $container.trigger('slides.animated', [self.current, next, prev]);
      });
      return self.current;
    }
  };

  $.fn.superslides = function(options) {
    var api, args, method;
    if (typeof options === 'string') {
      api = $.fn.superslides.api;
      method = options;
      args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);
      return api[method].call(this, args.join(', '));
    } else {
      options = $.fn.superslides.options = $.extend($.fn.superslides.options, options);
      $("." + options.container_class, this).wrap('<div class="slides-control" />');
      $control = $('.slides-control', this);
      $container = $("." + options.container_class);
      $nav = $("." + options.nav_class);
      $children = $container.children();
      size = $children.length;
      multiplier = (size === 1 ? 1 : 3);
      return this.each(function() {
        var el;
        $control.css({
          position: 'relative'
        });
        if (size > 1) {
          $control.css({
            width: width * multiplier,
            height: height,
            left: -width
          });
          $container.hide();
          $children.css({
            display: 'none',
            position: 'absolute',
            overflow: 'hidden',
            top: 0,
            left: width,
            zIndex: 0
          });
        }
        adjust_slides_size($children);
        $(window).resize(function(e) {
          width = $window.width();
          height = $window.height();
          adjust_slides_size($children);
          $control.width(width * multiplier).css({
            height: height
          });
          if (size > 1) {
            return $control.css({
              left: -width
            });
          }
        });
        $(document).on('click', "." + options.nav_class + " a", function(e) {
          e.preventDefault();
          stop();
          if ($(this).hasClass('next')) {
            return animate('next');
          } else {
            return animate('prev');
          }
        });
        if (options.pagination) {
          el = this;
          $(document).on("slides.initialized", function(e) {
            $(el).append($("<nav>", {
              "class": 'slides-pagination'
            }));
            return $(".slides-container", el).children().each(function(i) {
              return $(".slides-pagination").append($("<a>", {
                href: "#" + i
              }));
            });
          }).on("slides.animated", function(e, current, next, prev) {
            var $pagination;
            $pagination = $(".slides-pagination");
            $(".active", $pagination).removeClass("active");
            return $("a", $pagination).eq(current).addClass("active");
          }).on("click", ".slides-pagination a", function(e) {
            var index;
            if (!options.hashchange) {
              e.preventDefault();
            }
            index = this.hash.replace(/^#/, '');
            return animate(index);
          });
          $window.on('hashchange', function(e) {
            var index;
            index = location.hash.replace(/^#/, '');
            stop();
            return animate(index);
          });
        }
        return start();
      });
    }
  };

  $.fn.superslides.options = {
    delay: 5000,
    play: false,
    slide_speed: 'normal',
    slide_easing: 'linear',
    nav_class: 'slides-navigation',
    container_class: 'slides-container',
    pagination: false,
    hashchange: false
  };

  $.fn.superslides.api = {
    start: function() {
      return start();
    },
    stop: function() {
      return stop();
    },
    play: function() {
      return play();
    },
    animate: function(direction) {
      stop();
      return animate(direction);
    },
    next: function() {
      return animate('next');
    },
    prev: function() {
      return animate('prev');
    }
  };

}).call(this);
