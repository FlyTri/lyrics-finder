import { JSDOM } from "jsdom";
import axios from "axios";
type Data = {
  songwriters: string | undefined;
  title: string | undefined;
  released: string | undefined;
  artist: string | null;
  album: string | null;
  genres: string | undefined;
  lyrics: string | undefined;
};

async function getDOM(name: string, language: string) {
  const { data } = await axios("https://google.com/search", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      Accept: "text/html",
    },
    params: { q: `Lyrics ${name}`, lr: `lang_${language}` },
  });
  return new JSDOM(data);
}
function get(dom: JSDOM, querySelect: string) {
  return dom.window.document
    .querySelector(querySelect)
    ?.textContent?.split(": ")[1];
}
export async function find(
  name: string,
  moreInfo: boolean = false,
  language: string = "en"
): Promise<Data | null> {
  if (!name || typeof name != "string")
    throw new TypeError("Invalid name was provided");
  if (moreInfo && typeof moreInfo != "boolean")
    throw new TypeError("Invalid language was provided");
  if (language && typeof language != "string")
    throw new TypeError("Invalid language was provided");

  let dom = await getDOM(name, language);
  const elements = Array.from(dom.window.document.querySelectorAll(".ujudUb"));
  if (!elements.length) throw new Error("No result were found");
  const songwriters = get(dom, ".auw0zb");
  const title = dom.window.document.querySelector(
    "div.PZPZlf.ssJ7i.B5dxMb"
  )?.textContent;
  let released = get(
    dom,
    "div[data-attrid='kc:/music/recording_cluster:release date']"
  );
  let artist = get(
    dom,
    "div[data-attrid='kc:/music/recording_cluster:artist']"
  );
  let album = get(
    dom,
    "div[data-attrid='kc:/music/recording_cluster:first album']"
  );
  let genres = get(
    dom,
    "div[data-attrid='kc:/music/recording_cluster:skos_genre']"
  );
  if (moreInfo && songwriters && (!released || !artist || !album || !genres)) {
    dom = await getDOM(`${songwriters} ${title}`, language);
    if (!released)
      released = get(
        dom,
        "div[data-attrid='kc:/music/recording_cluster:release date']"
      );
    if (!artist) artist = get(dom, ".rVusze");
    if (!album)
      album = get(
        dom,
        "div[data-attrid='kc:/music/recording_cluster:first album']"
      );
    if (!genres)
      genres = get(
        dom,
        "div[data-attrid='kc:/music/recording_cluster:skos_genre']"
      );
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
}
