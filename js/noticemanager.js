"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Check if jquery is defined because it is not when we test
if ('undefined' !== typeof jQuery) {
  jQuery(document).ready(function ($) {
    var noticeManager = new NoticeManager($);
  });
}

var NoticeManager =
/*#__PURE__*/
function () {
  function NoticeManager($) {
    _classCallCheck(this, NoticeManager);

    this.$ = $;
    this.noticeClasses = [".notice", ".update-nag", ".updated"]; // this.bans will be an array of Ban objects, noticeManagerBans is 'injected' by php

    this.bans = this.initBans(noticeManagerBans);
    this.notices = this.initNotices();
    this.bannedNotices = this.getBannedNotices();
    this.hideBannedNotices();
  }
  /**
   * Returns an array of Ban objects from a plain array of objects
   * @param {array} all An array of objects containing info from a database for the banning
   */


  _createClass(NoticeManager, [{
    key: "initBans",
    value: function initBans(all) {
      var _this = this;

      var bans = [];
      all.forEach(function (one) {
        var mes = new Message(_this.$);
        mes.fromDB(one);
        bans.push(mes);
      });
      return bans;
    }
    /**
     * Gets all the DOM elements that are notices and makes a message out of it
     */

  }, {
    key: "initNotices",
    value: function initNotices() {
      var _this2 = this;

      var notices = [];
      var all = this.$(this.noticeClasses.join(", "));
      all.each(function (i) {
        var mes = new Message(_this2.$);
        mes.fromDOM(all[i]);
        notices.push(mes);
      });
      return notices;
    }
    /**
     * Compare all bans with all notices,
     * if true is returned add the notice to the return array
     * TODO: This is a nested for loop which should be improved
     */

  }, {
    key: "getBannedNotices",
    value: function getBannedNotices() {
      var _this3 = this;

      var matches = [];
      this.notices.forEach(function (notice) {
        _this3.bans.forEach(function (ban) {
          if (notice.compare(ban)) {
            matches.push(notice);
          }
        });
      });
      return matches;
    }
    /**
     * Hides all the banned notices
     */

  }, {
    key: "hideBannedNotices",
    value: function hideBannedNotices() {
      this.bannedNotices.forEach(function (notice) {
        notice.hide();
      });
    }
  }]);

  return NoticeManager;
}();

var Message =
/*#__PURE__*/
function () {
  function Message($) {
    _classCallCheck(this, Message);

    this.$ = $;
    this.body;
    this.element;
    this.bodyNoWhitespace;
    this.ui;
  }
  /**
   * The body itself does not have whitespace if it came from the db.
   * If it did not come from the db we replace all whitespace with nothing
   */


  _createClass(Message, [{
    key: "fromDOM",

    /**
     * Constructs the message object by a DOM element
     * @param {object} el DOM element
     */
    value: function fromDOM(el) {
      this.body = el.innerText;
      this.element = el;
      this.addUI();
      this.ui.show();
    }
    /**
     * Constructs the message object by a DB entry
     * @param {object} data DB entry
     */

  }, {
    key: "fromDB",
    value: function fromDB(data) {
      this.body = data.body;
    }
    /**
     * Hides a message
     */

  }, {
    key: "hide",
    value: function hide() {
      if (this.element) {
        this.element.style.display = "none";
      }
    }
    /**
     * Returns true if the body's of the messages match
     * @param {Message} mes What to compare it to
     */

  }, {
    key: "compare",
    value: function compare(mes) {
      if (this.bodyNoWhitespace === mes.bodyNoWhitespace) {
        return true;
      }

      return false;
    }
    /**
     * Makes a new ui object and adds it to the message
     */

  }, {
    key: "addUI",
    value: function addUI() {
      var ui = new UI(this, this.$);
      this.ui = ui;
    }
  }, {
    key: "bodyNoWhitespace",
    get: function get() {
      if (this.element) {
        return this.body.replace(/\s/g, "");
      }

      return this.body;
    }
  }]);

  return Message;
}();

var UI =
/*#__PURE__*/
function () {
  function UI(mes, $) {
    var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : i18n;

    _classCallCheck(this, UI);

    this.$ = $;
    this.message = mes;
    this.i18n = i;
    this.html = this.initUI();
  }
  /**
   * Returns the current url without query params with a name beginning with notice-manager
   */


  _createClass(UI, [{
    key: "currentPageWithoutOurParams",
    value: function currentPageWithoutOurParams() {
      // The url without query params
      var redirectURL = location.protocol + "//" + location.host + location.pathname; // If there are query params currently

      if (location.search) {
        // Base array
        var params = []; // The search part of the url without the ?

        var noQuestionMark = location.search.substring(1); // Split the url on & because the & character specifies a new param

        var parts = noQuestionMark.split("&"); // Populate param array with all the parameters

        parts.forEach(function (v) {
          params.push({
            name: v.split("=")[0],
            value: v.split("=")[1]
          });
        }); // Take out all the params that start with notice-manager

        params.filter(function (v) {
          return v.name.substring(0, 13) === "notice-manager";
        }); // Add the ?

        redirectURL += "?"; // Add the params back to the url

        params.map(function (v) {
          return redirectURL += v.name + "=" + v.value;
        });
      }

      return redirectURL;
    }
    /**
     * Generates the ui's html
     */

  }, {
    key: "initUI",
    value: function initUI() {
      var baseURL = location.protocol + "//" + location.host + location.pathname;
      var redirectURL = this.currentPageWithoutOurParams();
      var body = this.message.bodyNoWhitespace;
      return "\n              <div class=\"notice-manager\">\n                  <div class=\"notice-manager-toggler\">".concat(this.i18n.manage_notice, "</div>\n                  <div class=\"notice-manager-ui\" data-expanded=\"false\">\n                      <a href=\"").concat(baseURL + "?notice-manager-ban-body=" + body + "&notice-manager-ban-nice-body=" + this.message.body + "&notice-manager-redirect-url=" + redirectURL, "\">\n                          ").concat(this.i18n.ban_this_notice, "\t\t\t\t\n                      </a>\n                  </div>\n              </div>\n              ");
    }
    /**
     * Adds the html of the ui to the message element
     */

  }, {
    key: "show",
    value: function show() {
      var _this4 = this;

      if (this.message.element) {
        var domEl = this.$(this.html)[0];
        this.message.element.appendChild(domEl);
        var toggler = domEl.children[0];
        var target = domEl.children[1];
        toggler.addEventListener("click", function () {
          _this4.handleClick(toggler, target);
        });
      }
    }
    /**
     * Toggles expanding and collapsing of the ui
     */

  }, {
    key: "handleClick",
    value: function handleClick(clicked, target) {
      var expanded = target.dataset.expanded;

      if (expanded === "false") {
        target.style.display = "block";
        target.dataset.expanded = "true";
      } else if (expanded === "true") {
        target.style.display = "none";
        target.dataset.expanded = "false";
      }
    }
  }]);

  return UI;
}(); // Export our classes for testing, browsers need a check because they don't support it


if ('undefined' !== typeof module) {
  module.exports = {
    UI: UI,
    NoticeManager: NoticeManager,
    Message: Message
  };
}