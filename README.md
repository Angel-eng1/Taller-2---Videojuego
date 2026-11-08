# Raíces de Bruma

RPG 2D de exploración por casillas y combate por turnos. Luma recorre tres mapas hechos con HTML, CSS y JavaScript vanilla; personajes, criaturas y terrenos se representan con elementos HTML estilizados con CSS.

## Cómo empezar

Abre `index.html` en un navegador moderno. La introducción de la página presenta la aventura y los controles esenciales aparecen junto al mapa. No hay un tutorial interactivo ni progreso guardado entre sesiones: **Reiniciar aventura** inicia de nuevo el Valle Antiguo y borra el progreso actual.

El objetivo de cada capítulo es reunir sus tres recursos y vencer al guardián. Las misiones de los NPC, puertas, cofres y equipo son opcionales; no hacen falta llaves, misiones ni equipo para llegar a los tres recursos y al jefe.

## Capítulos

1. **El Valle Antiguo:** reúne cristales, explora el bosque y vence al Guardián del valle.
2. **Las Cuevas de Eco:** reúne ecos resonantes y derrota al Gólem de Eco.
3. **La Cumbre de Bruma:** recoge sellos y vence a la Reina de Bruma.

## Exploración

- El mapa es una cuadrícula de 13 × 9 casillas. La niebla oculta las zonas no visitadas; las casillas vistas se recuerdan, pero las criaturas y el jefe solo se muestran dentro del radio visible de Luma. El farol revela trampas cercanas y amplía temporalmente la visión.
- Cada capítulo tiene terrenos propios: el pantano resta 1 PV al entrar (sin bajar de 1); el agua profunda bloquea el paso; el hielo desliza a Luma hasta terreno firme u otro obstáculo y todo el deslizamiento consume un turno.
- El pico despeja troncos caídos y el farol descubre trampas. Ambas herramientas consumen un turno. Si una acción consume el turno congelado por una trampa, primero se resuelve ese turno.
- Las llaves abren puertas y los cofres entregan al azar pociones, hierbas o equipo. Las puertas protegen alcobas opcionales; las llaves y los cofres se reinician en cada capítulo.
- Un NPC ofrece una misión opcional por capítulo: entregar hierbas, derrotar a un Eco errante o revisar un cofre. Hablar no consume turno, salvo que esté pendiente resolver la penalización de una trampa.

## Combate, habilidades y equipo

- Los encuentros se resuelven por turnos. **Habilidades** permite elegir técnicas según el nivel y el foco disponible; el foco se recupera durante el combate y se restaura al comenzar cada capítulo.
- Luz, Tierra, Eco y Hielo interactúan con las debilidades y resistencias de cada criatura. La pantalla de combate muestra el elemento y oculta la debilidad hasta registrar a la criatura en la guía.
- Veneno, congelamiento y aturdimiento tienen duración y efectos propios. La poción de luz cura y elimina el veneno de Luma.
- Las armas y los amuletos cambian ataque, defensa, PV máximos, foco máximo o el daño de ciertos elementos. Se obtienen en cofres, misiones y al vencer guardianes; el equipo se conserva entre capítulos.
- La mochila (I) incluye recursos, objetos, herramientas, habilidades y equipo. No se puede cambiar equipo durante el combate. La guía de criaturas (B) registra criaturas encontradas. **Esc** cierra una ventana.

## Controles

| Acción | Control |
| --- | --- |
| Moverse | Flechas, W/A/S/D o controles en pantalla |
| Abrir mochila | I o botón «Mochila» |
| Abrir guía de criaturas | B o icono del diario |
| Usar pico | P o botón de herramientas en la mochila |
| Usar farol | L o botón de herramientas en la mochila |
| Cerrar ventana | Esc |
| Combate | Botones de habilidades, proteger, poción o retirarse |

## Regla C: trampas y turno congelado

Cada mapa contiene una casilla trampa en `game.tiles`. Al pisarla, no da puntos ni experiencia, activa `game.skipNextTurn`, presenta la alerta y tiñe de rojo el fondo. La siguiente acción que consuma turno resuelve la penalización sin mover a Luma y quita el rojo. El farol puede revelar las trampas antes de pisarlas.

## Conceptos del taller y restricciones

El código documenta dónde se usan los siete conceptos obligatorios: variables y tipos primitivos (`player`, `game`); condicionales (movimiento, terreno y combate); arreglos (mapa 2D, capítulos, habilidades y estados); objetos literales (capítulos, criaturas, equipo y reglas); funciones declaradas y flecha; eventos de teclado, clic y `animationend`; y manipulación del DOM con `createElement`, `textContent` y `replaceChildren`.

El proyecto usa únicamente HTML, CSS y JavaScript vanilla. No usa `<canvas>`, librerías externas, llamadas de red, almacenamiento del navegador, temporizadores ni código asíncrono. El DOM solo presenta el estado; las decisiones se toman desde objetos y arreglos de JavaScript.
