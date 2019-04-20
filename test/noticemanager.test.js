import {
    UI
} from '../src/noticemanager';

const messageMock = {
    body: "messagebody",
    bodyNoWhiteSpace: "message body"
};

const jqueryMock = function () {};

const i18nMock = {
    manage_notice: "ManageNoticei18n",
    ban_this_notice: "BanNoticei18n"
};
const ui = new UI(messageMock, jqueryMock, i18nMock);

test("passes an empty test", () => {});

test("initUI", () => {
    expect(ui.html).toMatch(messageMock.body);
});

test("initUI uses i18n correctly", () => {
    expect(ui.html).toMatch(i18nMock.ban_this_notice);
    expect(ui.html).toMatch(i18nMock.manage_notice);
});

test("initUI link has a get with the name of notice-manager-ban-body", () => {
    expect(ui.html).toMatch(/notice-manager-ban-body/);
});

test("initUI link has a get with the name of notice-manager-ban-nice-body", () => {
    expect(ui.html).toMatch(/notice-manager-ban-nice-body/);
});

test("initUI link has a get with the name of notice-manager-ban-redirect-url", () => {
    expect(ui.html).toMatch(/notice-manager-redirect-url/);
});