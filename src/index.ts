import { JSDOM } from "jsdom";
import axios from "axios";
const requestOptions = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    Accept: "text/html",
  },
};
type Data = {
  songwriters: string | undefined;
  title: string | undefined;
  artist: string | undefined;
  genres: string | undefined;
  source: string | undefined;
  lyrics: string | undefined;
};

function get(dom: JSDOM, querySelect: string) {
  return dom.window.document
    .querySelector(querySelect)
    ?.textContent?.split(": ")[1];
}
export async function Google(
  name: string,
  language: string = "en"
): Promise<Data | null> {
  if (!name || typeof name != "string")
    throw new TypeError("Invalid name was provided");
  if (language && typeof language != "string")
    throw new TypeError("Invalid language was provided");

  const { data } = await axios("https://google.com/search", {
    ...requestOptions,
    params: { q: `Lyrics ${name}`, lr: `lang_${language}` },
  });
  const dom = new JSDOM(data);
  const elements = Array.from(dom.window.document.querySelectorAll(".ujudUb"));
  if (!elements.length) throw new Error("No result were found");

  return {
    songwriters: get(dom, ".auw0zb"),
    title: dom.window.document.querySelector("div.PZPZlf.ssJ7i.B5dxMb")
      ?.textContent,
    artist: get(dom, "div[data-attrid='kc:/music/recording_cluster:artist']"),
    genres: get(
      dom,
      "div[data-attrid='kc:/music/recording_cluster:skos_genre']"
    ),
    source: get(dom, ".j04ED"),
    lyrics: elements
      .map((_, i) => {
        const line = Array.from(elements[i].querySelectorAll("span"));
        return line.map((_, index) => line[index].textContent).join("\n");
      })
      .join("\n\n"),
  };
}
export async function Musixmatch(name: string): Promise<Data | null> {
  if (!name || typeof name != "string")
    throw new TypeError("Invalid name was provided");
  let data = await axios(
    `https://musixmatch.com/search/${name}`,
    requestOptions
  ).then((res) => res.data);
  let dom = new JSDOM(data);
  let element = dom.window.document.querySelector(".title");
  let [title, artist, endpoint] = [
    element?.textContent,
    dom.window.document.querySelector(".artist")?.textContent,
    element?.getAttribute("href"),
  ];
  if (!endpoint) throw new Error("No result were found");
  data = await axios(
    `https://musixmatch.com`.concat(endpoint),
    requestOptions
  ).then((res) => res.data);
  dom = new JSDOM(data);
  const elements = Array.from(
    dom.window.document.querySelectorAll(".lyrics__content__ok")
  );
  return {
    songwriters: get(dom, ".mxm-lyrics__copyright").replace("\n", ""),
    title,
    artist,
    genres: undefined,
    source: undefined,
    lyrics: elements.map((_, i) => elements[i].textContent).join("\n\n"),
  };
}
