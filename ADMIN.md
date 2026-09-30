# Panel de administración

La página tiene un panel en **`/admin`** (por ejemplo `https://linktreehunterx.netlify.app/admin`) para cambiar su contenido sin tocar código:

- **Portada principal:** canción con su portada, o video.
- **Videos de YouTube:** agregar, quitar y ordenar.
- **Publicaciones de Instagram** del carrusel.
- **Plataformas de música y redes:** links, íconos y colores.
- **Datos del artista y textos:** descripción, pie de página, links y mensaje al compartir.

Al guardar, el panel actualiza los archivos de `client/content/` en GitHub y Netlify vuelve a publicar la página sola en **1-2 minutos**. No hay base de datos.

---

## Configuración inicial (una sola vez)

Hay que hacerla con la cuenta dueña del repositorio (**lenoxprime017-alt**).

### 1. Crear la app de inicio de sesión en GitHub

1. En GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Completa:
   - **Application name:** `Panel HUNTERX`
   - **Homepage URL:** `https://linktreehunterx.netlify.app`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. Pulsa **Register application**.
4. Copia el **Client ID**, pulsa **Generate a new client secret** y copia el **Client secret**. El secreto solo se muestra una vez.

### 2. Conectarla en Netlify

1. En Netlify, abre el sitio y ve a **Site configuration → Access & security → OAuth**.
2. En **Authentication providers**, pulsa **Install provider** y elige **GitHub**.
3. Pega el **Client ID** y el **Client secret** y guarda.

### 3. Entrar

Abre `https://linktreehunterx.netlify.app/admin` y pulsa **Iniciar sesión con GitHub**.

> Si el sitio cambia de dirección, actualiza `site_domain`, `site_url` y `display_url` en `public/admin/config.yml`, y la **Homepage URL** de la OAuth App.

---

## Seguridad

- **Solo pueden guardar cambios las cuentas de GitHub con permiso de escritura en el repositorio.** Cualquiera puede ver la pantalla de inicio de sesión, pero sin esa cuenta no puede cambiar nada.
- **Activa la verificación en dos pasos** en la cuenta de GitHub (**Settings → Password and authentication → Two-factor authentication**). Es la protección más importante.
- Para dar acceso a otra persona: en el repositorio, **Settings → Collaborators → Add people**. Para quitarlo, bórrala de esa lista.
- **Nunca compartas el Client secret** ni lo pongas en el código.
- El panel no se muestra dentro de otras páginas, los buscadores no lo indexan y solo carga el script oficial de Decap, verificado con su huella (SRI).
- La página valida todo lo que viene del panel: solo acepta links `https://` y archivos propios del sitio, y descarta cualquier otra cosa.
- Cada cambio queda en el historial de GitHub, así que cualquier error se puede deshacer.

---

## Consejos de uso

- **Videos de YouTube:** pega el link tal cual (`youtube.com/watch?v=…` o `youtu.be/…`). El primero de la lista es el destacado. Arrastra para cambiar el orden.
- **Instagram:** pega el link del post (••• → Copiar enlace) y **sube la imagen del post** en el mismo formulario, vertical e idealmente de 1080×1350. Si no subes imagen:
  - Se usa la descargada con `npm run instagram` desde la PC, que necesita Chrome instalado.
  - Si tampoco hay imagen descargada, se muestra una tarjeta con el logo de Instagram.
- **Archivos pesados:** usa MP3 de menos de 10 MB y MP4 comprimido de menos de 25 MB. Los archivos grandes pueden fallar al subir y hacen más lenta la página.
- **Probar el panel en la PC sin publicar nada:**
  1. Ejecuta `npm run dev` en una terminal y `npm run cms` en otra.
  2. Abre `http://localhost:8080/admin` y pulsa **Iniciar sesión**. En la PC no pide cuenta.
  3. Los cambios se guardan en los archivos locales; hay que hacer commit para publicarlos.
