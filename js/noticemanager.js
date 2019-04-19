(function($) {
  "use strict";
  $(function() {
    const noticeManager = new NoticeManager();
  });

  class NoticeManager {
    constructor() {
      this.noticeClasses = [".notice", ".update-nag", ".updated"];

      // this.bans will be an array of Ban objects, noticeManagerBans is 'injected' by php
      this.bans = this.initBans(noticeManagerBans);
      this.notices = this.initNotices();
      this.bannedNotices = this.getBannedNotices();
      this.hideBannedNotices();
    }

    /**
     * Returns an array of Ban objects from a plain array of objects
     * @param {array} all An array of objects containing info from a database for the banning
     */
    initBans(all) {
      let bans = [];
      all.forEach(one => {
        const mes = new Message();
        mes.fromDB(one);
        bans.push(mes);
      });
      return bans;
    }

    /**
     * Gets all the DOM elements that are notices and makes a message out of it
     */
    initNotices() {
      let notices = [];
      const all = $(this.noticeClasses.join(", "));
      console.log(all);
      all.each(i => {
        const mes = new Message();
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
    getBannedNotices() {
      let matches = [];
      this.notices.forEach(notice => {
        this.bans.forEach(ban => {
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
    hideBannedNotices() {
      this.bannedNotices.forEach(notice => {
        notice.hide();
      });
    }
  }

  class Message {
    constructor() {
      this.body;
      this.element;
      this.bodyNoWhitespace;
      this.ui;
    }

    /**
     * The body itself does not have whitespace if it came from the db.
     * If it did not come from the db we replace all whitespace with nothing
     */
    get bodyNoWhitespace() {
      if (this.element) {
        return this.body.replace(/\s/g, "");
      }
      return this.body;
    }

    /**
     * Constructs the message object by a DOM element
     * @param {object} el DOM element
     */
    fromDOM(el) {
      this.body = el.innerText;
      this.element = el;
      this.addUI();
      this.ui.show();
    }

    /**
     * Constructs the message object by a DB entry
     * @param {object} data DB entry
     */
    fromDB(data) {
      this.body = data.body;
    }

    /**
     * Hides a message
     */
    hide() {
      if (this.element) {
        this.element.style.display = "none";
      }
    }

    /**
     * Returns true if the body's of the messages match
     * @param {Message} mes What to compare it to
     */
    compare(mes) {
      if (this.bodyNoWhitespace === mes.bodyNoWhitespace) {
        return true;
      }
      return false;
    }

    /**
     * Makes a new ui object and adds it to the message
     */
    addUI() {
      const ui = new UI(this);
      this.ui = ui;
    }
  }

  class UI {
    constructor(mes) {
      this.message = mes;
      this.html = this.initUI();
    }

    /**
     * Returns the current url without query params with a name beginning with notice-manager
     */
    currentPageWithoutOurParams() {
      // The url without query params
      let redirectURL =
        location.protocol + "//" + location.host + location.pathname;
      // If there are query params currently
      if (location.search) {
        // Base array
        let params = [];
        // The search part of the url without the ?
        const noQuestionMark = location.search.substring(1);
        // Split the url on & because the & character specifies a new param
        const parts = noQuestionMark.split("&");
        // Populate param array with all the parameters
        parts.forEach(v => {
          params.push({
            name: v.split("=")[0],
            value: v.split("=")[1]
          });
        });
        // Take out all the params that start with notice-manager
        params.filter(v => v.name.substring(0, 13) === "notice-manager");
        // Add the ?
        redirectURL += "?";
        // Add the params back to the url
        params.map(v => (redirectURL += v.name + "=" + v.value));
      }
      return redirectURL;
    }

    /**
     * Generates the ui's html
     */
    initUI() {
      const baseURL =
        location.protocol + "//" + location.host + location.pathname;
      const redirectURL = this.currentPageWithoutOurParams();
      const body = this.message.bodyNoWhitespace;
      return `
			<div class="notice-manager">
				<div class="notice-manager-toggler">${i18n.manage_notice}</div>
				<div class="notice-manager-ui" data-expanded="false">
					<a href="${baseURL +
            "?notice-manager-ban-body=" +
            body +
            "&notice-manager-ban-nice-body=" +
            this.message.body +
            "&notice-manager-redirect-url=" +
            redirectURL}">
						${i18n.ban_this_notice}				
					</a>
				</div>
			</div>
			`;
    }

    /**
     * Adds the html of the ui to the message element
     */
    show() {
      if (this.message.element) {
        const domEl = $(this.html)[0];
        this.message.element.appendChild(domEl);
        const toggler = domEl.children[0];
        const target = domEl.children[1];
        toggler.addEventListener("click", () => {
          this.handleClick(toggler, target);
        });
      }
    }

    /**
     * Toggles expanding and collapsing of the ui
     */
    handleClick(clicked, target) {
      const expanded = target.dataset.expanded;
      if (expanded === "false") {
        target.style.display = "block";
        target.dataset.expanded = "true";
      } else if (expanded === "true") {
        target.style.display = "none";
        target.dataset.expanded = "false";
      }
    }
  }
})(jQuery);
