/**
 * Frontend usage of Highscore
 * https://github.com/Calamari/highscore
 *
 * Copyright 2013, Georg Tavonius
 *
 * Requires jQuery
 *
 * Version: 0.0.1
 */

(function($, win) {
  'use strict';

  win.jaz = win.jaz || {};

  function makeGetRequest(url, reverse, options) {
    var scope = null,
        limit = 10,
        cb;
    $.each(options, function(i, val) {
      if (typeof val === 'string') {
        scope = val;
      } else if (typeof val === 'number') {
        limit = val;
      } else if (typeof val === 'function') {
        cb = val;
      }
    });
    $.getJSON(url + '?callback=?', {
      reverse: reverse
    }, function(data) {
      cb(data.items);
    });
  }

  /*
   * Creates an jaz.Highscore instance
   * @param {String} gameId Id of game
   * @param {String} apiUrl URL of API endpoint
   */
  win.jaz.Highscore = function(gameId, apiUrl) {
    this.gameId = gameId;
    this.url = apiUrl + '/' + this.gameId;
  };
  win.jaz.Highscore.VERSION = '0.0.1';

  win.jaz.Highscore.prototype = {
    /*
     * Calls for the highscore (the top x)
     * @param {String}   [limit] How much to get (default 10)
     * @param {String}   [scope] The scope to get in (default none)
     * @param {function} cb      Callback that gets the items
     */
    getHighest: function(limit, scope, cb) {
      makeGetRequest(this.url, false, arguments);
    },

    /*
     * Calls for the highscore for the lowest entries (the x loosers)
     * @param {String}   [limit] How much to get (default 10)
     * @param {String}   [scope] The scope to get in (default none)
     * @param {function} cb      Callback that gets the items
     */
    getLowest: function(limit, scope, cb) {
      makeGetRequest(this.url, true, arguments);
    },

    /*
     * Sets a highscore
     * @param {String}   player  Name of player
     * @param {String}   [score] How much points did he make?
     * @param {String}   [scope] The scope the score was created
     */
    set: function(player, score, scope) {
      $.ajax({
        url: this.url,
        data: {
          player: player,
          score: score,
          scope: scope
        },
        dataType: 'json',
        type: 'POST',
        crossDomain: true
      });
    }
  };
}(jQuery, window));
