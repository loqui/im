'use strict';

var Chungo = {

  VERSION: '0.0.1',
  DEVICE: null,
  
  init: function (data) {
    
    $$('document').ready(function() {
      var sections = $$('section');
      sections.first().addClass('show');
      sections.each(function () {
        $$(this).children('article').first().addClass('show');
      });
      
      Chungo.Router._stack = [$$('section').first().attr('id')];
      
      setTimeout(function() {
        var sections = $$('section');
        sections.each(function () {
          $$(this).children('article').first().addClass('show');
        });
        $$('[data-view-section]').each(function () {
          $$(this).on('click', function (e) {
            Chungo.Router.section(e.target.dataset.viewSection);      
          });
        });
        $$('[data-view-article]').each(function () {
          $$(this).on('click', function (e) {
            Chungo.Router.article($$(e.target).closest('section').attr('id'), e.target.dataset.viewArticle);
          }); 
        });
        $$('[data-view-aside]').each(function () {
          $$(this).on('click', function (e) {
            Chungo.Aside.toggle(e.target.dataset.viewAside);      
          });
        });
        $$('[data-icon]').each(function () {
          var icon = this.dataset.icon;
          $$(this).addClass('icon').addClass(icon);
        });
        $$('[data-image]').each(function () {
          var image = this.dataset.image;
          $$(this).style('backgroundImage', 'url(' + image + ')');
        });
        $$('[data-control="groupbar"]').each(function () {
          var links = $$(this).children('[data-view-article]');
          links.first().addClass('selected').siblings().removeClass('selected');
          links.each(function () {
            $$(this).on('click', function (e) {
              $$(this).addClass('selected').siblings().removeClass('selected');
            });  
          });
        });
        $$('.chungo .notifier').swipeUp(Chungo.Notification.hide.bind(Chungo.Notification));
      });
      
      setTimeout(function () {
        $$('header[data-title]').each(function () {
          var title = $$(this).data('l10n-title') && '_' in window ? _($$(this).data('l10n-title')) : $$(this).data('title');
          $$(this).append(
            $$('<h1/>').text(title)
          );
        });
      }, 1000);
      
      $$('body').append(
        $$('<div>').addClass('chungo').append(
          $$('<div>').addClass('shader')
        ).append(
          $$('<div>').addClass('notifier').append(
            $$('<span>').addClass('icon')
          ).append(
            $$('<span>').addClass('title')
          ).append(
            $$('<span>').addClass('caption')
          )
        )
      );
      
    });
    
  },
  
  Core: {
  
    environment: function () {
      return $$.environment();
    },
    
    findByProperty: function (list, key, value) {
      var ret = null;
      if (list instanceof Array && 'find' in Array.prototype) {
        ret = list.find(function (e, i, a) {
          return e[key] == value;
        });
      } else {
        for (var i in list) {
          if (list[i] instanceof Object && list[i][key] && list[i][key] == value) {
            ret = list[i];
            break;
          }
        }
      }
      return ret;
    }
    
  },
  
  Element: {
    
    count: function (query, value) {
      var result = $$(query);
      for (var i = 0; i < result.length; i++) {
        var el = result[i];
        var counter = $$(el).children('.counter');
        if (counter.length) {
          counter.text(value).data('value', value);
        } else {
          $$(el).append($$('<span>').addClass('counter').text(value).data('value', value));
        }
      }
    },
    
    progress: function (value) {
      Tools.log(value);
    }
    
  },
  
  Router: {
  
    _stack: [],
    
    section: function (to) {
      if (this._stack[this._stack.length - 1] != to) {
        if (to == 'back' && this._stack.length > 1) {
          var from = this._stack.pop();
          var to = this._stack[this._stack.length - 1];
          $$('section#' + from)
            .removeClass('show')
            .removeClass('forth')
            .addClass('prev')
            .addClass('back');
          if ($$('section#' + from).data('transition') != 'vertical') {
            $$('section#' + to)
              .removeClass('prev')
              .removeClass('forth')
              .addClass('show')
              .addClass('back');
          } else {
            setTimeout(function () {
              $$('section#' + to).removeClass('fast');
            }, 300);
          }
        } else {
          var from = this._stack[this._stack.length - 1];
          if (to != from) {
            this._stack.push(to);
            if ($$('section#' + to).data('transition') != 'vertical') {
              $$('section#' + from)
                .removeClass('show')
                .removeClass('back')
                .addClass('prev')
                .addClass('forth');
            } else {
              $$('section#' + from).addClass('fast');
            }
            $$('section#' + to)
              .removeClass('prev')
              .removeClass('back')
              .addClass('show')
              .addClass('forth');
          }
        }
      }
      setTimeout(function () {
        Chungo.Aside.hide();
      }, to != from ? 300 : 0);
    },
    
    article: function (section, article) {
      this.section(section);
      var to = $$('section#' + section).children('article#' + article);
      to.addClass('show').siblings('article').removeClass('show');
    }
    
  },
  
  Aside: {
  
    _current: {
      id: undefined,
      open: false
    },
    
    show: function (id) {
      $$('aside#' + id).addClass('show');
      $$('section.show').addClass('asided');
      this._current = {
        id: id,
        open: true
      }
    },
    
    hide: function () {
      $$('aside#' + this._current.id).removeClass('show');
      $$('section').removeClass('asided');
      this._current.open = false;
    },
    
    toggle: function (id) {
      if (this._current.open) {
        this.hide();
      } else {
        this.show(id);
      }
    }
    
  },
  
  Notification: {
  
    get _sha() { return $$('.chungo .shader'); },
    get _not() { return $$('.chungo .notifier'); },
    
    _timeout: [],
    
    _unified: function (type, icon, title, description, seconds, cb) {
      this._not.data('type', type);
      this._not.children('.icon')[0].className = icon + ' icon';
      this._not.children('.title').text(title);
      this._not.children('.caption').html(description || ' ');
      this._sha.addClass('show').removeClass('hidden');
      this._not.addClass('show').removeClass('hidden');
      clearTimeout(this._timeout[0]);
      if (this._timeout[1]) {
        this._timeout[1]();
      }
      this._timeout = [
        setTimeout(function () {
          this.hide();
        }.bind(this), seconds ? seconds * 1000 : 20000),
        cb
      ];
    },
    
    show: function (icon, title, seconds, cb) {
      this._unified('neutral', icon, title, null, seconds, cb);
    },
    
    error: function (title, description, icon, seconds, cb) {
      this._unified('error', icon, title, description, seconds, cb);
    },
    
    success: function (title, description, icon, seconds, cb) {
      this._unified('success', icon, title, description, seconds, cb);
    },
    
    hide: function () {
      this._sha.addClass('out');
      this._not.addClass('out');
      setTimeout(function () {
        this._sha.removeClass('show').removeClass('out');
        this._not.removeClass('show').removeClass('out');
      }.bind(this), 190);
      if (this._timeout[1]) {
        this._timeout[1]();
      }
    }
    
    
  }
  
};

var Lungo = Chungo;
