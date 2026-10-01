/* global CMS, h */
/**
 * Panel de administración de HUNTERX.
 *
 * - Vistas previas en vivo de cada sección, con el mismo estilo de la página.
 * - Widget «guia»: caja de ayuda al inicio de cada sección (no guarda datos).
 * - Arranque manual: el panel SIEMPRE pide iniciar sesión con GitHub.
 *   El modo de prueba local (sin cuenta, guarda en los archivos de la PC)
 *   solo se activa si se cumplen las dos condiciones:
 *     1. la página se abre en localhost, y
 *     2. la dirección incluye ?modo=local  →  http://localhost:8080/admin/?modo=local
 *   además de tener corriendo `npm run cms`. En el sitio publicado es imposible.
 */
(function () {
  "use strict";

  // ---------- Utilidades ----------

  var GOLD = "#fbbf24";

  /** Datos descargados con `npm run instagram` (usuario, tipo) por código. */
  var downloadedPosts = {};

  function youtubeId(value) {
    var s = String(value || "").trim();
    if (/^[\w-]{11}$/.test(s)) return s;
    var m = s.match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/,
    );
    return m ? m[1] : null;
  }

  function instagramCode(value) {
    var s = String(value || "").trim();
    if (/^[\w-]{5,40}$/.test(s)) return s;
    var m = s.match(/instagram\.com\/(?:[\w.]+\/)?(?:p|reel|reels|tv)\/([\w-]{5,40})/);
    return m ? m[1] : null;
  }

  function isHttps(value) {
    try {
      return new URL(String(value || "")).protocol === "https:";
    } catch (e) {
      return false;
    }
  }

  /** Datos de la entrada como objeto plano. */
  function dataOf(props) {
    var data = props.entry.get("data");
    return data && data.toJS ? data.toJS() : {};
  }

  /** URL utilizable de un archivo (incluye los recién subidos, aún sin publicar). */
  function assetUrl(props, path) {
    if (!path) return "";
    var asset = props.getAsset(path);
    return asset ? String(asset) : path;
  }

  function Frame(title, subtitle, children) {
    return h(
      "div",
      { className: "hx-preview" },
      h(
        "header",
        { className: "hx-preview__head" },
        h("span", { className: "hx-preview__tag" }, "Vista previa"),
        h("h1", null, title),
        subtitle ? h("p", null, subtitle) : null,
      ),
      h("div", { className: "hx-preview__body" }, children),
    );
  }

  function Warning(text) {
    return h("div", { className: "hx-warning" }, text);
  }

  function Empty(text) {
    return h("div", { className: "hx-empty" }, text);
  }

  // ---------- 1 · Portada principal ----------

  function HeroPreview(props) {
    var d = dataOf(props);
    var isVideo = d.mode === "video";
    var cover = assetUrl(props, d.cover);
    var media;

    if (isVideo) {
      media = d.video
        ? h("video", {
            className: "hx-hero__media",
            src: assetUrl(props, d.video),
            poster: cover,
            autoPlay: true,
            muted: true,
            loop: true,
            playsInline: true,
          })
        : Empty("Sube un video MP4 para verlo aquí.");
    } else {
      media = cover
        ? h("img", { className: "hx-hero__media", src: cover, alt: "" })
        : Empty("Sube una portada para verla aquí.");
    }

    var notes = [];
    if (isVideo && !d.video) notes.push(Warning("Elegiste «Video» pero no hay ningún video subido. Se mostrará la portada."));
    if (!isVideo && !d.audio) notes.push(Warning("No hay canción (MP3): el reproductor no sonará."));
    if (!cover) notes.push(Warning("Falta la portada."));

    return Frame(
      "Portada principal",
      "Así se verá la parte superior de la página.",
      [
        h(
          "div",
          { className: "hx-hero", key: "hero" },
          cover ? h("img", { className: "hx-hero__bg", src: cover, alt: "" }) : null,
          h(
            "div",
            { className: "hx-hero__text" },
            d.badge ? h("span", { className: "hx-badge" }, d.badge) : null,
            h("div", { className: "hx-hero__name" }, "HUNTER", h("span", { className: "hx-gold" }, "X")),
            h(
              "div",
              { className: "hx-hero__song" },
              h("span", { className: "hx-script" }, d.title || "Nombre de la canción"),
              d.producer ? h("small", null, d.producer) : null,
            ),
            h("p", { className: "hx-muted" }, "La descripción se edita en «5 · Datos del artista»."),
            h(
              "div",
              { className: "hx-hero__buttons" },
              h("span", { className: "hx-btn hx-btn--gold" }, "▶  Ver en YouTube"),
              h("span", { className: "hx-btn" }, "Escuchar en Spotify"),
            ),
          ),
          h(
            "div",
            { className: "hx-hero__side" },
            h("div", { className: "hx-hero__frame" }, media),
            isVideo
              ? h("p", { className: "hx-muted hx-center" }, "El video se reproduce sin sonido hasta que el visitante lo activa.")
              : h(
                  "div",
                  { className: "hx-player" },
                  h("span", { className: "hx-player__btn" }, "▶"),
                  h(
                    "div",
                    null,
                    h("strong", null, d.title || "Nombre de la canción"),
                    h("small", null, "Suena en bucle " + (d.previewSeconds || 59) + " segundos"),
                  ),
                ),
          ),
        ),
        notes.length ? h("div", { className: "hx-notes", key: "notes" }, notes) : null,
      ],
    );
  }

  // ---------- 2 · Videos de YouTube ----------

  function VideoCard(video, index) {
    var id = youtubeId(video.url);
    var featured = index === 0;
    return h(
      "div",
      { className: "hx-video" + (featured ? " hx-video--featured" : ""), key: index },
      id
        ? h("img", { src: "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg", alt: "" })
        : h("div", { className: "hx-video__invalid" }, video.url ? "Enlace no válido" : "Falta el enlace"),
      h(
        "div",
        { className: "hx-video__info" },
        featured ? h("span", { className: "hx-badge hx-badge--solid" }, "Destacado") : null,
        h("strong", null, video.title || "Sin nombre"),
        h("small", null, (video.artists || "HUNTERX") + " · " + (video.kind || "Video Oficial")),
      ),
    );
  }

  function VideosPreview(props) {
    var videos = dataOf(props).videos || [];
    var invalid = videos.filter(function (v) {
      return !youtubeId(v.url);
    }).length;
    return Frame(
      "Videos de YouTube",
      "El primero es el destacado. Si ves la miniatura, el enlace es correcto.",
      [
        videos.length
          ? h("div", { className: "hx-videos", key: "list" }, videos.map(VideoCard))
          : Empty("Agrega al menos un video."),
        invalid
          ? h("div", { className: "hx-notes", key: "notes" }, Warning(invalid + " video(s) con enlace no válido: no se mostrarán en la página."))
          : null,
      ],
    );
  }

  // ---------- 3 · Instagram ----------

  function PostCard(props, post, index) {
    var code = instagramCode(post.url);
    var downloaded = (code && downloadedPosts[code]) || {};
    var src = post.image ? assetUrl(props, post.image) : downloaded.image || "";
    var type = { reel: "Reel", carousel: "Carrusel", photo: "Foto" }[post.type || downloaded.type];
    var username = post.username || downloaded.username || "hunterxoficial";
    return h(
      "div",
      { className: "hx-post", key: index },
      src
        ? h("img", {
            src: src,
            alt: "",
            onError: function (e) {
              e.currentTarget.style.display = "none";
            },
          })
        : null,
      h("div", { className: "hx-post__placeholder" }, code ? "Sin imagen: se verá el logo de Instagram" : "Enlace no válido"),
      h("div", { className: "hx-post__top" }, h("span", { className: "hx-post__avatar" }), username),
      type ? h("span", { className: "hx-post__type" }, type) : null,
    );
  }

  function InstagramPreview(props) {
    var posts = dataOf(props).posts || [];
    var invalid = posts.filter(function (p) {
      return !instagramCode(p.url);
    }).length;
    return Frame(
      "Publicaciones de Instagram",
      "Todas se recortan al mismo tamaño (4:5) y avanzan solas en un carrusel.",
      [
        posts.length
          ? h(
              "div",
              { className: "hx-posts", key: "list" },
              posts.map(function (p, i) {
                return PostCard(props, p, i);
              }),
            )
          : Empty("Agrega al menos una publicación."),
        invalid
          ? h("div", { className: "hx-notes", key: "notes" }, Warning(invalid + " publicación(es) con enlace no válido: no se mostrarán."))
          : null,
      ],
    );
  }

  // ---------- 4 · Plataformas ----------

  function PlatformsPreview(props) {
    var list = dataOf(props).platforms || [];
    return Frame(
      "Plataformas y redes",
      "Cada botón se ilumina con su color al pasar el cursor.",
      list.length
        ? h(
            "div",
            { className: "hx-platforms" },
            list.map(function (p, i) {
              var ok = isHttps(p.url);
              return h(
                "div",
                {
                  className: "hx-platform" + (ok ? "" : " hx-platform--bad"),
                  key: i,
                  style: { borderColor: p.color || GOLD, boxShadow: "0 0 0 1px " + (p.color || GOLD) + "33, 0 10px 30px -15px " + (p.color || GOLD) },
                },
                h("span", { className: "hx-platform__icon" }, p.icon ? h("img", { src: assetUrl(props, p.icon), alt: "" }) : null),
                h(
                  "span",
                  { className: "hx-platform__text" },
                  h("strong", null, p.name || "Sin nombre"),
                  h("small", null, ok ? p.description || "" : "Enlace no válido: debe empezar con https://"),
                ),
                h("span", { className: "hx-platform__arrow" }, "↗"),
              );
            }),
          )
        : Empty("Agrega al menos una plataforma."),
    );
  }

  // ---------- 5 · Artista ----------

  function ArtistPreview(props) {
    var d = dataOf(props);
    return Frame(
      "Datos del artista y textos",
      "Dónde aparece cada dato en la página.",
      h(
        "div",
        { className: "hx-artist" },
        h(
          "section",
          null,
          h("span", { className: "hx-label" }, "Portada principal"),
          h("div", { className: "hx-hero__name hx-hero__name--sm" }, d.name || "Nombre"),
          h("p", null, d.bio || "Descripción"),
        ),
        h(
          "section",
          null,
          h("span", { className: "hx-label" }, "Pantalla de carga"),
          h("p", { className: "hx-caps" }, d.tagline || "Frase corta"),
        ),
        h(
          "section",
          null,
          h("span", { className: "hx-label" }, "Pie de página"),
          h("p", null, d.footerText || "Texto del pie de página"),
        ),
        h(
          "section",
          null,
          h("span", { className: "hx-label" }, "Al compartir"),
          h("div", { className: "hx-share" }, h("p", null, d.shareText || "Mensaje"), h("small", null, d.siteUrl || "")),
        ),
        h(
          "section",
          null,
          h("span", { className: "hx-label" }, "Enlaces principales"),
          h(
            "ul",
            { className: "hx-links" },
            [
              ["Instagram", d.instagramUrl],
              ["YouTube", d.youtubeUrl],
              ["Spotify", d.spotifyUrl],
            ].map(function (l) {
              return h(
                "li",
                { key: l[0] },
                h("strong", null, l[0]),
                h("span", { className: isHttps(l[1]) ? "" : "hx-bad" }, l[1] || "Sin enlace"),
              );
            }),
          ),
        ),
      ),
    );
  }

  // ---------- Widget de guía (no guarda ningún dato) ----------

  function GuideControl(props) {
    var field = props.field;
    var steps = field.get("steps");
    steps = steps && steps.toJS ? steps.toJS() : [];
    return h(
      "div",
      { className: "hx-guide" },
      h("p", { className: "hx-guide__title" }, "Cómo usar esta sección"),
      h("p", { className: "hx-guide__text" }, field.get("text")),
      steps.length
        ? h(
            "ol",
            { className: "hx-guide__steps" },
            steps.map(function (s, i) {
              return h("li", { key: i }, s);
            }),
          )
        : null,
      h(
        "p",
        { className: "hx-guide__foot" },
        "Los cambios se ven al instante en la vista previa. Cuando estén listos, pulsa ",
        h("strong", null, "Publicar"),
        ": la página se actualiza en 1-2 minutos.",
      ),
    );
  }

  // ---------- Registro ----------

  CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Anton&family=Caveat+Brush&family=Manrope:wght@400;600;700&display=swap");
  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("hero", HeroPreview);
  CMS.registerPreviewTemplate("videos", VideosPreview);
  CMS.registerPreviewTemplate("instagram", InstagramPreview);
  CMS.registerPreviewTemplate("platforms", PlatformsPreview);
  CMS.registerPreviewTemplate("artist", ArtistPreview);
  CMS.registerWidget("guia", GuideControl, function () {
    return null;
  });

  // ---------- Traducciones que faltan en el español de Decap ----------

  function fillMissing(target, extra) {
    Object.keys(extra).forEach(function (key) {
      if (extra[key] && typeof extra[key] === "object") {
        target[key] = target[key] || {};
        fillMissing(target[key], extra[key]);
      } else if (!target[key] || /^Add |^Expand$|^Collapse$/.test(target[key])) {
        target[key] = extra[key];
      }
    });
    return target;
  }

  var es = CMS.getLocale("es");
  if (es) {
    CMS.registerLocale(
      "es",
      fillMissing(es, {
        editor: {
          editorWidgets: {
            list: { add: "Agregar %{item}", addType: "Agregar %{item}" },
            object: { expand: "Expandir", collapse: "Contraer" },
          },
        },
      }),
    );
  }

  // ---------- Arranque ----------

  var isLocalhost = ["localhost", "127.0.0.1", "[::1]"].indexOf(location.hostname) !== -1;
  var localMode = isLocalhost && new URLSearchParams(location.search).get("modo") === "local";

  // ---------- Pantalla de inicio de sesión con la marca ----------

  function decorateLogin() {
    var button = Array.prototype.find.call(document.querySelectorAll("button"), function (b) {
      return /Iniciar sesión/.test(b.textContent || "");
    });
    document.body.classList.toggle("hx-login", !!button);
    if (!button || document.querySelector(".hx-login-copy")) return;
    var copy = document.createElement("div");
    copy.className = "hx-login-copy";
    copy.innerHTML =
      "<p class='hx-login-copy__eyebrow'>HUNTERX</p>" +
      "<h1>Panel de administración</h1>" +
      "<p>Edita la portada, los videos, las publicaciones de Instagram y los enlaces de la página.</p>" +
      "<p class='hx-login-copy__note'>" +
      (localMode
        ? "Modo de prueba local: los cambios se guardan en esta PC y no se publican."
        : "Acceso solo para cuentas de GitHub autorizadas. La contraseña se escribe en GitHub, nunca en esta página.") +
      "</p>";
    button.parentNode.insertBefore(copy, button);
  }
  new MutationObserver(decorateLogin).observe(document.body, { childList: true, subtree: true });

  if (localMode) {
    var banner = document.createElement("div");
    banner.className = "hx-local-banner";
    banner.textContent =
      "Modo de prueba local: los cambios se guardan en los archivos de esta PC y NO se publican.";
    document.body.appendChild(banner);
  }

  function start() {
    CMS.init({ config: { local_backend: localMode } });
  }

  // Primero carga los datos descargados de Instagram (para las vistas previas)
  fetch("/instagram/index.json", { cache: "no-cache" })
    .then(function (r) {
      return r.ok ? r.json() : [];
    })
    .then(function (list) {
      (list || []).forEach(function (p) {
        downloadedPosts[p.code] = p;
      });
    })
    .catch(function () {})
    .then(start);
})();
