# Raíces de Bruma

RPG 2D de exploración por casillas y combates por turnos, creado con HTML, CSS y JavaScript vanilla. Luma, los enemigos y los guardianes tienen siluetas originales diseñadas con CSS.

## Cómo jugar

Abre `index.html` en un navegador moderno. Muévete con las flechas, con W/A/S/D o con los controles en pantalla. Recoge los tres recursos de la zona, combate a las criaturas y llega al guardián. En batalla, elige Destello, Proteger, Poción o Retirarse. La experiencia y el nivel de Luma se conservan entre capítulos.

## Capítulos

1. **El Valle Antiguo:** recoge tres cristales y vence al Guardián del valle.
2. **Las Cuevas de Eco:** reúne tres ecos resonantes y derrota al Gólem de Eco.
3. **La Cumbre de Bruma:** busca tres sellos y vence a la Reina de Bruma para despejar el cielo.

Cada capítulo tiene su mapa, recursos, criaturas, guardián y ambiente visual propios.

## Regla C

Cada mapa incluye una trampa en el arreglo de casillas. Al caer en ella, no obtienes puntos ni experiencia, pierdes el siguiente turno de movimiento y aparece una alerta roja hasta resolver ese turno.

## Conceptos del taller

El juego muestra variables y tipos primitivos en el estado del personaje; arreglos bidimensionales para los mapas; objetos literales para capítulos, casillas, personajes y criaturas; funciones para movimiento y combate; condiciones para colisiones, encuentros y victorias; eventos de teclado y clic; y manipulación del DOM para representar el mundo y los marcadores.

## Restricciones

No utiliza `canvas`, temporizadores, llamadas de red, almacenamiento del navegador ni librerías externas. Los mapas y los personajes se dibujan con elementos HTML y CSS. Cada movimiento y acción de combate se resuelve de forma inmediata.
