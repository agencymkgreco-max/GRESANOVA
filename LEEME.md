# GRESANOVA · Sitio web

Proyecto completo, listo para subir. Todas las páginas comparten un solo CSS y un solo JS,
así que un cambio de color o de menú se hace en un lugar y se aplica a todo el sitio.

---

## 1. Cómo publicarlo

Sube **todo el contenido de esta carpeta** a la raíz de tu hosting, tal cual está.
No hay que instalar ni compilar nada. La carpeta `_anterior/` puedes no subirla:
es solo respaldo.

```
index.html          ← página principal
equipo.html
galeria.html
impacto.html
css/gresanova.css   ← todos los estilos
js/gresanova.js     ← todo el comportamiento
fonts/              ← tipografías (no dependen de Google)
img/                ← imágenes y texturas
_anterior/          ← respaldo, NO es necesario subirlo
```

**Importante:** ya no hay página de bienvenida (splash). El sitio abre directo en
`index.html`. Los splash reducen conversión: hacen que el visitante dé un clic extra
antes de ver nada útil. Si lo quieres de vuelta está en `_anterior/sitio-original/`.

---

## 2. El cambio de fondo

Tenías razón en la crítica. El problema no era el color oscuro, era usarlo en todo:
un fondo oscuro con textura pesada funciona para un hero cinematográfico, pero
cansa la vista cuando hay que leer cinco párrafos seguidos.

La solución es la del propio video de referencia (Gcore): **papel claro para leer,
bandas oscuras solo para los momentos de impacto.**

| | |
|---|---|
| **Fondo base** | Papel cálido `#F1EFEA` con fibra muy sutil |
| **Texto** | Grafito `#14191D` — contraste 15.4:1, muy por encima del mínimo |
| **Bandas oscuras** | Hero · Sistema GRESA · Globo · Contacto final |
| **Acento** | Latón `#8A6118` en texto, `#C08B2C` en gráficos |

Los efectos que te gustaron (haz de luz, placa de circuito, globo, revelado por
palabra) siguen ahí: viven en las bandas oscuras, que es donde funcionan.

El menú **cambia de piel solo** según la banda que tenga detrás.

### ¿Y si prefieres la versión oscura?

Está incluida como `alternativa-oscura.html`. Ábrela y compara las dos lado a lado
antes de decidir. Es un archivo único y autónomo, no afecta al resto del sitio.

---

## 3. ⚠️ Tres cosas que debes cambiar antes de publicar

### 3.1 Los enlaces de redes sociales son de ejemplo

Solo WhatsApp es real. Los otros tres apuntan a direcciones inventadas:

| Red | Ahora dice | Dónde cambiarlo |
|---|---|---|
| Instagram | `https://instagram.com/gresanova` | Los 4 archivos `.html` |
| Facebook | `https://facebook.com/gresanova` | Los 4 archivos `.html` |
| TikTok | `https://tiktok.com/@gresanova` | Los 4 archivos `.html` |
| WhatsApp | `wa.me/527775417367` | ✅ correcto |

Ábrelos con cualquier editor de texto, busca y reemplaza. Aparecen en la sección
de redes, en el pie y en contacto.

### 3.2 Los nombres del equipo son marcadores de posición

`equipo.html` tiene cuatro tarjetas que dicen **"Nombre por definir"**.
Están marcadas en el código con `<!-- ⚠ SUSTITUIR: nombre real -->`.

Necesitas cambiar de cada integrante: nombre, cargo y descripción.
La cuarta tarjeta no tiene foto (muestra una silueta) porque solo había tres
fotos de marca en el proyecto.

### 3.3 Retiré dos imágenes por derechos de autor

`cami.jpg` y `han.jpg` eran fotogramas de **The Peanuts Movie** (Snoopy y Charlie
Brown). Usarlas en un sitio comercial es un riesgo legal real.

Las moví a `_anterior/img-derechos-terceros/`. No las vuelvas a poner.

---

## 4. Qué encontré roto en el proyecto anterior

- **La galería no funcionaba.** Apuntaba a `foto1.jpg` … `foto9.jpg`, nueve archivos
  que no existían en el repositorio. Las reemplacé por tus imágenes reales de marca.
- **La página de equipo era una plantilla vacía** con "TU NOMBRE" y "ROL · ESPECIALIDAD".
- **Había archivos duplicados**: `html/galeria.html`, `html/digitalizacion-mundial.html`
  y `html/gresanova-splash.html` eran copias. Y `page1.html` era una versión vieja
  de la home. Todo quedó en `_anterior/`.
- **28 MB de video sin usar.** Loops de stock (pixel-art de hacker, un bar cyberpunk,
  una captura de un juego de coches) que no aportaban nada al sitio. **No los incluí
  en este paquete** para que la descarga fuera manejable: siguen en el ZIP original
  que me enviaste, por si algún día los quieres. El sitio ahora pesa **2.5 MB de
  imágenes** en total.

---

## 5. La página de Impacto

La reconstruí con **los datos reales que estaban enterrados en tu JavaScript**:
41 países y 31 estados de México con cifras, descripciones y fuentes.

Antes esa información vivía dentro de un mapa interactivo que en celular no se
podía usar. Ahora son listas ordenadas con barras, que funcionan en cualquier
pantalla y se leen en segundos.

Incluye el bloque de Morelos con sus datos: 28% de PyMEs digitalizadas,
potencial de +15,000 empleos y $2,800 millones de pesos anuales al PIB estatal.

Si quieres recuperar el mapa interactivo, está completo en `_anterior/sitio-original/`.

---

## 6. Verificado

- Las 4 páginas cargan **sin un solo error de consola**.
- **Sin imágenes rotas** ni enlaces internos muertos.
- **Sin desbordes horizontales** en móvil (probado a 390 px).
- Contraste **WCAG AA** en todos los textos.
- **Sin JavaScript**: todo el contenido sigue visible y legible.
- **Movimiento reducido** (`prefers-reduced-motion`): se apagan haz, pulsos y
  desenfoques, y la pista horizontal se apila en vertical para que ninguna etapa
  quede fuera de alcance.
- Tipografías **auto-hospedadas**: cero peticiones a Google, cargan al instante.

---

## 7. Cosas que valdría la pena hacer después

1. **Redibujar el logo en SVG.** `logoclaro.png` es un mapa de bits de 1152×896 con
   brillos 3D y trazos en cian. A 31 px en el menú se ve blando, y en pantallas
   retina peor. Un SVG lo resolvería para siempre.
2. **Fotos reales del equipo y del trabajo.** Las tres actuales parecen generadas
   por IA. Funcionan como puente, pero fotos reales de una sesión con un cliente
   valen mucho más para vender confianza.
3. **Guardar los prospectos.** El formulario abre WhatsApp con el mensaje ya escrito
   (funciona hoy, sin backend), pero no te deja registro. Con Formspree o Google
   Forms — gratis, sin programar — tendrías copia de cada contacto.
4. **Revisar dos cifras.** El sitio anterior decía "400% ROI" y yo lo puse como
   "4× retorno". Y conviven un "+20%" y un "+23%" de rentabilidad. Si son medidas
   distintas conviene aclararlo; si no, dejar una sola.
5. **Añadir casos reales.** Es lo único que le falta a este sitio para cerrar ventas
   solo: dos o tres clientes con nombre, cifra inicial y cifra final.

---

*Cuernavaca, Morelos · WhatsApp +52 777 541 7367*
