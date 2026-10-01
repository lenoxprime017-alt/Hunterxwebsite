/* global CMS, h, createClass */
/**
 * Panel de administración de HUNTERX.
 *
 * - Vistas previas en vivo de cada sección, con el mismo estilo de la página.
 * - Widget «guia»: caja de ayuda al inicio de cada sección (no guarda datos).
 * - Widget «hero-mode»: elige Canción o Video y muestra solo los campos de
 *   ese tipo (los demás se ocultan con CSS, ver admin.css).
 * - Avisos propios (salir sin guardar, eliminar…) en lugar de los del navegador.
 * - Arranque manual: el panel SIEMPRE pide iniciar sesión con GitHub.
 *   El modo de prueba local (sin cuenta, guarda en los archivos de la PC)
 *   solo se activa si se cumplen las dos condiciones:
 *     1. la página se abre en localhost, y
 *     2. la dirección incluye ?modo=local  →  http://localhost:8080/admin/?modo=local
 *   además de tener corriendo `npm run cms`. En el sitio publicado es imposible.
 */
(function () {
  "use strict";

  var GOLD = "#fbbf24";
  var isLocalhost = ["localhost", "127.0.0.1", "[::1]"].indexOf(location.hostname) !== -1;
  var localMode = isLocalhost && new URLSearchParams(location.search).get("modo") === "local";

  /** Datos descargados automáticamente (usuario, tipo, imagen) por código. */
  var downloadedPosts = {};

  // =====================================================================
  // Utilidades
  // =====================================================================

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

  function icon(paths, className) {
    return h(
      "svg",
      {
        className: className || "hx-icon",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
      },
      paths.map(function (d, i) {
        return h("path", { d: d, key: i });
      }),
    );
  }

  var ICON_MUSIC = ["M9 18V5l12-2v13", "M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z", "M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"];
  var ICON_VIDEO = ["M23 7l-7 5 7 5V7z", "M3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"];
  var ICON_PLAY = ["M6 4l14 8-14 8V4z"];

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

  function Warning(text, key) {
    return h("div", { className: "hx-warning", key: key }, text);
  }

  function Info(text, key) {
    return h("div", { className: "hx-info", key: key }, text);
  }

  function Empty(text) {
    return h("div", { className: "hx-empty" }, text);
  }

  // =====================================================================
  // Vistas previas
  // =====================================================================

  // ---------- 1 · Portada principal ----------

  function HeroText(d, centered) {
    return h(
      "div",
      { className: "hx-hero__text" + (centered ? " is-centered" : "") },
      d.badge ? h("span", { className: "hx-badge" }, d.badge) : null,
      h("div", { className: "hx-hero__name" }, "HUNTER", h("span", { className: "hx-gold" }, "X")),
      centered
        ? null
        : h(
            "div",
            { className: "hx-hero__song" },
            h("span", { className: "hx-script" }, d.title || "Nombre de la canción"),
            d.producer ? h("small", null, d.producer) : null,
          ),
      h("p", { className: "hx-muted" }, "Aquí va la descripción (se edita en «5 · Datos del artista»)."),
      h(
        "div",
        { className: "hx-hero__buttons" },
        h("span", { className: "hx-btn hx-btn--gold" }, icon(ICON_PLAY, "hx-icon hx-icon--sm"), "Ver en YouTube"),
        h("span", { className: "hx-btn" }, "Escuchar en Spotify"),
      ),
    );
  }

  function HeroPreview(props) {
    var d = dataOf(props);
    var isVideo = d.mode === "video";
    var cover = assetUrl(props, d.cover);
    var notes = [];

    if (isVideo) {
      var video = assetUrl(props, d.video);
      var poster = assetUrl(props, d.videoPoster) || cover;
      if (!d.video) notes.push(Warning("Falta el video: mientras no subas uno, la página mostrará la portada de la canción.", "v"));
      notes.push(Info("En la página, el video se reproduce en bucle y sin sonido; el visitante puede activar el sonido con un botón.", "i"));
      return Frame("Portada principal · Video", "El video ocupa toda la pantalla detrás del texto.", [
        h(
          "div",
          { className: "hx-hero hx-hero--video", key: "hero" },
          video
            ? h("video", { className: "hx-hero__video", src: video, poster: poster, autoPlay: true, muted: true, loop: true, playsInline: true })
            : poster
              ? h("img", { className: "hx-hero__video", src: poster, alt: "" })
              : null,
          h("div", { className: "hx-hero__shade" }),
          HeroText(d, true),
          h("span", { className: "hx-sound" }, "Activar sonido"),
        ),
        h("div", { className: "hx-notes", key: "notes" }, notes),
      ]);
    }

    if (!d.title) notes.push(Warning("Falta el nombre de la canción.", "t"));
    if (!cover) notes.push(Warning("Falta la portada de la canción.", "c"));
    if (!d.audio) notes.push(Warning("No hay canción (MP3): el reproductor no sonará.", "a"));

    return Frame("Portada principal · Canción", "Así se verá la parte superior de la página.", [
      h(
        "div",
        { className: "hx-hero", key: "hero" },
        cover ? h("img", { className: "hx-hero__bg", src: cover, alt: "" }) : null,
        HeroText(d, false),
        h(
          "div",
          { className: "hx-hero__side" },
          h(
            "div",
            { className: "hx-hero__frame" },
            cover ? h("img", { className: "hx-hero__media", src: cover, alt: "" }) : Empty("Sube una portada para verla aquí."),
          ),
          h(
            "div",
            { className: "hx-player" },
            h("span", { className: "hx-player__btn" }, icon(ICON_PLAY, "hx-icon hx-icon--sm")),
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
    ]);
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
    return Frame("Videos de YouTube", "El primero es el destacado. Si ves la miniatura, el enlace es correcto.", [
      videos.length ? h("div", { className: "hx-videos", key: "list" }, videos.map(VideoCard)) : Empty("Agrega al menos un video."),
      invalid
        ? h("div", { className: "hx-notes", key: "notes" }, Warning(invalid + " video(s) con enlace no válido: no se mostrarán en la página."))
        : null,
    ]);
  }

  // ---------- 3 · Instagram ----------

  function PostCard(post, index) {
    var type = { reel: "Reel", carousel: "Carrusel", photo: "Foto" }[post.type];
    return h(
      "div",
      { className: "hx-post", key: index },
      h("img", { src: post.image, alt: "" }),
      h("div", { className: "hx-post__top" }, h("span", { className: "hx-post__avatar" }), post.username || "hunterxoficial"),
      type ? h("span", { className: "hx-post__type" }, type) : null,
      h("span", { className: "hx-post__index" }, String(index + 1)),
    );
  }

  function InstagramPreview(props) {
    var posts = dataOf(props).posts || [];
    var ready = [];
    var pending = [];
    var invalid = 0;

    posts.forEach(function (p, i) {
      var code = instagramCode(p.url);
      if (!code) {
        invalid += 1;
        return;
      }
      if (downloadedPosts[code]) ready.push({ post: downloadedPosts[code], index: i });
      else pending.push({ code: code, index: i });
    });

    return Frame("Publicaciones de Instagram", "Todas se recortan al mismo tamaño (4:5) y avanzan solas en un carrusel.", [
      ready.length
        ? h(
            "div",
            { className: "hx-posts", key: "ready" },
            ready.map(function (r) {
              return PostCard(r.post, r.index);
            }),
          )
        : null,
      pending.length
        ? h(
            "section",
            { className: "hx-pending", key: "pending" },
            h("h2", null, "Publicaciones nuevas"),
            h(
              "p",
              { className: "hx-muted" },
              "Así se ven en Instagram. Al pulsar Publicar, su imagen se descarga automáticamente y en 2-3 minutos aparecen en el carrusel con el mismo formato que las demás.",
            ),
            h(
              "div",
              { className: "hx-pending__list" },
              pending.map(function (p) {
                return h(
                  "div",
                  { className: "hx-embed", key: p.code },
                  h("span", { className: "hx-post__index" }, String(p.index + 1)),
                  h("iframe", {
                    src: "https://www.instagram.com/p/" + p.code + "/embed/",
                    title: "Publicación de Instagram",
                    scrolling: "no",
                    loading: "lazy",
                  }),
                );
              }),
            ),
          )
        : null,
      !posts.length ? Empty("Agrega al menos una publicación.") : null,
      invalid
        ? h("div", { className: "hx-notes", key: "notes" }, Warning(invalid + " enlace(s) no válidos: no se mostrarán. Copia el enlace desde Instagram con ••• → Copiar enlace."))
        : null,
    ]);
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
              var color = p.color || GOLD;
              return h(
                "div",
                {
                  className: "hx-platform" + (ok ? "" : " hx-platform--bad"),
                  key: i,
                  style: { borderColor: color, boxShadow: "0 0 0 1px " + color + "33, 0 10px 30px -15px " + color },
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
    function block(label, content) {
      return h("section", { key: label }, h("span", { className: "hx-label" }, label), content);
    }
    return Frame(
      "Datos del artista y textos",
      "Dónde aparece cada dato en la página.",
      h("div", { className: "hx-artist" }, [
        block("Portada principal", [
          h("div", { className: "hx-hero__name hx-hero__name--sm", key: "n" }, d.name || "Nombre"),
          h("p", { key: "b" }, d.bio || "Descripción"),
        ]),
        block("Pantalla de carga", h("p", { className: "hx-caps" }, d.tagline || "Frase corta")),
        block("Pie de página", h("p", null, d.footerText || "Texto del pie de página")),
        block("Al compartir", h("div", { className: "hx-share" }, h("p", null, d.shareText || "Mensaje"), h("small", null, d.siteUrl || ""))),
        block(
          "Enlaces principales",
          h(
            "ul",
            { className: "hx-links" },
            [
              ["Instagram", d.instagramUrl],
              ["YouTube", d.youtubeUrl],
              ["Spotify", d.spotifyUrl],
            ].map(function (l) {
              return h("li", { key: l[0] }, h("strong", null, l[0]), h("span", { className: isHttps(l[1]) ? "" : "hx-bad" }, l[1] || "Sin enlace"));
            }),
          ),
        ),
      ]),
    );
  }

  // =====================================================================
  // Widgets propios
  // =====================================================================

  // ---------- Guía (no guarda ningún dato) ----------

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

  // ---------- Tipo de portada: tarjetas Canción / Video ----------

  var HERO_MODES = [
    {
      value: "audio",
      title: "Canción",
      icon: ICON_MUSIC,
      text: "Portada cuadrada con reproductor. La canción suena en bucle.",
      fields: "Nombre, créditos, portada y MP3",
    },
    {
      value: "video",
      title: "Video",
      icon: ICON_VIDEO,
      text: "Video a pantalla completa detrás del texto, como un videoclip.",
      fields: "Video MP4 e imagen de carga",
    },
  ];

  var HeroModeControl = createClass({
    componentDidMount: function () {
      this.sync();
    },
    componentDidUpdate: function () {
      this.sync();
    },
    componentWillUnmount: function () {
      delete document.body.dataset.heroMode;
    },
    sync: function () {
      document.body.dataset.heroMode = this.props.value === "video" ? "video" : "audio";
    },
    render: function () {
      var self = this;
      var value = this.props.value === "video" ? "video" : "audio";
      return h(
        "div",
        { className: "hx-mode", role: "radiogroup", "aria-label": "Tipo de portada" },
        HERO_MODES.map(function (mode) {
          var active = value === mode.value;
          return h(
            "button",
            {
              key: mode.value,
              type: "button",
              role: "radio",
              "aria-checked": active,
              className: "hx-mode__card" + (active ? " is-active" : ""),
              onClick: function () {
                self.props.onChange(mode.value);
              },
            },
            h("span", { className: "hx-mode__check" }, active ? "Seleccionado" : "Elegir"),
            h("span", { className: "hx-mode__icon" }, icon(mode.icon)),
            h("strong", { className: "hx-mode__title" }, mode.title),
            h("span", { className: "hx-mode__text" }, mode.text),
            h("span", { className: "hx-mode__fields" }, "Campos: " + mode.fields),
          );
        }),
      );
    },
  });

  // =====================================================================
  // Avisos propios en lugar de window.confirm / window.alert
  // =====================================================================
  //
  // Decap pide confirmación con window.confirm, que es sincrónico. Para usar
  // un aviso con diseño: se cancela la acción, se muestra el aviso y, si la
  // persona confirma, se repite la misma acción (el mismo clic) ya aprobada.
  // El aviso al CERRAR o RECARGAR la pestaña lo muestra el navegador y no se
  // puede rediseñar (es una protección de los navegadores).

  var approved = false;
  var lastClick = { el: null, time: 0 };
  document.addEventListener(
    "click",
    function (e) {
      if (!e.target.closest || !e.target.closest(".hx-dialog")) lastClick = { el: e.target, time: Date.now() };
    },
    true,
  );

  function describeConfirm(message) {
    var es = (CMS.getLocale("es") || {}).editor || {};
    var editor = es.editor || {};
    var text = String(message || "");
    if (text === editor.onLeavePage || /dejar esta página|salir de esta página|leave this page/i.test(text)) {
      return {
        title: "Tienes cambios sin publicar",
        body: "Si sales ahora, se perderán los cambios que hiciste en esta sección. Para conservarlos, quédate y pulsa Publicar.",
        confirm: "Salir sin guardar",
        cancel: "Seguir editando",
        danger: true,
      };
    }
    if (/eliminar|borrar|delete/i.test(text)) {
      return {
        title: "¿Eliminar definitivamente?",
        body: text + " Esta acción se publica en la página y no se puede deshacer desde aquí.",
        confirm: "Sí, eliminar",
        cancel: "Cancelar",
        danger: true,
      };
    }
    return { title: "Confirmar acción", body: text, confirm: "Continuar", cancel: "Cancelar" };
  }

  function showDialog(opts) {
    return new Promise(function (resolve) {
      var previousFocus = document.activeElement;
      var overlay = document.createElement("div");
      overlay.className = "hx-dialog";
      overlay.setAttribute("role", "alertdialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML =
        '<div class="hx-dialog__card' + (opts.danger ? " is-danger" : "") + '">' +
        '<div class="hx-dialog__icon" aria-hidden="true">!</div>' +
        '<h2 class="hx-dialog__title"></h2>' +
        '<p class="hx-dialog__body"></p>' +
        '<div class="hx-dialog__actions">' +
        (opts.cancel ? '<button type="button" class="hx-dialog__btn" data-act="cancel"></button>' : "") +
        '<button type="button" class="hx-dialog__btn hx-dialog__btn--primary" data-act="ok"></button>' +
        "</div></div>";
      overlay.querySelector(".hx-dialog__title").textContent = opts.title;
      overlay.querySelector(".hx-dialog__body").textContent = opts.body;
      overlay.querySelector('[data-act="ok"]').textContent = opts.confirm || "Entendido";
      if (opts.cancel) overlay.querySelector('[data-act="cancel"]').textContent = opts.cancel;

      function close(result) {
        document.removeEventListener("keydown", onKey, true);
        overlay.classList.add("is-leaving");
        setTimeout(function () {
          overlay.remove();
          if (previousFocus && previousFocus.focus) previousFocus.focus();
        }, 160);
        resolve(result);
      }
      function onKey(e) {
        if (e.key === "Escape") {
          e.preventDefault();
          close(false);
        }
      }
      overlay.addEventListener("click", function (e) {
        var act = e.target.getAttribute && e.target.getAttribute("data-act");
        if (act === "ok") close(true);
        else if (act === "cancel" || e.target === overlay) close(false);
      });
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(overlay);
      var focusTarget = overlay.querySelector('[data-act="cancel"]') || overlay.querySelector('[data-act="ok"]');
      setTimeout(function () {
        focusTarget.focus();
      }, 30);
    });
  }

  window.confirm = function (message) {
    if (approved) {
      approved = false;
      return true;
    }
    var target = lastClick.el && Date.now() - lastClick.time < 2000 ? lastClick.el : null;
    showDialog(describeConfirm(message)).then(function (ok) {
      if (!ok) return;
      approved = true;
      if (target && document.contains(target)) target.click();
      else history.back();
      setTimeout(function () {
        approved = false;
      }, 1500);
    });
    return false;
  };

  window.alert = function (message) {
    showDialog({ title: "Aviso", body: String(message || ""), confirm: "Entendido" });
  };

  // =====================================================================
  // Restablecer la página al punto de restauración
  // =====================================================================
  //
  // public/admin/restore-point.json guarda el contenido de la página en el
  // momento elegido (se crea con `npm run punto-restauracion`). El botón vuelve
  // a escribir esos archivos en UN SOLO cambio:
  //   - Sitio real: commit en GitHub con la misma sesión del panel (solo
  //     funciona para cuentas con permiso de escritura en el repositorio).
  //   - Modo de prueba local: se escriben los archivos de la PC.

  var SECTION_LABELS = {
    "client/content/hero.json": "Portada principal",
    "client/content/videos.json": "Videos de YouTube",
    "client/content/instagram.json": "Publicaciones de Instagram",
    "client/content/platforms.json": "Plataformas y redes",
    "client/content/artist.json": "Datos del artista y textos",
  };

  function readBackendConfig() {
    return fetch("/admin/config.yml", { cache: "no-cache" })
      .then(function (r) {
        return r.text();
      })
      .then(function (text) {
        var repo = (text.match(/^\s*repo:\s*([\w.-]+\/[\w.-]+)/m) || [])[1];
        var branch = (text.match(/^\s*branch:\s*([\w./-]+)/m) || [])[1] || "main";
        if (!repo) throw new Error("No se encontró el repositorio en config.yml");
        return { repo: repo, branch: branch };
      });
  }

  function githubRequest(token, method, url, body) {
    return fetch("https://api.github.com" + url, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (r.status === 401) throw new Error("La sesión de GitHub expiró. Cierra sesión y vuelve a entrar.");
      if (r.status === 403 || r.status === 404)
        throw new Error("Tu cuenta de GitHub no tiene permiso para modificar el repositorio de la página.");
      if (!r.ok) throw new Error("GitHub respondió con un error (" + r.status + "). Inténtalo de nuevo en unos minutos.");
      return r.json();
    });
  }

  /** Un solo commit con todos los archivos (si algo falla, no se cambia nada). */
  function restoreOnGitHub(files) {
    var user = JSON.parse(localStorage.getItem("decap-cms-user") || "null");
    if (!user || !user.token) return Promise.reject(new Error("No hay una sesión de GitHub activa. Vuelve a iniciar sesión."));
    var token = user.token;
    return readBackendConfig().then(function (cfg) {
      var base = "/repos/" + cfg.repo + "/git";
      var headSha;
      return githubRequest(token, "GET", base + "/ref/heads/" + cfg.branch)
        .then(function (ref) {
          headSha = ref.object.sha;
          return githubRequest(token, "GET", base + "/commits/" + headSha);
        })
        .then(function (commit) {
          return githubRequest(token, "POST", base + "/trees", {
            base_tree: commit.tree.sha,
            tree: Object.keys(files).map(function (path) {
              return { path: path, mode: "100644", type: "blob", content: files[path] };
            }),
          });
        })
        .then(function (tree) {
          return githubRequest(token, "POST", base + "/commits", {
            message: "Panel: restablece la página al punto de restauración",
            tree: tree.sha,
            parents: [headSha],
          });
        })
        .then(function (newCommit) {
          return githubRequest(token, "PATCH", base + "/refs/heads/" + cfg.branch, { sha: newCommit.sha });
        });
    });
  }

  function restoreLocally(files) {
    return fetch("http://localhost:8081/api/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "persistEntry",
        params: {
          branch: "main",
          dataFiles: Object.keys(files).map(function (path) {
            return { slug: path.split("/").pop().replace(".json", ""), path: path, raw: files[path] };
          }),
          assets: [],
          options: { collectionName: "contenido", commitMessage: "Restablecer", useWorkflow: false, status: "draft" },
        },
      }),
    }).then(function (r) {
      if (!r.ok) throw new Error("No se pudo escribir en la PC. Revisa que esté corriendo «npm run cms».");
    });
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return "";
    }
  }

  /** Ventana para elegir qué secciones restablecer. */
  function showRestoreDialog(snapshot) {
    return new Promise(function (resolve) {
      var paths = Object.keys(snapshot.files);
      var overlay = document.createElement("div");
      overlay.className = "hx-dialog";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML =
        '<div class="hx-dialog__card hx-dialog__card--wide is-danger">' +
        '<div class="hx-dialog__icon" aria-hidden="true">↺</div>' +
        '<h2 class="hx-dialog__title">Restablecer la página</h2>' +
        '<p class="hx-dialog__body"></p>' +
        '<div class="hx-restore__list"></div>' +
        '<p class="hx-restore__note">Los cambios que hiciste en las secciones marcadas se reemplazan. Si te arrepientes, el estado anterior queda guardado en el historial de GitHub.</p>' +
        '<div class="hx-dialog__actions">' +
        '<button type="button" class="hx-dialog__btn" data-act="cancel">Cancelar</button>' +
        '<button type="button" class="hx-dialog__btn hx-dialog__btn--primary" data-act="ok">Restablecer</button>' +
        "</div></div>";
      overlay.querySelector(".hx-dialog__body").textContent =
        "Vuelve a dejar la página como estaba en el punto de restauración" +
        (snapshot.createdAt ? " del " + formatDate(snapshot.createdAt) : "") +
        ". Elige qué secciones restablecer:";
      var list = overlay.querySelector(".hx-restore__list");
      paths.forEach(function (path) {
        var label = document.createElement("label");
        label.className = "hx-restore__item";
        var box = document.createElement("input");
        box.type = "checkbox";
        box.checked = true;
        box.value = path;
        var text = document.createElement("span");
        text.textContent = SECTION_LABELS[path] || path;
        label.appendChild(box);
        label.appendChild(text);
        list.appendChild(label);
      });
      var okBtn = overlay.querySelector('[data-act="ok"]');
      list.addEventListener("change", function () {
        okBtn.disabled = !list.querySelector("input:checked");
      });

      function close(result) {
        document.removeEventListener("keydown", onKey, true);
        overlay.classList.add("is-leaving");
        setTimeout(function () {
          overlay.remove();
        }, 160);
        resolve(result);
      }
      function onKey(e) {
        if (e.key === "Escape") close(null);
      }
      overlay.addEventListener("click", function (e) {
        var act = e.target.getAttribute && e.target.getAttribute("data-act");
        if (act === "ok") {
          close(
            Array.prototype.map.call(list.querySelectorAll("input:checked"), function (b) {
              return b.value;
            }),
          );
        } else if (act === "cancel" || e.target === overlay) close(null);
      });
      document.addEventListener("keydown", onKey, true);
      document.body.appendChild(overlay);
      setTimeout(function () {
        overlay.querySelector('[data-act="cancel"]').focus();
      }, 30);
    });
  }

  function showProgress(text) {
    var overlay = document.createElement("div");
    overlay.className = "hx-dialog";
    overlay.innerHTML =
      '<div class="hx-dialog__card"><div class="hx-spinner" aria-hidden="true"></div>' +
      '<h2 class="hx-dialog__title"></h2><p class="hx-dialog__body">No cierres esta página.</p></div>';
    overlay.querySelector(".hx-dialog__title").textContent = text;
    document.body.appendChild(overlay);
    return function () {
      overlay.remove();
    };
  }

  function startRestore() {
    fetch("/admin/restore-point.json", { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("No se encontró el punto de restauración.");
        return r.json();
      })
      .then(function (snapshot) {
        return showRestoreDialog(snapshot).then(function (selected) {
          if (!selected || !selected.length) return;
          var files = {};
          selected.forEach(function (p) {
            files[p] = snapshot.files[p];
          });
          var hide = showProgress("Restableciendo la página…");
          return (localMode ? restoreLocally(files) : restoreOnGitHub(files))
            .then(function () {
              hide();
              return showDialog({
                title: "Página restablecida",
                body: localMode
                  ? "Se restablecieron los archivos de esta PC. El panel se recargará para mostrar el contenido."
                  : "Listo. La página publicada vuelve a ese estado en 1-2 minutos. El panel se recargará para mostrar el contenido restablecido.",
                confirm: "Entendido",
              }).then(function () {
                location.hash = "#/collections/contenido";
                location.reload();
              });
            })
            .catch(function (err) {
              hide();
              throw err;
            });
        });
      })
      .catch(function (err) {
        showDialog({ title: "No se pudo restablecer", body: err.message + " No se cambió nada en la página.", confirm: "Entendido", danger: true });
      });
  }

  /** Botón fijo en el panel (no aparece en la pantalla de inicio de sesión). */
  function mountRestoreButton() {
    if (document.querySelector(".hx-restore-btn")) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "hx-restore-btn";
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "<span>Restablecer página</span>";
    button.title = "Volver al punto de restauración";
    button.addEventListener("click", startRestore);
    document.body.appendChild(button);
  }
  mountRestoreButton();

  // =====================================================================
  // Traducciones que faltan en el español de Decap
  // =====================================================================

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

  // =====================================================================
  // Pantalla de inicio de sesión con la marca
  // =====================================================================

  function decorateLogin() {
    var button = Array.prototype.find.call(document.querySelectorAll("button"), function (b) {
      return /Iniciar sesión/.test(b.textContent || "") && !b.closest(".hx-dialog");
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

  // =====================================================================
  // Registro y arranque
  // =====================================================================

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
  CMS.registerWidget("hero-mode", HeroModeControl, function () {
    return null;
  });

  if (localMode) {
    var banner = document.createElement("div");
    banner.className = "hx-local-banner";
    banner.textContent = "Modo de prueba local: los cambios se guardan en los archivos de esta PC y NO se publican.";
    document.body.appendChild(banner);
  }

  function start() {
    CMS.init({ config: { local_backend: localMode } });
  }

  // Primero carga los datos de Instagram ya descargados (para las vistas previas)
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
