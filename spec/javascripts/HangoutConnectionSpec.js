// Generated by CoffeeScript 1.7.1
(function() {
  describe('Hangout Connection App', function() {
    beforeEach(function() {
      var state;
      state = {};
      window.gadgets = {
        util: {
          registerOnLoadHandler: function() {}
        }
      };
      this.hangout = {
        data: {
          getValue: function(key) {
            return state[key];
          },
          setValue: function(key, value) {
            return state[key] = value;
          }
        },
        hideApp: function() {},
        onParticipantsChanged: {
          add: function() {}
        },
        onApiReady: {
          add: function(callback) {
            return this.trigger = callback;
          },
          trigger: ''
        }
      };
      window.gapi = {
        hangout: this.hangout
      };
      setFixtures(sandbox({
        'class': 'd-status'
      }));
      window.gapi.hangout.data.setValue('updated', 'false');
      return this.app = new window.HangoutApplication();
    });
    describe('initialize', function() {
      beforeEach(function() {
        spyOn(this.app, 'sendUrl');
        spyOn(gapi.hangout.onParticipantsChanged, 'add');
        return this.jQuerySpy = spyOn(jQuery.fn, 'click');
      });
      afterEach(function() {
        return gapi.hangout.data.setValue('updated', 'false');
      });
      it('runs sendUrl() on start if not yet updated', function() {
        gapi.hangout.data.setValue('updated', void 0);
        this.app.initialize();
        return expect(this.app.sendUrl).toHaveBeenCalledWith(true);
      });
      it('does not run sendUrl() on start if already updated', function() {
        gapi.hangout.data.setValue('updated', 'true');
        this.app.initialize();
        return expect(this.app.sendUrl).not.toHaveBeenCalledWith(true);
      });
      return it('sets refresh interval', function() {
        spyOn(window, 'setInterval');
        this.app.initialize();
        return expect(window.setInterval).toHaveBeenCalledWith(this.app.sendUrl, 300000);
      });
    });
    return describe('sendUrl', function() {
      beforeEach(function() {
        spyOn(jQuery, 'ajax');
        return $.extend(this.hangout, {
          getStartData: function() {
            return JSON.stringify({
              title: 'Topic',
              projectId: 'project_id',
              eventId: 'event_id',
              category: 'category',
              hostId: 'host_id',
              hangoutId: 'hangout_id',
              callbackUrl: 'https://test.com/'
            });
          },
          getHangoutUrl: function() {
            return 'https://hangouts.com/4';
          },
          getParticipants: function() {
            return {};
          },
          onair: {
            getYouTubeLiveId: function() {
              return '456IDF65';
            },
            isBroadcasting: function() {
              return true;
            }
          },
          layout: {
            displayNotice: function() {}
          }
        });
      });
      it('makes request to WSO with correct params', function() {
        this.app.sendUrl(true);
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          url: 'https://test.com/hangout_id'
        }));
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          dataType: 'text'
        }));
        expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          type: 'PUT'
        }));
        return expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          data: {
            title: 'Topic',
            project_id: 'project_id',
            event_id: 'event_id',
            category: 'category',
            host_id: 'host_id',
            participants: {},
            hangout_url: 'https://hangouts.com/4',
            yt_video_id: '456IDF65',
            notify: true
          }
        }));
      });
      it('updates connection status to ok', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.statusCode['200']();
        });
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('status')).toEqual('ok');
        return expect($('.d-status')).toHaveClass('ok');
      });
      it('disaplys notice and sets uptade flag after update', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.statusCode['200']();
        });
        spyOn(this.hangout.layout, 'displayNotice');
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('updated')).toEqual('true');
        return expect(this.hangout.layout.displayNotice).toHaveBeenCalled();
      });
      it('updates connection satus to error on failure', function() {
        jQuery.ajax.and.callFake(function(e) {
          return e.statusCode['500']();
        });
        this.app.sendUrl();
        expect(gapi.hangout.data.getValue('status')).toEqual('error');
        return expect($('.d-status')).toHaveClass('error');
      });
      return it('makes request to WSO with correct params if callbackUrl in v0 format', function() {
        this.hangout.getStartData = function() {
          return 'https://hangouts.com/id';
        };
        this.app.sendUrl();
        return expect(jQuery.ajax).toHaveBeenCalledWith(jasmine.objectContaining({
          data: {
            title: void 0,
            project_id: void 0,
            event_id: void 0,
            category: void 0,
            host_id: void 0,
            participants: {},
            hangout_url: 'https://hangouts.com/4',
            yt_video_id: '456IDF65',
            notify: void 0
          }
        }));
      });
    });
  });

}).call(this);