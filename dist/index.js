"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
const tslib_1 = require("tslib");
const jsdom_1 = require("jsdom");
const axios_1 = tslib_1.__importDefault(require("axios"));
function getDOM(name, language) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { data } = yield (0, axios_1.default)("https://google.com/search", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                Accept: "text/html",
            },
            params: { q: `Lyrics ${name}`, lr: `lang_${language}` },
        });
        return new jsdom_1.JSDOM(data);
    });
}
function get(dom, querySelect) {
    var _a, _b;
    return (_b = (_a = dom.window.document
        .querySelector(querySelect)) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.split(": ")[1];
}
function find(name, moreInfo = false, language = "en") {
    var _a;
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!name || typeof name != "string")
            throw new TypeError("Invalid name was provided");
        if (moreInfo && typeof moreInfo != "boolean")
            throw new TypeError("Invalid language was provided");
        if (language && typeof language != "string")
            throw new TypeError("Invalid language was provided");
        let dom = yield getDOM(name, language);
        const elements = Array.from(dom.window.document.querySelectorAll(".ujudUb"));
        if (!elements.length)
            throw new Error("No result were found");
        const songwriters = get(dom, ".auw0zb");
        const title = (_a = dom.window.document.querySelector("div.PZPZlf.ssJ7i.B5dxMb")) === null || _a === void 0 ? void 0 : _a.textContent;
        let released = get(dom, "div[data-attrid='kc:/music/recording_cluster:release date']");
        let artist = get(dom, "div[data-attrid='kc:/music/recording_cluster:artist']");
        let album = get(dom, "div[data-attrid='kc:/music/recording_cluster:first album']");
        let genres = get(dom, "div[data-attrid='kc:/music/recording_cluster:skos_genre']");
        if (moreInfo && songwriters && (!released || !artist || !album || !genres)) {
            dom = yield getDOM(`${songwriters} ${title}`, language);
            if (!released)
                released = get(dom, "div[data-attrid='kc:/music/recording_cluster:release date']");
            if (!artist)
                artist = get(dom, ".rVusze");
            if (!album)
                album = get(dom, "div[data-attrid='kc:/music/recording_cluster:first album']");
            if (!genres)
                genres = get(dom, "div[data-attrid='kc:/music/recording_cluster:skos_genre']");
        }
        return {
            songwriters,
            title,
            released,
            artist,
            album,
            genres,
            lyrics: elements
                .map((_, i) => {
                const line = Array.from(elements[i].querySelectorAll("span"));
                return line.map((_, index) => line[index].textContent).join("\n");
            })
                .join("\n\n"),
        };
    });
}
exports.find = find;
