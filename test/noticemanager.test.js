import {
    UI
} from "../src/noticemanager";

const messageMock = {
    body: "messagebody",
    bodyNoWhiteSpace: "message body"
};

const jqueryMock = function () {};

const i18nMock = {
    manage_notice: "ManageNoticei18n",
    ban_this_notice: "BanNoticei18n"
};

const locationMock = {
    href: "https://example.com/wp-admin?notice-manager-bla=blabla&page=expample-page&test=test",
    protocol: "https:",
    host: "example.com",
    pathname: "/wp-admin",
    search: "?notice-manager-bla=blabla&page=example-page&test=test",
};

const ui = new UI(messageMock, locationMock, i18nMock, jqueryMock);

test("creating UI object succeeds", () => {
    expect(ui).not.toBe(undefined);
});

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

test("initUI links to the same page without any parameters", () => {
    expect(ui.html).toMatch(/a href="https:\/\/example.com\/wp-admin/);
});

test("initUI redirect URL links to the page without notice-manager params", () => {
    expect(ui.html).toMatch(/redirect-url=https:\/\/example.com\/wp-admin\?page=example-page&test=test/);
});