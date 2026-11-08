
'use strict';

// Variables y tipos primitivos (constantes numéricas)
const mapSize = { width: 13, height: 9 };

// Objeto literal con el estado del personaje (números)
const player = { x: 1, y: 1, hp: 24, level: 1, xp: 0, focus: 4, fragments: 0, potions: 2, herbs: 0, keys: 0, maxFocusBonus: 0, statuses: [], equipment: { weapon: null, charm: null }, gear: [] };

// Objeto literal con el estado global (booleanos, números, arreglos, strings y null)
const game = { tiles: [], turn: 1, chapterIndex: 0, skipNextTurn: false, alertActive: false, inBattle: false, completed: false, chapterComplete: false, battle: null, discoveredCreatures: [], defeatedCreatures: {}, quests: {}, questFlags: {}, dialogueLine: 0, activeModal: null, modalOpener: null, inventoryTab: 'materials' };

// Arreglo de objetos literales: un objeto por capítulo. Las coordenadas son arreglos [x, y].
const chapters = [
  {
    name: 'El Valle Antiguo', shortName: 'EL VALLE', region: 'BOSQUE DEL VALLE', zone: 'Sendero de los ecos', weather: 'BRUMA LIGERA', weatherIcon: '☼', biome: 'valley',
    resource: 'Cristal', resourcePlural: 'cristales', resourceGlyph: '✦', boss: 'guardian', bossGear: 'root-staff',
    objectiveTitle: 'Despierta el santuario.', objective: 'El guardián solo dejará pasar a quien traiga los tres fragmentos del valle.',
    stepOne: 'Explora el bosque y recoge sus cristales.', stepTwo: 'Guía a Luma hasta el guardián del santuario.',
    ending: 'El valle respira.', endingCopy: 'Luma reunió los cristales y devolvió la luz al bosque.',
    walls: [[3,1],[7,1],[5,2],[9,2],[5,3],[10,3],[2,5],[8,5],[4,7],[7,7],[10,7],[1,6]], breakables: [[11,6]],
    swamps: [[2,3],[6,4],[9,7],[11,4]], waters: [], ice: [],
    chests: [[1,7],[6,7]], doors: [[2,7]], keys: [[3,7]],
    grass: [[2,2],[3,2],[7,3],[8,4],[10,5],[2,6],[6,6],[9,6]],
    relics: [[4,1],[9,3],[3,6]], herbs: [[4,4],[10,6],[11,7]], traps: [[6,5]],
    creatures: [[4,3,'moss'],[9,5,'bramble']], signs: [[1,5]], bossAt: [11,1],
    npc: { x: 1, y: 2, name: 'Don Roble', sprite: 'npc-ranger', colors: ['#879b64', '#d4bf83'], dialogues: { available: ['La humedad trae de vuelta mis dolores. ¿Me ayudarías?', 'Necesito dos hierbas curativas para preparar un remedio.'], active: ['¿Encontraste las dos hierbas? El remedio ayudará a quienes cruzan el bosque.'], ready: ['¡Eso es! Con estas hierbas podré preparar el remedio.'], done: ['Gracias, viajera. El bosque recordará tu generosidad.'] }, quest: { id: 'herbs-for-ranger', title: 'Dos hierbas para el viejo guardabosques', requirement: { type: 'herbs', amount: 2 }, description: 'Entrega 2 hierbas curativas.', reward: { type: 'gear', id: 'moss-mantle', duplicatePotions: 2 } } }
  },
  {
    name: 'Las Cuevas de Eco', shortName: 'LAS CUEVAS', region: 'GRUTAS LUMINOSAS', zone: 'Galería de las voces', weather: 'POLVO DE LUZ', weatherIcon: '✧', biome: 'cave',
    resource: 'Eco', resourcePlural: 'ecos', resourceGlyph: '◉', boss: 'echoGolem', bossGear: 'echo-pendant',
    objectiveTitle: 'Silencia la caverna.', objective: 'Reúne tres ecos resonantes para abrir la cámara del corazón de piedra.',
    stepOne: 'Busca los ecos entre las columnas de cristal.', stepTwo: 'Vence al Gólem de Eco en la cámara profunda.',
    ending: 'La cueva vuelve a cantar.', endingCopy: 'Luma calmó la resonancia y el camino bajo la montaña se abrió.',
    walls: [[3,1],[8,1],[5,2],[10,2],[3,4],[9,5],[4,7],[8,7],[10,7]], breakables: [[7,4]],
    swamps: [], waters: [[6,3],[7,3],[7,2],[7,5]], ice: [],
    chests: [[11,7],[2,7]], doors: [[11,6]], keys: [[10,5]],
    grass: [[2,2],[4,2],[8,3],[2,5],[6,6],[10,6]],
    relics: [[2,4],[6,2],[10,4]], herbs: [[4,5],[9,6]], traps: [[6,5]],
    creatures: [[4,3,'echoWisp'],[9,3,'caveBat']], signs: [[1,6]], bossAt: [11,1],
    npc: { x: 1, y: 2, name: 'Nara, la resonante', sprite: 'npc-echo-guide', colors: ['#a68bc9', '#7ccee0'], dialogues: { available: ['El eco errante repite voces que ya no están.', 'Si logras derrotarlo, la cueva recuperará el silencio.'], active: ['¿El eco errante dejó de perseguirnos?'], ready: ['Lo escucho… por fin, la cueva está en calma.'], done: ['Tu hazaña todavía resuena en estas paredes.'] }, quest: { id: 'silence-wandering-echo', title: 'Silenciar al eco errante', requirement: { type: 'enemy', enemyId: 'echoWisp', amount: 1 }, description: 'Derrota a un Eco errante.', reward: { type: 'maxFocus', amount: 1 } } }
  },
  {
    name: 'La Cumbre de Bruma', shortName: 'LA CUMBRE', region: 'CRESTA CELESTE', zone: 'Cima de los vientos', weather: 'NIEVE SUAVE', weatherIcon: '❄', biome: 'peak',
    resource: 'Sello', resourcePlural: 'sellos', resourceGlyph: '⬡', boss: 'mistQueen', bossGear: 'frost-charm',
    objectiveTitle: 'Disipa la gran bruma.', objective: 'Encuentra los tres sellos de altura y alcanza la cima para desafiar a la reina de la niebla.',
    stepOne: 'Recorre las terrazas y reúne los sellos.', stepTwo: 'Vence a la Reina de Bruma en la cumbre.',
    ending: 'El cielo se abre.', endingCopy: 'Luma rompió el último sello de la bruma. El valle queda libre y la aventura llega a su fin.',
    walls: [[3,1],[7,1],[10,2],[8,3],[2,5],[6,5],[9,6],[4,7],[7,7],[10,7]], breakables: [[4,3]],
    swamps: [], waters: [], ice: [[5,2],[5,3],[5,4],[11,3],[11,4],[11,5],[3,5],[4,5],[5,5],[5,6]],
    chests: [[11,7],[1,7]], doors: [[11,6]], keys: [[11,2]],
    grass: [[2,2],[6,2],[9,3],[3,4],[7,4],[10,5],[2,6]],
    relics: [[5,1],[9,4],[3,6]], herbs: [[2,4],[10,6]], traps: [[6,6]],
    creatures: [[4,2,'ridgeWolf'],[8,5,'frostWisp']], signs: [[1,6]], bossAt: [11,1],
    npc: { x: 1, y: 2, name: 'Vigía Nival', sprite: 'npc-lookout', colors: ['#badce0', '#e5c982'], dialogues: { available: ['Desde aquí vigilo las rutas cubiertas de bruma.', 'Abre el cofre señalizado junto al sendero y trae noticias.'], active: ['¿Pudiste revisar el cofre del sendero?'], ready: ['¡Encontraste la señal! Ya sé dónde acecha la trampa.'], done: ['Mantendré el paso vigilado. Gracias por el reporte.'] }, quest: { id: 'lookout-report', title: 'Reporte del vigía', requirement: { type: 'chest', x: 1, y: 7 }, description: 'Abre el cofre junto al sendero del sur.', reward: { type: 'revealTrap', potions: 1 } } }
  }
];


// Arreglo de objetos literales: equipo temático, repartido entre los tres capítulos.
const gearCatalog = [
  { id: 'root-staff', name: 'Bastón de raíz', slot: 'weapon', chapter: 'valley', description: 'Madera viva que fortalece los ataques de Luma.', stats: { attack: 1, elementBonus: { Luz: 0.1 } } },
  { id: 'moss-mantle', name: 'Manto de musgo', slot: 'charm', chapter: 'valley', description: 'Hojas suaves amortiguan los golpes.', stats: { defense: 1, maxHp: 3 } },
  { id: 'seed-medallion', name: 'Medallón de semilla', slot: 'charm', chapter: 'valley', description: 'Una semilla antigua conserva energía luminosa.', stats: { maxFocus: 1 } },
  { id: 'echo-pendant', name: 'Colgante de eco', slot: 'charm', chapter: 'cave', description: 'Amplifica los ataques que resuenan en las cuevas.', stats: { elementBonus: { Eco: 0.25 } } },
  { id: 'crystal-rod', name: 'Vara de cuarzo', slot: 'weapon', chapter: 'cave', description: 'Un cristal afilado añade potencia al ataque.', stats: { attack: 2 } },
  { id: 'resonance-buckle', name: 'Broche resonante', slot: 'charm', chapter: 'cave', description: 'Su vibración protege de los impactos.', stats: { defense: 1, maxFocus: 1 } },
  { id: 'mist-staff', name: 'Báculo de la cumbre', slot: 'weapon', chapter: 'peak', description: 'Canaliza la luz fría hacia ataques más fuertes.', stats: { attack: 2, elementBonus: { Luz: 0.1, Hielo: 0.25 } } },
  { id: 'frost-charm', name: 'Amuleto de escarcha', slot: 'charm', chapter: 'peak', description: 'Un núcleo helado refuerza la defensa.', stats: { defense: 2, maxHp: 2 } },
  { id: 'aurora-ring', name: 'Anillo de aurora', slot: 'charm', chapter: 'peak', description: 'La aurora aumenta la reserva de foco.', stats: { maxFocus: 2, elementBonus: { Luz: 0.1 } } }
];

// Objeto literal: botines posibles de cofres por capítulo, incluidos objetos únicos.
const lootTables = {
  valley: [{ type: 'potion', amount: 1 }, { type: 'herb', amount: 1 }, { type: 'gear', id: 'moss-mantle' }, { type: 'gear', id: 'seed-medallion' }],
  cave: [{ type: 'herb', amount: 1 }, { type: 'potion', amount: 1 }, { type: 'gear', id: 'crystal-rod' }, { type: 'gear', id: 'resonance-buckle' }],
  peak: [{ type: 'potion', amount: 2 }, { type: 'herb', amount: 1 }, { type: 'gear', id: 'mist-staff' }, { type: 'gear', id: 'aurora-ring' }]
};

// Deriva estadísticas base por nivel y suma únicamente las ranuras equipadas.
function getPlayerStats() {
  const stats = { maxHp: 24 + (player.level - 1) * 4, maxFocus: Math.min(8, 4 + player.level - 1) + player.maxFocusBonus, attack: 0, defense: 0, elementBonus: {} };
  Object.values(player.equipment).forEach(gearId => {
    const item = gearCatalog.find(gear => gear.id === gearId);
    if (!item) return;
    Object.entries(item.stats).forEach(([stat, value]) => {
      if (stat === 'elementBonus') {
        Object.entries(value).forEach(([element, bonus]) => {
          stats.elementBonus[element] = (stats.elementBonus[element] || 0) + bonus;
        });
      } else stats[stat] += value;
    });
  });
  return stats;
}

function grantGear(gearId) {
  const item = gearCatalog.find(gear => gear.id === gearId);
  if (!item || player.gear.includes(gearId)) return null;
  player.gear.push(gearId);
  return item;
}

function equipGear(action, gearId) {
  if (game.inBattle || !player.gear.includes(gearId)) return;
  const item = gearCatalog.find(gear => gear.id === gearId);
  if (!item) return;
  player.equipment[item.slot] = action === 'equip' ? gearId : null;
  const nextStats = getPlayerStats();
  player.hp = Math.min(player.hp, nextStats.maxHp);
  player.focus = Math.min(player.focus, nextStats.maxFocus);
  updatePlayerPanel();
  renderBattleBars();
  renderInventoryTab();
}

// Referencias al DOM (solo para mostrar información, nunca para guardar el estado)
const ui = {
  grid: document.querySelector('#world-grid'),
  worldCard: document.querySelector('.world-card'),
  exploration: document.querySelector('#exploration-view'),
  battleView: document.querySelector('#battle-view'),
  battleArena: document.querySelector('.battle-arena'),
  battleMessage: document.querySelector('#battle-message'),
  enemyCreature: document.querySelector('.creature-enemy'),
  playerCreature: document.querySelector('.creature-player'),
  enemySprite: document.querySelector('#enemy-sprite'),
  playerSprite: document.querySelector('.creature-player .character-sprite'),
  battleActions: document.querySelector('#battle-actions'),
  battleContinue: document.querySelector('#battle-continue'),
  enemyElementLabel: document.querySelector('#enemy-element-label'),
  enemyStatuses: document.querySelector('#enemy-statuses'),
  playerStatuses: document.querySelector('#player-statuses'),
  skillMenu: document.querySelector('#skill-menu'),
  battleFocusLabel: document.querySelector('#battle-focus-label'),
  battleFocusBar: document.querySelector('#battle-focus-bar'),
  trapAlert: document.querySelector('#trap-alert'),
  worldMessage: document.querySelector('#world-message'),
  turnCount: document.querySelector('#turn-count'),
  crystalCount: document.querySelector('#resource-count'),
  crystalTrack: document.querySelector('#crystal-track'),
  inventoryCrystals: document.querySelector('#inventory-crystals'),
  inventoryPotions: document.querySelector('#inventory-potions'),
  inventoryHerbs: document.querySelector('#inventory-herbs'),
  keyLabel: document.querySelector('#key-side-label'),
  gearSummary: document.querySelector('#gear-side-summary'),
  hpLabel: document.querySelector('#hp-side-label'),
  hpBar: document.querySelector('#hp-side-bar'),
  focusLabel: document.querySelector('#focus-side-label'),
  focusBar: document.querySelector('#focus-side-bar'),
  xpLabel: document.querySelector('#xp-label'),
  xpBar: document.querySelector('#xp-bar'),
  level: document.querySelector('#level-badge'),
  companionPortrait: document.querySelector('.companion-portrait'),
  journal: document.querySelector('#journal-entry'),
  ending: document.querySelector('#ending-card'),
  nextChapter: document.querySelector('#next-chapter-button'),
  inventoryModal: document.querySelector('#inventory-modal'),
  bestiaryModal: document.querySelector('#bestiary-modal'),
  dialogueModal: document.querySelector('#dialogue-modal'),
  dialogueTitle: document.querySelector('#dialogue-title'),
  dialogueText: document.querySelector('#dialogue-text'),
  dialogueQuest: document.querySelector('#dialogue-quest'),
  dialogueActions: document.querySelector('#dialogue-actions'),
  sideQuestLine: document.querySelector('#side-quest-line'),
  inventoryList: document.querySelector('#inventory-list'),
  bestiaryGrid: document.querySelector('#bestiary-grid')
};

// Objeto literal con las definiciones de criaturas (cada propiedad es un objeto literal)
const enemyTypes = {
  moss: { name: 'Musguito', sprite: 'moss', element: 'Tierra', weakness: 'Luz', resist: 'Eco', inflicts: { status: 'veneno', chance: 0.3 }, habitat: 'El Valle Antiguo', lore: 'Un pequeño guardián que brota en los senderos húmedos.', maxHp: 13, minDamage: 2, maxDamage: 4, xp: 1, isBoss: false },
  bramble: { name: 'Zarzal', sprite: 'bramble', element: 'Espina', weakness: 'Luz', resist: ['Tierra'], inflicts: { status: 'veneno', chance: 0.3 }, habitat: 'El Valle Antiguo', lore: 'Protege los claros cubiertos de raíces retorcidas.', maxHp: 17, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  guardian: { name: 'Guardián del valle', sprite: 'guardian', element: 'Roca', weakness: 'Luz', resist: 'Tierra', inflicts: { status: 'veneno', chance: 0.25 }, habitat: 'El Valle Antiguo', lore: 'Antigua estatua que cuida los cristales del santuario.', maxHp: 29, minDamage: 4, maxDamage: 6, xp: 3, isBoss: true },
  echoWisp: { name: 'Eco errante', sprite: 'echo', element: 'Eco', weakness: 'Tierra', resist: 'Luz', inflicts: { status: 'aturdido', chance: 0.2 }, habitat: 'Las Cuevas de Eco', lore: 'Una voz perdida que toma forma entre las galerías.', maxHp: 15, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  caveBat: { name: 'Murciélago de cuarzo', sprite: 'bat', element: 'Cristal', weakness: 'Eco', resist: ['Hielo'], inflicts: { status: 'aturdido', chance: 0.2 }, habitat: 'Las Cuevas de Eco', lore: 'Sus alas resuenan cuando alguien toca las paredes.', maxHp: 18, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  echoGolem: { name: 'Gólem de Eco', sprite: 'echo-golem', element: 'Cristal', weakness: 'Luz', resist: ['Tierra', 'Hielo'], inflicts: { status: 'aturdido', chance: 0.25 }, habitat: 'Las Cuevas de Eco', lore: 'Guardián tallado para contener el corazón resonante.', maxHp: 33, minDamage: 4, maxDamage: 7, xp: 3, isBoss: true },
  ridgeWolf: { name: 'Lobo de escarcha', sprite: 'wolf', element: 'Hielo', weakness: 'Luz', resist: 'Eco', inflicts: { status: 'congelado', chance: 0.35 }, habitat: 'La Cumbre de Bruma', lore: 'Sigue las huellas de los viajeros por las terrazas nevadas.', maxHp: 20, minDamage: 4, maxDamage: 6, xp: 1, isBoss: false },
  frostWisp: { name: 'Espíritu glaciar', sprite: 'frost', element: 'Hielo', weakness: 'Tierra', resist: 'Luz', inflicts: { status: 'congelado', chance: 0.35 }, habitat: 'La Cumbre de Bruma', lore: 'Se forma donde la bruma se congela al amanecer.', maxHp: 22, minDamage: 4, maxDamage: 6, xp: 1, isBoss: false },
  mistQueen: { name: 'Reina de Bruma', sprite: 'mist-queen', element: 'Bruma', weakness: 'Luz', resist: ['Tierra'], inflicts: { status: 'congelado', chance: 0.25 }, habitat: 'La Cumbre de Bruma', lore: 'La guardiana final. Su niebla cubrió los caminos del valle.', maxHp: 38, minDamage: 5, maxDamage: 7, xp: 3, isBoss: true }
};

// Objeto literal: tabla de eficacia de los cuatro elementos disponibles para ataques del jugador.
const elementChart = {
  Luz: { weakAgainst: ['Bruma', 'Hielo', 'Espina'], resistedBy: ['Cristal', 'Eco'] },
  Tierra: { weakAgainst: ['Eco', 'Cristal'], resistedBy: ['Espina', 'Hielo'] },
  Eco: { weakAgainst: ['Cristal', 'Roca'], resistedBy: ['Tierra', 'Bruma'] },
  Hielo: { weakAgainst: ['Tierra', 'Espina'], resistedBy: ['Hielo', 'Cristal'] }
};

// Arreglo de objetos literales: define las habilidades, sus costes, desbloqueos y potencia.
const skills = [
  { id: 'flash', name: 'Destello', element: 'Luz', cost: 0, unlockLevel: 1, power: 1.0, description: 'Un rayo de luz directo y preciso.' },
  { id: 'luminous-root', name: 'Raíz luminosa', element: 'Tierra', cost: 2, unlockLevel: 2, power: 1.2, description: 'Una raíz de luz surge bajo la criatura.' },
  { id: 'bright-echo', name: 'Eco brillante', element: 'Eco', cost: 2, unlockLevel: 3, power: 1.2, description: 'Una onda resonante golpea al enemigo.', inflicts: { status: 'aturdido', chance: 0.3 } },
  { id: 'aurora', name: 'Aurora', element: 'Luz', cost: 3, unlockLevel: 4, power: 1.8, description: 'Una descarga luminosa de gran potencia.' }
];

// Objeto literal: reglas de los estados alterados y duración medida en rondas de combate.
const statusEffects = {
  veneno: { id: 'veneno', name: 'Veneno', icon: '☠', duration: 3, rule: 'Quita 2 PV al final de cada ronda.' },
  congelado: { id: 'congelado', name: 'Congelado', icon: '❄', duration: 2, rule: 'Reduce el daño causado en un 25%.' },
  aturdido: { id: 'aturdido', name: 'Aturdido', icon: '✴', duration: 1, rule: 'Hace perder la próxima acción.' }
};

// Estructuras de control: la debilidad del enemigo prevalece sobre cualquier resistencia.
function getElementEffect(attackElement, enemy) {
  const matchup = elementChart[attackElement];
  const enemyResists = Array.isArray(enemy.resist) ? enemy.resist : enemy.resist ? [enemy.resist] : [];
  if (enemy.weakness === attackElement) {
    return { multiplier: 1.5, message: '¡Es muy eficaz!' };
  } else if (enemyResists.includes(attackElement)) {
    return { multiplier: 0.5, message: 'No es muy eficaz...' };
  } else if (matchup.weakAgainst.includes(enemy.element)) {
    return { multiplier: 1.5, message: '¡Es muy eficaz!' };
  } else if (matchup.resistedBy.includes(enemy.element)) {
    return { multiplier: 0.5, message: 'No es muy eficaz...' };
  }
  return { multiplier: 1, message: '' };
}

// Función declarada que crea una casilla (objeto literal con valores por defecto)
function makeTile(type = 'floor', extra = {}) {
  return { type, visited: false, revealed: false, seen: false, ...extra };
}

// Construye la matriz 2D game.tiles con bucles anidados y la llena con los arreglos del capítulo
function buildWorld() {
  game.tiles = [];
  const chapter = chapters[game.chapterIndex];
  for (let y = 0; y < mapSize.height; y += 1) {
    const row = [];
    for (let x = 0; x < mapSize.width; x += 1) {
      const isBorder = x === 0 || y === 0 || x === mapSize.width - 1 || y === mapSize.height - 1;
      row.push(makeTile(isBorder ? 'wall' : 'floor'));
    }
    game.tiles.push(row);
  }

  // Arreglo de objetos creado con funciones flecha (map) a partir de los arreglos del capítulo.
  // REGLA C: chapter.traps coloca la casilla trampa dentro del arreglo lógico.
  const features = [
    ...chapter.walls.map(([x, y]) => ({ x, y, type: 'wall' })),
    ...chapter.breakables.map(([x, y]) => ({ x, y, type: 'breakable', breakable: true })),
    ...chapter.grass.map(([x, y]) => ({ x, y, type: 'grass' })),
    ...(chapter.swamps || []).map(([x, y]) => ({ x, y, type: 'swamp' })),
    ...(chapter.waters || []).map(([x, y]) => ({ x, y, type: 'water' })),
    ...(chapter.ice || []).map(([x, y]) => ({ x, y, type: 'ice' })),
    ...(chapter.chests || []).map(([x, y]) => ({ x, y, type: 'chest' })),
    ...(chapter.doors || []).map(([x, y]) => ({ x, y, type: 'door' })),
    ...(chapter.keys || []).map(([x, y]) => ({ x, y, type: 'key' })),
    { x: chapter.npc.x, y: chapter.npc.y, type: 'npc' },
    ...chapter.relics.map(([x, y]) => ({ x, y, type: 'relic' })),
    ...chapter.herbs.map(([x, y]) => ({ x, y, type: 'herb' })),
    ...chapter.traps.map(([x, y]) => ({ x, y, type: 'trap' })),
    ...chapter.creatures.map(([x, y, enemy]) => ({ x, y, type: 'creature', enemy })),
    ...chapter.signs.map(([x, y]) => ({ x, y, type: 'sign' })),
    { x: chapter.bossAt[0], y: chapter.bossAt[1], type: 'boss', enemy: chapter.boss }
  ];

  features.forEach(feature => {
    game.tiles[feature.y][feature.x] = makeTile(feature.type, { enemy: feature.enemy || null, breakable: feature.breakable || false });
  });
  game.tiles[1][1].visited = true;
  updateVision();
}

// VARIABLES Y ARREGLOS: la visión usa distancia de Chebyshev; lo visto permanece recordado.
function updateVision(radius = 2) {
  game.tiles.forEach((row, y) => row.forEach((tile, x) => {
    const distance = Math.max(Math.abs(player.x - x), Math.abs(player.y - y));
    if (distance <= radius) tile.seen = true;
  }));
}

// Objeto literal que asocia cada tipo de casilla con su apariencia
const tilePresentation = {
  wall: { glyph: '♣', className: 'is-wall', label: 'árbol' },
  breakable: { glyph: '', className: 'is-breakable', label: 'tronco caído' },
  floor: { glyph: '', className: 'is-path', label: 'sendero' },
  grass: { glyph: '·', className: 'is-grass', label: 'hierba' },
  swamp: { glyph: '', className: 'is-swamp', label: 'pantano' },
  water: { glyph: '', className: 'is-water', label: 'agua profunda' },
  ice: { glyph: '', className: 'is-ice', label: 'hielo' },
  chest: { glyph: '', className: 'is-chest', label: 'cofre cerrado' },
  chestOpen: { glyph: '', className: 'is-chest-open', label: 'cofre abierto' },
  door: { glyph: '', className: 'is-door', label: 'puerta cerrada' },
  key: { glyph: '', className: 'is-key', label: 'llave' },
  relic: { glyph: '', className: 'is-relic', label: 'fragmento' },
  herb: { glyph: '✚', className: 'is-herb', label: 'hierba curativa' },
  trap: { glyph: '', className: 'is-path', label: 'sendero' },
  spentTrap: { glyph: '!', className: 'is-discovered-trap', label: 'trampa activada' },
  creature: { glyph: '♟', className: 'is-creature', label: 'criatura' },
  boss: { glyph: '◈', className: 'is-boss', label: 'guardián del capítulo' },
  sign: { glyph: '?', className: 'is-exit', label: 'inscripción antigua' },
  npc: { glyph: '', className: 'is-npc', label: 'personaje' }
};

// DOM: dibuja el mapa a partir de game.tiles (el estado manda, el DOM solo lo refleja)
function renderWorld() {
  const fragment = document.createDocumentFragment();
  const chapter = chapters[game.chapterIndex];
  function makeCharacterSprite(sprite, colors = null) {
    const figure = document.createElement('span');
    figure.className = `map-character character-sprite sprite-${sprite}`;
    if (colors) {
      figure.style.setProperty('--npc-primary', colors[0]);
      figure.style.setProperty('--npc-accent', colors[1]);
    }
    figure.setAttribute('aria-hidden', 'true');
    figure.append(document.createElement('i'), document.createElement('b'), document.createElement('em'));
    return figure;
  }

  game.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      const cell = document.createElement('div');
      const isPlayer = player.x === x && player.y === y;
      const isVisible = Math.max(Math.abs(player.x - x), Math.abs(player.y - y)) <= 2;
      if (!tile.seen && !isPlayer) {
        cell.className = 'map-cell is-fog';
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', 'zona desconocida');
        fragment.append(cell);
        return;
      }
      const isRemembered = !isVisible && !isPlayer;
      const visualType = isRemembered && (tile.type === 'creature' || tile.type === 'boss') ? 'floor' : tile.type;
      const presentation = tilePresentation[visualType];
      cell.className = `map-cell ${presentation.className}`;
      if (isRemembered) cell.classList.add('is-remembered');
      if (tile.visited) cell.classList.add('is-visited');
      if (isPlayer) {
        cell.classList.add('is-player');
        cell.append(makeCharacterSprite('luma'));
      } else if (visualType === 'wall') {
        const tree = document.createElement('span');
        tree.className = 'map-tree';
        tree.setAttribute('aria-hidden', 'true');
        cell.append(tree);
      } else if (visualType === 'breakable') {
        const trunk = document.createElement('span');
        trunk.className = 'map-object-breakable';
        trunk.setAttribute('aria-hidden', 'true');
        trunk.append(document.createElement('i'), document.createElement('b'));
        cell.append(trunk);
      } else if (visualType === 'npc') {
        cell.append(makeCharacterSprite(chapter.npc.sprite, chapter.npc.colors));
      } else if (visualType === 'creature' || visualType === 'boss') {
        const enemyId = visualType === 'boss' ? chapter.boss : tile.enemy;
        cell.append(makeCharacterSprite(enemyTypes[enemyId].sprite));
      } else if (visualType === 'chest' || visualType === 'chestOpen' || visualType === 'door' || visualType === 'key') {
        const object = document.createElement('span');
        object.className = `map-object map-object-${visualType}`;
        object.setAttribute('aria-hidden', 'true');
        if (visualType === 'chest' || visualType === 'chestOpen') object.append(document.createElement('i'), document.createElement('b'));
        else if (visualType === 'door') object.append(document.createElement('i'), document.createElement('b'));
        else object.append(document.createElement('i'));
        cell.append(object);
      } else if (visualType === 'relic' || visualType === 'herb' || visualType === 'spentTrap' || visualType === 'sign') {
        const object = document.createElement('span');
        object.className = `map-object map-object-${visualType}`;
        object.textContent = visualType === 'relic' ? chapter.resourceGlyph : (visualType === 'herb' ? '✚' : (visualType === 'spentTrap' ? '!' : '?'));
        object.setAttribute('aria-hidden', 'true');
        cell.append(object);
      } else if (tile.type === 'trap' && tile.revealed) {
        // La trampa solo se ve si el farol la reveló
        cell.classList.add('is-trap-revealed');
        const trap = document.createElement('span');
        trap.className = 'map-object map-object-trap';
        trap.textContent = '!';
        trap.setAttribute('aria-hidden', 'true');
        cell.append(trap);
      }
      cell.setAttribute('role', 'gridcell');
      const label = isPlayer ? 'Luma' : visualType === 'npc' ? chapter.npc.name : visualType === 'relic' ? chapter.resource : (tile.type === 'trap' && tile.revealed ? 'trampa oculta' : presentation.label);
      cell.setAttribute('aria-label', isPlayer ? `Luma y tú, ${label}` : label);
      fragment.append(cell);
    });
  });
  ui.grid.replaceChildren(fragment);
  updateToolAvailability();
}

// DOM: refresca los marcadores del panel lateral con los valores de `player`
function updatePlayerPanel() {
  const chapter = chapters[game.chapterIndex];
  const stats = getPlayerStats();
  const hpPercent = Math.max(0, (player.hp / stats.maxHp) * 100);
  const focusPercent = Math.max(0, (player.focus / stats.maxFocus) * 100);
  const xpPercent = Math.min(100, (player.xp / 3) * 100);
  ui.hpLabel.textContent = `${player.hp} / ${stats.maxHp}`;
  ui.hpBar.style.width = `${hpPercent}%`;
  ui.focusLabel.textContent = `${player.focus} / ${stats.maxFocus}`;
  ui.focusBar.style.width = `${focusPercent}%`;
  ui.battleFocusLabel.textContent = `FOCO ${player.focus} / ${getPlayerStats().maxFocus}`;
  ui.battleFocusBar.style.width = `${focusPercent}%`;
  ui.xpLabel.textContent = `${player.xp} / 3`;
  ui.xpBar.style.width = `${xpPercent}%`;
  ui.level.textContent = `NIVEL ${String(player.level).padStart(2, '0')}`;
  ui.crystalCount.textContent = `${player.fragments} / 3`;
  ui.inventoryCrystals.textContent = String(player.fragments);
  document.querySelector('#inventory-resource-symbol').firstChild.textContent = `${chapter.resourceGlyph} `;
  ui.inventoryPotions.textContent = String(player.potions);
  ui.inventoryHerbs.textContent = String(player.herbs);
  ui.keyLabel.textContent = String(player.keys);
  ui.gearSummary.textContent = `ATQ +${stats.attack} · DEF ${stats.defense}`;
  updateQuestPanel();
  ui.crystalTrack.querySelectorAll('i').forEach((fragment, index) => {
    fragment.classList.toggle('is-filled', index < player.fragments);
  });
}

function makeFeatureCharacter(sprite) {
  const character = document.createElement('span');
  character.className = `character-sprite sprite-${sprite}`;
  character.setAttribute('aria-hidden', 'true');
  character.append(document.createElement('i'), document.createElement('b'), document.createElement('em'));
  return character;
}

function updateBestiaryCount() {
  const count = document.querySelector('#bestiary-count');
  if (count) count.textContent = `${game.discoveredCreatures.length} / ${Object.keys(enemyTypes).length}`;
}

// DOM: dibuja la guía de criaturas usando el arreglo game.discoveredCreatures
function renderBestiary() {
  if (!ui.bestiaryGrid) return;
  const fragment = document.createDocumentFragment();
  Object.entries(enemyTypes).forEach(([id, creature]) => {
    const known = game.discoveredCreatures.includes(id);
    const entry = document.createElement('article');
    entry.className = `bestiary-entry${creature.isBoss ? ' is-boss' : ''}${known ? '' : ' is-unknown'}`;
    const sprite = document.createElement('div');
    sprite.className = 'bestiary-character';
    sprite.append(makeFeatureCharacter(creature.sprite));
    const name = document.createElement('h3');
    name.textContent = known ? creature.name : 'Criatura desconocida';
    const element = document.createElement('span');
    element.className = 'bestiary-element';
    element.textContent = known ? `${creature.element} · DÉBIL A ${creature.weakness}` : 'SIN REGISTRAR';
    const lore = document.createElement('p');
    lore.textContent = known ? creature.lore : 'Encuéntrala en el valle para descubrir su historia.';
    const habitat = document.createElement('div');
    habitat.className = 'bestiary-stats';
    habitat.textContent = known ? `${creature.habitat} · ${creature.maxHp} PV · ${creature.minDamage}–${creature.maxDamage} DAÑO` : creature.isBoss ? 'GUARDIÁN' : 'CRIATURA DEL VALLE';
    entry.append(sprite, name, element, lore, habitat);
    fragment.append(entry);
  });
  ui.bestiaryGrid.replaceChildren(fragment);
  updateBestiaryCount();
}

// DOM: dibuja la pestaña activa de la mochila (objeto literal de arreglos de objetos)
function renderInventoryTab() {
  if (!ui.inventoryList) return;
  const chapter = chapters[game.chapterIndex];
  if (game.inventoryTab === 'gear') { renderGearTab(); return; }
  const entries = {
    materials: [
      { icon: chapter.resourceGlyph, name: chapter.resourcePlural, quantity: player.fragments, description: `Fragmentos reunidos en ${chapter.name}. Abren el camino al guardián.` },
      { icon: '❋', name: 'Hierbas curativas', quantity: player.herbs, description: 'Plantas del camino que se convierten en pociones de luz.' },
      { icon: '⚿', name: 'Llaves', quantity: player.keys, description: 'Abren puertas opcionales hacia pequeñas alcobas.' }
    ],
    items: [
      { icon: '✚', name: 'Poción de luz', quantity: player.potions, description: 'Recupera hasta 8 puntos de energía y limpia el veneno.', action: 'potion', disabled: player.potions <= 0 || game.completed || (player.hp >= getPlayerStats().maxHp && !hasStatus(player, 'veneno')) }
    ],
    tools: [
      { icon: '⌁', name: 'Pico de explorador', quantity: 'EQUIPADO', description: 'Rompe un tronco caído y abre un paso bloqueado.', action: 'pickaxe', disabled: !canUsePickaxe() },
      { icon: '◉', name: 'Farol de luciérnaga', quantity: 'EQUIPADO', description: 'Revela trampas ocultas hasta cuatro pasos alrededor de Luma.', action: 'lantern', disabled: !canUseLantern() }
    ],
    skills: skills.filter(skill => skill.unlockLevel <= player.level).map(skill => ({
      icon: '✧', name: skill.name, quantity: `${skill.element} · ${skill.cost === 0 ? 'sin coste' : `${skill.cost} de foco`}`,
      description: `${skill.description} Potencia ×${skill.power}.`
    }))
  };
  const fragment = document.createDocumentFragment();
  entries[game.inventoryTab].forEach(entry => {
    const card = document.createElement('article');
    card.className = `feature-entry${entry.quantity === 0 ? ' is-empty' : ''}`;
    const icon = document.createElement('span');
    icon.className = 'feature-entry-icon';
    icon.textContent = entry.icon;
    const copy = document.createElement('div');
    copy.className = 'feature-entry-copy';
    const name = document.createElement('h3');
    name.textContent = entry.name;
    const description = document.createElement('p');
    description.textContent = entry.description;
    copy.append(name, description);
    const quantity = document.createElement('b');
    quantity.className = 'feature-quantity';
    quantity.textContent = typeof entry.quantity === 'number' ? `× ${entry.quantity}` : entry.quantity;
    card.append(icon, copy, quantity);
    if (entry.action) {
      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'feature-action';
      action.textContent = entry.action === 'potion' ? 'USAR' : entry.action === 'pickaxe' ? 'USAR PICO' : 'ENCENDER';
      action.dataset.featureAction = entry.action;
      action.disabled = entry.disabled;
      card.append(action);
    }
    fragment.append(card);
  });
  ui.inventoryList.replaceChildren(fragment);
  document.querySelectorAll('[data-bag-tab]').forEach(tab => {
    const selected = tab.dataset.bagTab === game.inventoryTab;
    tab.classList.toggle('is-selected', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
}

// DOM y arreglos: construye el menú de habilidades desde skills y el estado actual de Luma.
function renderSkillMenu() {
  const fragment = document.createDocumentFragment();
  const list = document.createElement('div');
  list.className = 'skill-options';
  skills.forEach(skill => {
    const unlocked = player.level >= skill.unlockLevel;
    const lacksFocus = player.focus < skill.cost;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `skill-option${unlocked ? '' : ' is-locked'}`;
    button.disabled = !unlocked || lacksFocus;
    const name = document.createElement('b');
    name.textContent = skill.name;
    const details = document.createElement('small');
    details.textContent = !unlocked ? `BLOQUEADA · NIVEL ${skill.unlockLevel}` : `${skill.element} · ${skill.cost === 0 ? 'SIN COSTE' : `${skill.cost} DE FOCO${lacksFocus ? ' · INSUFICIENTE' : ''}`} · ×${skill.power}`;
    const description = document.createElement('span');
    description.textContent = skill.description;
    button.append(name, details, description);
    button.addEventListener('click', () => performBattleAction('skill', skill.id));
    list.append(button);
  });
  const heading = document.createElement('div');
  heading.className = 'skill-menu-heading';
  const focus = document.createElement('span');
  focus.textContent = `FOCO ${player.focus} / ${getPlayerStats().maxFocus}`;
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'skill-back';
  back.textContent = '← Volver';
  back.addEventListener('click', closeSkillMenu);
  heading.append(focus, back);
  fragment.append(heading, list);
  ui.skillMenu.replaceChildren(fragment);
}

function openSkillMenu() {
  if (!game.inBattle) return;
  renderSkillMenu();
  ui.battleActions.hidden = true;
  ui.skillMenu.hidden = false;
}

function closeSkillMenu() {
  ui.skillMenu.hidden = true;
  ui.battleActions.hidden = false;
}


// DOM: renderiza ranuras, bonos y objetos de equipo mediante nodos creados en JavaScript.
function renderGearTab() {
  const fragment = document.createDocumentFragment();
  const stats = getPlayerStats();
  const slots = [
    { id: 'weapon', name: 'ARMA' },
    { id: 'charm', name: 'AMULETO' }
  ];
  slots.forEach(slot => {
    const line = document.createElement('p');
    line.className = 'gear-equipped-line';
    const item = gearCatalog.find(gear => gear.id === player.equipment[slot.id]);
    line.textContent = `${slot.name}: ${item ? item.name : 'Sin equipar'}`;
    fragment.append(line);
  });
  const summary = document.createElement('p');
  summary.className = 'gear-bonus-summary';
  const elements = Object.entries(stats.elementBonus).map(([element, bonus]) => `${element} +${Math.round(bonus * 100)}%`);
  summary.textContent = `ATQ +${stats.attack} · DEF ${stats.defense} · PV máx. ${stats.maxHp} · FOCO máx. ${stats.maxFocus}${elements.length ? ` · ${elements.join(' · ')}` : ''}`;
  fragment.append(summary);
  player.gear.forEach(gearId => {
    const item = gearCatalog.find(gear => gear.id === gearId);
    if (!item) return;
    const card = document.createElement('article');
    card.className = 'feature-entry';
    const icon = document.createElement('span');
    icon.className = 'feature-entry-icon';
    icon.textContent = item.slot === 'weapon' ? '⚔' : '◈';
    const copy = document.createElement('div');
    copy.className = 'feature-entry-copy';
    const name = document.createElement('h3');
    name.textContent = item.name;
    const description = document.createElement('p');
    description.textContent = `${item.description} ${formatGearStats(item.stats)}`;
    copy.append(name, description);
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'feature-action';
    const equipped = player.equipment[item.slot] === gearId;
    action.textContent = equipped ? 'QUITAR' : 'EQUIPAR';
    action.dataset.gearAction = equipped ? 'unequip' : 'equip';
    action.dataset.gearId = gearId;
    action.disabled = game.inBattle;
    card.append(icon, copy, action);
    fragment.append(card);
  });
  if (!player.gear.length) {
    const empty = document.createElement('p');
    empty.className = 'feature-hint';
    empty.textContent = 'Aún no has encontrado equipo. Busca cofres o vence guardianes.';
    fragment.append(empty);
  }
  ui.inventoryList.replaceChildren(fragment);
}

function formatGearStats(stats) {
  const labels = [];
  if (stats.attack) labels.push(`ATQ +${stats.attack}`);
  if (stats.defense) labels.push(`DEF +${stats.defense}`);
  if (stats.maxHp) labels.push(`PV máx. +${stats.maxHp}`);
  if (stats.maxFocus) labels.push(`FOCO máx. +${stats.maxFocus}`);
  if (stats.elementBonus) Object.entries(stats.elementBonus).forEach(([element, bonus]) => labels.push(`${element} +${Math.round(bonus * 100)}%`));
  return labels.join(' · ');
}


// Actualiza estados de misión solo desde el modelo de JavaScript.
function updateQuestPanel() {
  if (!ui.sideQuestLine) return;
  const npc = chapters[game.chapterIndex].npc;
  const quest = npc.quest;
  const state = game.quests[quest.id] || 'available';
  let progress = '';
  if (quest.requirement.type === 'herbs') progress = `${Math.min(player.herbs, quest.requirement.amount)} / ${quest.requirement.amount} hierbas`;
  else if (quest.requirement.type === 'enemy') progress = `${Math.min(game.defeatedCreatures[quest.requirement.enemyId] || 0, quest.requirement.amount)} / ${quest.requirement.amount} criaturas`;
  else progress = `${game.questFlags[quest.id] ? 1 : 0} / 1 cofre`;
  const text = state === 'available' ? `Extra · Habla con ${npc.name}.`
    : state === 'active' ? `${quest.title} · ${progress}.`
      : state === 'ready' ? `${quest.title} · Lista para entregar.`
        : `Misión completada · ${quest.title}.`;
  ui.sideQuestLine.textContent = text;
}

function refreshQuestState() {
  const quest = chapters[game.chapterIndex].npc.quest;
  if (game.quests[quest.id] !== 'active') { updateQuestPanel(); return; }
  let ready = false;
  if (quest.requirement.type === 'herbs') ready = player.herbs >= quest.requirement.amount;
  else if (quest.requirement.type === 'enemy') ready = (game.defeatedCreatures[quest.requirement.enemyId] || 0) >= quest.requirement.amount;
  else if (quest.requirement.type === 'chest') ready = Boolean(game.questFlags[quest.id]);
  if (ready) game.quests[quest.id] = 'ready';
  updateQuestPanel();
}

function renderDialogue() {
  const npc = chapters[game.chapterIndex].npc;
  const quest = npc.quest;
  const state = game.quests[quest.id] || 'available';
  const lines = npc.dialogues[state];
  const lineIndex = Math.min(game.dialogueLine, lines.length - 1);
  ui.dialogueTitle.textContent = npc.name;
  ui.dialogueText.textContent = lines[lineIndex];
  ui.dialogueQuest.textContent = `${quest.title} · ${quest.description}`;
  ui.dialogueActions.replaceChildren();
  const addButton = (label, handler, className = '') => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `dialogue-button ${className}`.trim();
    button.textContent = label;
    button.addEventListener('click', handler);
    ui.dialogueActions.append(button);
  };
  if (lineIndex < lines.length - 1) addButton('Siguiente', () => { game.dialogueLine += 1; renderDialogue(); });
  if (state === 'available') addButton('Aceptar misión', () => {
    game.quests[quest.id] = 'active';
    game.dialogueLine = 0;
    refreshQuestState();
    renderDialogue();
  }, 'is-primary');
  if (state === 'ready') addButton('Entregar', () => completeSideQuest(), 'is-primary');
  addButton('Cerrar', closeModal);
}

function openNpcDialogue() {
  if (game.skipNextTurn) { resolveSkippedTurn(); return; }
  game.dialogueLine = 0;
  openModal('dialogue', document.activeElement);
}

function completeSideQuest() {
  const quest = chapters[game.chapterIndex].npc.quest;
  if (game.quests[quest.id] !== 'ready') return;
  let rewardMessage = '';
  if (quest.reward.type === 'gear') {
    player.herbs -= quest.requirement.amount;
    const reward = grantGear(quest.reward.id);
    if (reward) rewardMessage = `Recibiste ${reward.name}.`;
    else { player.potions += quest.reward.duplicatePotions; rewardMessage = `Ya tenías ese equipo; recibiste ${quest.reward.duplicatePotions} pociones de luz.`; }
  } else if (quest.reward.type === 'maxFocus') {
    player.maxFocusBonus += quest.reward.amount;
    rewardMessage = `Tu foco máximo aumentó en ${quest.reward.amount}.`;
  } else if (quest.reward.type === 'revealTrap') {
    game.tiles.flat().forEach(tile => {
      if (tile.type === 'trap') { tile.revealed = true; tile.seen = true; }
    });
    player.potions += quest.reward.potions;
    rewardMessage = `La posición de la trampa quedó revelada y recibiste ${quest.reward.potions} poción de luz.`;
  }
  game.quests[quest.id] = 'done';
  game.dialogueLine = 0;
  updatePlayerPanel();
  updateQuestPanel();
  renderWorld();
  renderDialogue();
  ui.dialogueQuest.textContent = rewardMessage;
}

function openModal(name, opener = null) {
  if (game.activeModal) closeModal();
  game.activeModal = name;
  game.modalOpener = opener;
  document.body.classList.add('feature-open');
  const modal = { inventory: ui.inventoryModal, bestiary: ui.bestiaryModal, dialogue: ui.dialogueModal }[name];
  modal.hidden = false;
  if (name === 'inventory') renderInventoryTab();
  else if (name === 'bestiary') renderBestiary();
  else renderDialogue();
  modal.querySelector('[role="dialog"]').focus();
}

function closeModal() {
  if (!game.activeModal) return;
  const modal = { inventory: ui.inventoryModal, bestiary: ui.bestiaryModal, dialogue: ui.dialogueModal }[game.activeModal];
  modal.hidden = true;
  game.activeModal = null;
  document.body.classList.remove('feature-open');
  if (game.modalOpener?.isConnected) game.modalOpener.focus();
  game.modalOpener = null;
}

function setWorldMessage(message, journalMessage = message) {
  ui.worldMessage.textContent = message;
  ui.journal.textContent = journalMessage;
}

function consumeTurn() {
  game.turn += 1;
  ui.turnCount.textContent = `TURNO ${String(game.turn).padStart(2, '0')}`;
}

// REGLA C: resuelve el turno congelado por la trampa y quita la alerta roja (clase body-alert)
function resolveSkippedTurn() {
  consumeTurn();
  game.skipNextTurn = false;
  game.alertActive = false;
  document.body.classList.remove('body-alert');
  ui.worldCard.classList.remove('is-alert');
  ui.trapAlert.hidden = true;
  renderWorld();
  setWorldMessage('La trampa congeló este turno. Ya puedes seguir explorando.', 'Una trampa antigua detuvo el paso de Luma. El sendero vuelve a estar despejado.');
}

function adjacentBreakableTile() {
  const nearby = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  for (const [dx, dy] of nearby) {
    const tile = game.tiles[player.y + dy]?.[player.x + dx];
    if (tile?.type === 'breakable') return tile;
  }
  return null;
}

function nearbyHiddenTrap() {
  return game.tiles.flat().some((tile, index) => {
    if (tile.type !== 'trap' || tile.revealed) return false;
    const x = index % mapSize.width;
    const y = Math.floor(index / mapSize.width);
    return Math.abs(player.x - x) + Math.abs(player.y - y) <= 4;
  });
}

function canUsePickaxe() {
  return !game.inBattle && !game.completed && !game.skipNextTurn && Boolean(adjacentBreakableTile());
}

function canUseLantern() {
  return !game.inBattle && !game.completed && !game.skipNextTurn && nearbyHiddenTrap();
}

function updateToolAvailability() {
  if (game.activeModal === 'inventory' && game.inventoryTab === 'tools') renderInventoryTab();
}

function activatePickaxe() {
  if (game.inBattle || game.completed) return;
  // REGLA C: si el turno está congelado, esta acción lo consume
  if (game.skipNextTurn) { resolveSkippedTurn(); return; }
  const tile = adjacentBreakableTile();
  if (!tile) {
    setWorldMessage('Acércate a un tronco caído para despejar el paso.', 'El pico solo puede romper los troncos que bloquean el sendero.');
    return;
  }
  consumeTurn();
  tile.type = 'floor';
  tile.breakable = false;
  tile.visited = true;
  updateVision();
  renderWorld();
  setWorldMessage('¡Camino despejado! El pico abrió un atajo.', 'Luma apartó un árbol con el pico y abrió un nuevo paso.');
}

function activateLantern() {
  if (game.inBattle || game.completed) return;
  // REGLA C: si el turno está congelado, esta acción lo consume
  if (game.skipNextTurn) { resolveSkippedTurn(); return; }
  const traps = [];
  game.tiles.forEach((row, y) => row.forEach((tile, x) => {
    if (tile.type === 'trap' && !tile.revealed && Math.abs(player.x - x) + Math.abs(player.y - y) <= 4) traps.push(tile);
  }));
  if (traps.length === 0) {
    setWorldMessage('No hay trampas ocultas cerca para revelar.', 'El farol ilumina el sendero, pero no descubre peligros cercanos.');
    return;
  }
  consumeTurn();
  traps.forEach(tile => { tile.revealed = true; });
  updateVision(4);
  renderWorld();
  setWorldMessage('El farol revela una trampa cercana. Ahora puedes rodearla.', 'La luz azul del farol descubrió una marca peligrosa bajo la hierba.');
}

function usePotionFromInventory() {
  if (game.inBattle) {
    if ((player.hp >= getPlayerStats().maxHp && !hasStatus(player, 'veneno')) || player.potions <= 0) return;
    performBattleAction('potion');
    renderInventoryTab();
    return;
  }
  if (game.completed || player.potions <= 0 || player.hp >= getPlayerStats().maxHp) return;
  // REGLA C: si el turno está congelado, esta acción lo consume
  if (game.skipNextTurn) { resolveSkippedTurn(); return; }
  consumeTurn();
  player.potions -= 1;
  const healed = Math.min(8, getPlayerStats().maxHp - player.hp);
  player.hp += healed;
  if (healed > 0) playCssEffect(ui.companionPortrait, 'is-healing');
  updatePlayerPanel();
  setWorldMessage(`Luma usó una poción y recuperó ${healed} PV.`, 'Una poción brillante ayudó a Luma a recuperar energía.');
  renderInventoryTab();
}

// Compara coordenadas de datos para detectar el cofre marcado por la misión.
function questAtChest(quest, x, y) {
  return quest.requirement.type === 'chest' && quest.requirement.x === x && quest.requirement.y === y;
}

// Resuelve el efecto del terreno, objeto o encuentro al que llega Luma.
function resolveTile(tile, x, y, origin, slid = false) {
  const chapter = chapters[game.chapterIndex];
  tile.visited = true;
  if (tile.type === 'relic') {
    player.fragments += 1;
    tile.type = 'floor';
    updatePlayerPanel();
    const message = player.fragments >= 3 ? `¡Reuniste los tres ${chapter.resourcePlural}! ${enemyTypes[chapter.boss].name} te espera.` : `¡Encontraste un ${chapter.resource.toLowerCase()}! Llevas ${player.fragments} de 3.`;
    setWorldMessage(message, `Un ${chapter.resource.toLowerCase()} luminoso vibra en la mochila de Luma.`);
  } else if (tile.type === 'herb') {
    player.herbs += 1;
    player.potions += 1;
    tile.type = 'floor';
    refreshQuestState();
    updatePlayerPanel();
    setWorldMessage('Encontraste una hierba curativa. Luma la guardó como una poción.', 'Una planta de luz crecía entre las raíces.');
  } else if (tile.type === 'key') {
    player.keys += 1;
    tile.type = 'floor';
    updatePlayerPanel();
    setWorldMessage('¡Encontraste una llave! Luma la guardó en la mochila.', 'Luma recogió una llave brillante. Puede abrir una puerta cerrada.');
  } else if (tile.type === 'door') {
    player.keys -= 1;
    tile.type = 'floor';
    updatePlayerPanel();
    setWorldMessage('La llave giró en la cerradura. La puerta quedó abierta.', 'Luma gastó una llave para abrir la puerta de la alcoba.');
  } else if (tile.type === 'chest') {
    const table = lootTables[chapter.biome];
    const loot = table[Math.floor(Math.random() * table.length)];
    tile.type = 'chestOpen';
    if (questAtChest(chapter.npc.quest, x, y)) game.questFlags[chapter.npc.quest.id] = true;
    refreshQuestState();
    let lootDescription = '';
    if (loot.type === 'gear') {
      const item = grantGear(loot.id);
      if (item) lootDescription = `equipo nuevo: ${item.name}`;
      else { player.potions += 1; lootDescription = 'una poción de luz (el equipo repetido se convirtió en poción)'; }
    } else if (loot.type === 'potion') {
      player.potions += loot.amount;
      lootDescription = `${loot.amount} ${loot.amount === 1 ? 'poción de luz' : 'pociones de luz'}`;
    } else {
      player.herbs += loot.amount;
      player.potions += loot.amount;
      lootDescription = `${loot.amount} ${loot.amount === 1 ? 'hierba curativa' : 'hierbas curativas'}`;
    }
    updatePlayerPanel();
    refreshQuestState();
    setWorldMessage(`¡Cofre abierto! Luma obtuvo ${lootDescription}.`, `En un cofre, Luma encontró ${lootDescription}.`);
  } else if (tile.type === 'swamp') {
    player.hp = Math.max(1, player.hp - 1);
    updatePlayerPanel();
    setWorldMessage('El pantano se hunde bajo los pies de Luma. Pierde 1 PV.', 'El terreno lodoso le quitó un punto de energía a Luma.');
  } else if (tile.type === 'trap') {
    // REGLA C: caer en la trampa al deslizarse conserva el turno congelado y el aviso rojo.
    tile.type = 'spentTrap';
    game.skipNextTurn = true;
    game.alertActive = true;
    document.body.classList.add('body-alert');
    ui.worldCard.classList.add('is-alert');
    ui.trapAlert.hidden = false;
    setWorldMessage('¡Trampa! No consigues puntos y pierdes tu próximo turno.', 'La trampa del bosque se activó. Luma quedó inmóvil por un turno.');
  } else if (tile.type === 'creature') {
    startBattle(tile.enemy, x, y, origin);
  } else if (tile.type === 'boss') {
    startBattle(chapter.boss, x, y, origin);
  } else if (tile.type === 'sign') {
    tile.type = 'floor';
    setWorldMessage('La inscripción dice: «Tres luces abren el camino de regreso».', 'Luma descifró una inscripción cubierta de musgo.');
  } else {
    setWorldMessage(slid ? 'Luma se deslizó sobre el hielo hasta recuperar el equilibrio.' : 'El bosque guarda silencio. El sendero continúa.', slid ? 'El impulso del hielo llevó a Luma hasta terreno firme.' : 'Luma avanzó entre la hierba húmeda.');
  }
}

// Arreglos y condicionales: sobre hielo se avanza una sola vez, sin consumir turnos intermedios.
function slideOnIce(x, y, dx, dy) {
  let destination = { x, y };
  while (game.tiles[destination.y][destination.x].type === 'ice') {
    const nextX = destination.x + dx;
    const nextY = destination.y + dy;
    const next = game.tiles[nextY]?.[nextX];
    if (!next || ['wall', 'water', 'breakable', 'npc'].includes(next.type)) break;
    if (next.type === 'boss' && player.fragments < 3) break;
    if (next.type === 'door' && player.keys < 1) break;
    destination = { x: nextX, y: nextY };
    if (['creature', 'boss', 'trap', 'relic', 'herb', 'sign', 'key', 'door', 'chest', 'npc'].includes(next.type)) break;
    if (next.type !== 'ice') break;
  }
  return destination;
}

// Movimiento: valida el paso, desliza si corresponde y resuelve una sola casilla final.
function movePlayer(direction) {
  if (game.inBattle || game.completed) return;
  // REGLA C: el turno congelado se gasta aquí en vez de mover a Luma
  if (game.skipNextTurn) {
    resolveSkippedTurn();
    return;
  }

  const movement = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
  if (!movement) return;
  const [dx, dy] = movement;
  const x = player.x + dx;
  const y = player.y + dy;
  const tile = game.tiles[y]?.[x];
  if (!tile || (tile.type === 'wall' && !tile.breakable) || tile.type === 'water') {
    setWorldMessage(tile?.type === 'water' ? 'El agua es demasiado profunda.' : 'Los árboles son demasiado densos por aquí. Busca otro camino.', tile?.type === 'water' ? 'Luma no puede cruzar el agua profunda.' : 'El bosque cierra ese paso.');
    return;
  }
  if (tile.type === 'breakable') {
    setWorldMessage('Un tronco caído bloquea el paso. Usa el pico para romperlo.', 'El sendero está bloqueado por un tronco caído.');
    return;
  }
  if (tile.type === 'npc') { openNpcDialogue(); return; }
  if (tile.type === 'door' && player.keys < 1) {
    setWorldMessage('La puerta está cerrada. Necesitas una llave.', 'Luma encontró una puerta cerrada; busca una llave por el mapa.');
    return;
  }
  const chapter = chapters[game.chapterIndex];
  if (tile.type === 'boss' && player.fragments < 3) {
    setWorldMessage(`El guardián bloquea el paso. Te faltan ${3 - player.fragments} ${chapter.resourcePlural}.`, `Una voz resuena: «Trae los tres ${chapter.resourcePlural}».`);
    return;
  }

  const origin = { x: player.x, y: player.y };
  const slid = tile.type === 'ice';
  const destination = slid ? slideOnIce(x, y, dx, dy) : { x, y };
  const stoppedAtLockedDoor = slid && game.tiles[destination.y + dy]?.[destination.x + dx]?.type === 'door' && player.keys < 1;
  player.x = destination.x;
  player.y = destination.y;
  consumeTurn();
  resolveTile(game.tiles[player.y][player.x], player.x, player.y, origin, slid);
  if (stoppedAtLockedDoor) setWorldMessage('La puerta está cerrada. Necesitas una llave.', 'Luma encontró una puerta cerrada; busca una llave por el mapa.');
  updateVision();
  renderWorld();
}

// Función flecha: número entero aleatorio entre mínimo y máximo
const randomDamage = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

// DOM y eventos: reinicia la animación de una clase con reflow, sin temporizadores.
function playCssEffect(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function showFloatingNumber(side, amount, kind = 'damage') {
  if (!ui.battleArena || amount <= 0) return;
  const number = document.createElement('span');
  number.className = `floating-number floating-number--${side} floating-number--${kind}`;
  number.textContent = `${kind === 'healing' ? '+' : '-'}${amount}`;
  number.setAttribute('aria-hidden', 'true');
  ui.battleArena.append(number);
}

function showDamageImpact(side, amount, multiplier = 1) {
  const target = side === 'enemy' ? ui.enemyCreature : ui.playerCreature;
  playCssEffect(target, 'is-hit');
  if (side === 'enemy' && multiplier > 1) playCssEffect(ui.enemySprite, 'is-effective');
  showFloatingNumber(side, amount, side === 'enemy' && multiplier > 1 ? 'effective' : 'damage');
}

function startBattle(enemyId, x, y, origin) {
  const definition = enemyTypes[enemyId];
  // La debilidad solo se revela si la criatura ya estaba registrada antes de este encuentro.
  const wasKnown = game.discoveredCreatures.includes(enemyId);
  if (!wasKnown) game.discoveredCreatures.push(enemyId);
  updateBestiaryCount();
  if (game.activeModal === 'bestiary') renderBestiary();
  game.inBattle = true;
  game.battle = { ...definition, hp: definition.maxHp, x, y, originX: origin.x, originY: origin.y, guarding: false, enemyId, statuses: [] };
  ui.exploration.hidden = true;
  ui.battleView.hidden = false;
  ui.battleActions.hidden = false;
  ui.skillMenu.hidden = true;
  ui.battleContinue.hidden = true;
  ui.trapAlert.hidden = true;
  document.querySelector('#battle-caption').textContent = definition.isBoss ? `${definition.name} protege el camino.` : `¡${definition.name} defiende su territorio!`;
  document.querySelector('#enemy-name').textContent = definition.name;
  const knownWeakness = wasKnown ? definition.weakness : '???';
  // Manipulación del DOM: muestra elemento y debilidad según el arreglo de criaturas registradas.
  ui.enemyElementLabel.textContent = `${definition.element} · Débil a ${knownWeakness}`;
  document.querySelector('#enemy-sprite').className = `character-sprite sprite-${definition.sprite}`;
  document.querySelector('#enemy-hp-label').textContent = `${game.battle.hp} / ${definition.maxHp} PV`;
  document.querySelector('#battle-message').textContent = definition.isBoss ? `${definition.name} espera tu movimiento.` : `¡${definition.name} aparece en el camino!`;
  document.querySelector('#run-button').hidden = definition.isBoss;
  renderStatusIndicators(player);
  renderStatusIndicators(game.battle);
  renderBattleBars();
  updatePlayerPanel();
}

function renderBattleBars() {
  if (!game.battle) return;
  const enemyPercent = Math.max(0, (game.battle.hp / game.battle.maxHp) * 100);
  const stats = getPlayerStats();
  const playerPercent = Math.max(0, (player.hp / stats.maxHp) * 100);
  const focusPercent = Math.max(0, (player.focus / stats.maxFocus) * 100);
  document.querySelector('#enemy-health').style.width = `${enemyPercent}%`;
  document.querySelector('#player-health').style.width = `${playerPercent}%`;
  ui.battleFocusLabel.textContent = `FOCO ${player.focus} / ${getPlayerStats().maxFocus}`;
  ui.battleFocusBar.style.width = `${focusPercent}%`;
  document.querySelector('#player-hp-label').textContent = `${player.hp} / ${stats.maxHp} PV`;
  document.querySelector('#battle-potions').textContent = `× ${player.potions}`;
  document.querySelector('[data-action="potion"]').disabled = player.potions <= 0 || (player.hp >= getPlayerStats().maxHp && !hasStatus(player, 'veneno'));
}

// DOM: muestra cada estado activo y sus turnos restantes con nodos creados desde statusEffects.
function renderStatusIndicators(target) {
  const container = target === player ? ui.playerStatuses : ui.enemyStatuses;
  const fragment = document.createDocumentFragment();
  target.statuses.forEach(status => {
    const definition = statusEffects[status.id];
    const chip = document.createElement('span');
    chip.className = `status-chip status-${status.id}`;
    chip.dataset.statusId = status.id;
    chip.title = `${definition.name}: ${definition.rule}`;
    chip.setAttribute('aria-label', `${definition.name}, ${status.turns} turnos restantes`);
    const icon = document.createElement('b');
    icon.textContent = definition.icon;
    const turns = document.createElement('small');
    turns.textContent = String(status.turns);
    chip.append(icon, turns);
    fragment.append(chip);
  });
  container.replaceChildren(fragment);
}

function hasStatus(target, statusId) {
  return target.statuses.some(status => status.id === statusId);
}

// Arreglos: aplicar o renovar un estado mantiene una sola entrada por tipo.
function applyStatus(target, statusId, messages, sourceName, targetName) {
  const definition = statusEffects[statusId];
  if (!definition) return;
  const existingIndex = target.statuses.findIndex(status => status.id === statusId);
  const wasActive = existingIndex >= 0;
  const activeStatus = { id: statusId, turns: definition.duration };
  if (wasActive) target.statuses[existingIndex] = activeStatus;
  else target.statuses.push(activeStatus);
  renderStatusIndicators(target);
  const container = target === player ? ui.playerStatuses : ui.enemyStatuses;
  playCssEffect(container.querySelector(`[data-status-id="${statusId}"]`), 'is-status-applied');
  playCssEffect(ui.battleMessage, 'is-status-applied');
  messages.push(`${sourceName} ${wasActive ? 'renueva' : 'aplica'} ${definition.name.toLowerCase()} a ${targetName} ${definition.icon} (${definition.duration} turnos).`);
}

function tryInflictStatus(source, target, messages, targetName) {
  if (!source.inflicts || Math.random() >= source.inflicts.chance) return;
  applyStatus(target, source.inflicts.status, messages, source.name, targetName);
}

// Estructuras de control: procesa veneno al cierre de la ronda y descuenta duraciones.
function resolveRoundStatuses(playerStatusesAtStart, enemyStatusesAtStart = [], messages = [], includeEnemy = true) {
  const targets = [{ target: player, name: 'Luma', statusesAtStart: playerStatusesAtStart, isPlayer: true }];
  if (game.battle && includeEnemy) targets.push({ target: game.battle, name: game.battle.name, statusesAtStart: enemyStatusesAtStart, isPlayer: false });
  targets.forEach(({ target, name, statusesAtStart, isPlayer }) => {
    [...target.statuses].forEach(status => {
      if (!target.statuses.includes(status)) return;
      const definition = statusEffects[status.id];
      if (status.id === 'veneno') {
        if (isPlayer) {
          const hpBefore = player.hp;
          player.hp = Math.max(1, player.hp - 2);
          showDamageImpact('player', hpBefore - player.hp);
          messages.push(`${definition.icon} Veneno causa 2 PV a ${name}.`);
        }
        else if (target.hp > 0) {
          const hpBefore = target.hp;
          target.hp = Math.max(0, target.hp - 2);
          showDamageImpact('enemy', hpBefore - target.hp);
          messages.push(`${definition.icon} Veneno causa 2 PV a ${name}.`);
        }
        status.turns -= 1;
      } else if (statusesAtStart.includes(status)) {
        status.turns -= 1;
      }
      if (status.turns <= 0) {
        target.statuses = target.statuses.filter(active => active !== status);
        messages.push(`${definition.name} termina en ${name}.`);
      }
    });
    renderStatusIndicators(target);
  });
  updatePlayerPanel();
  if (game.inBattle) renderBattleBars();
}

function removeStatus(target, statusId) {
  const remaining = target.statuses.filter(status => status.id !== statusId);
  const removed = remaining.length !== target.statuses.length;
  target.statuses = remaining;
  if (removed) renderStatusIndicators(target);
  return removed;
}

function showBattleMessages(messages) {
  document.querySelector('#battle-message').textContent = messages.filter(Boolean).join(' ');
}

// Suma experiencia y devuelve true si Luma subió de nivel (el estado se decide con variables,
// no leyendo texto del DOM)
// Texto de nivel: un objeto/ arreglo permite avisar qué técnica se desbloqueó.
function levelUpMessage() {
  const unlockedSkill = skills.find(skill => skill.unlockLevel === player.level);
  const unlockNotice = unlockedSkill ? ` ¡Nueva habilidad: ${unlockedSkill.name}!` : '';
  return `¡Luma subió al nivel ${player.level}! Sus estadísticas mejoraron.${unlockNotice}`;
}

function awardExperience(amount) {
  let leveledUp = false;
  player.xp += amount;
  if (player.xp >= 3) {
    player.xp -= 3;
    player.level += 1;
    const stats = getPlayerStats();
    player.hp = Math.min(stats.maxHp, player.hp + 8);
    player.focus = Math.min(player.focus, stats.maxFocus);
    leveledUp = true;
    playCssEffect(ui.level, 'is-level-up');
    playCssEffect(ui.companionPortrait, 'is-level-up');
  }
  updatePlayerPanel();
  return leveledUp;
}

function finishBattle(won, fled = false, roundMessages = []) {
  const battle = game.battle;
  if (!battle) return;
  if (won) playCssEffect(ui.enemyCreature, 'is-defeated');
  const chapter = chapters[game.chapterIndex];
  game.inBattle = false;
  ui.battleActions.hidden = true;
  ui.skillMenu.hidden = true;
  ui.battleContinue.hidden = false;
  let outcomeMessage = '';
  if (won) {
    game.defeatedCreatures[battle.enemyId] = (game.defeatedCreatures[battle.enemyId] || 0) + 1;
    refreshQuestState();
    game.tiles[battle.y][battle.x] = makeTile('floor', { visited: true });
    player.x = battle.x;
    player.y = battle.y;
    const leveledUp = awardExperience(battle.xp);
    let bossRewardMessage = '';
    if (battle.isBoss) {
      const reward = grantGear(chapter.bossGear);
      if (reward) bossRewardMessage = ` Recompensa: ${reward.name}.`;
      else { player.potions += 1; bossRewardMessage = ' El objeto ya estaba en la mochila; recibiste una poción de luz.'; }
      game.chapterComplete = true;
      game.completed = game.chapterIndex === chapters.length - 1;
      ui.battleContinue.hidden = true;
      ui.ending.hidden = false;
      ui.worldCard.hidden = true;
      document.querySelector('#ending-kicker').textContent = `CAPÍTULO ${String(game.chapterIndex + 1).padStart(2, '0')} · COMPLETADO`;
      document.querySelector('#ending-title').textContent = chapter.ending;
      document.querySelector('#ending-copy').textContent = `${chapter.endingCopy} Luma alcanzó el nivel ${player.level}.${bossRewardMessage}`;
      ui.nextChapter.hidden = game.completed;
      if (!game.completed) {
        ui.nextChapter.textContent = `CONTINUAR AL CAPÍTULO ${String(game.chapterIndex + 2).padStart(2, '0')} ↗`;
      }
      updatePlayerPanel();
      setWorldMessage(`${chapter.ending}${bossRewardMessage}`, `${chapter.endingCopy}${bossRewardMessage}`);
      outcomeMessage = leveledUp ? levelUpMessage() : `${battle.name} fue derrotado.`;
    } else if (leveledUp) {
      outcomeMessage = `${levelUpMessage()} ${battle.name} se retiró. Ganaste ${battle.xp} punto(s) de experiencia.`;
    } else {
      outcomeMessage = `${battle.name} se retiró. Ganaste ${battle.xp} punto(s) de experiencia.`;
    }
    if (!battle.isBoss) {
      setWorldMessage(`${battle.name} se retiró. El sendero está despejado.`, `Luma venció a ${battle.name} y ganó experiencia.`);
    }
  } else if (fled) {
    player.x = battle.originX;
    player.y = battle.originY;
    outcomeMessage = 'Lograste retirarte. No recibes experiencia.';
    setWorldMessage('Te alejaste del encuentro. Puedes volver a intentarlo.', 'Luma se retiró para recuperar el aliento.');
  } else {
    player.hp = Math.max(1, Math.floor(getPlayerStats().maxHp / 2));
    outcomeMessage = 'Luma necesita descansar. Volviste al inicio con la mitad de energía.';
    player.x = 1;
    player.y = 1;
    setWorldMessage('Luma volvió al inicio para recuperarse. La criatura sigue en el bosque.', 'El valle devolvió a Luma al comienzo del sendero.');
  }
  if (player.statuses.length || battle.statuses.length) roundMessages.push('Los estados activos se disipan al terminar el combate.');
  document.querySelector('#battle-message').textContent = [outcomeMessage, ...roundMessages].filter(Boolean).join(' ');
  player.statuses = [];
  battle.statuses = [];
  renderStatusIndicators(player);
  renderStatusIndicators(battle);
  renderBattleBars();
  game.battle = null;
  updatePlayerPanel();
  renderWorld();
}

function enemyCounterattack(messages) {
  const battle = game.battle;
  if (!battle || battle.hp <= 0) return [];
  const statusesAtStart = [...battle.statuses];
  if (hasStatus(battle, 'aturdido')) {
    messages.push(`${battle.name} está aturdido y pierde su acción.`);
    return statusesAtStart;
  }
  let damage = randomDamage(battle.minDamage, battle.maxDamage);
  if (hasStatus(battle, 'congelado')) {
    damage = Math.max(1, Math.round(damage * 0.75));
    messages.push(`El congelamiento reduce el daño de ${battle.name} en un 25%.`);
  }
  const stats = getPlayerStats();
  damage = Math.max(1, damage - stats.defense);
  if (stats.defense > 0) messages.push(`El equipo de Luma reduce el golpe en ${stats.defense} PV.`);
  if (battle.guarding) {
    damage = Math.ceil(damage / 2);
    battle.guarding = false;
  }
  const hpBefore = player.hp;
  player.hp = Math.max(0, player.hp - damage);
  showDamageImpact('player', hpBefore - player.hp);
  messages.push(`${battle.name} contraataca. Luma pierde ${damage} PV.`);
  renderBattleBars();
  tryInflictStatus(battle, player, messages, 'Luma');
  return statusesAtStart;
}

// Variables primitivas: recupera un punto de foco al terminar cada turno de combate.
function recoverFocusAfterTurn() {
  player.focus = Math.min(getPlayerStats().maxFocus, player.focus + 1);
  updatePlayerPanel();
  if (game.inBattle) renderBattleBars();
}

function completeCombatTurn(playerStatusesAtStart, enemyStatusesAtStart, messages) {
  resolveRoundStatuses(playerStatusesAtStart, enemyStatusesAtStart, messages);
  recoverFocusAfterTurn();
  if (player.hp <= 0) finishBattle(false, false, messages);
  else if (game.battle && game.battle.hp <= 0) finishBattle(true, false, messages);
  else showBattleMessages(messages);
}

// Combate por turnos: cada acción se resuelve con condicionales y luego contraataca el enemigo
function performBattleAction(action, skillId = null) {
  if (!game.inBattle || !game.battle) return;
  const battle = game.battle;
  if (action === 'open-skills') { openSkillMenu(); return; }
  // REGLA C: si el turno está congelado, no se ejecuta ni consume una habilidad.
  if (game.skipNextTurn) { closeSkillMenu(); resolveSkippedTurn(); return; }
  const skill = action === 'skill' ? skills.find(item => item.id === skillId) : null;
  if (action === 'skill' && !skill) return;
  const playerStatusesAtStart = [...player.statuses];
  const playerStunned = hasStatus(player, 'aturdido');
  if (!['skill', 'guard', 'potion', 'run'].includes(action)) return;
  if (!playerStunned && skill && player.level < skill.unlockLevel) {
    document.querySelector('#battle-message').textContent = `Necesitas alcanzar el nivel ${skill.unlockLevel} para usar ${skill.name}.`;
    return;
  }
  if (!playerStunned && skill && player.focus < skill.cost) {
    document.querySelector('#battle-message').textContent = `No tienes suficiente foco para ${skill.name}.`;
    return;
  }
  if (!playerStunned && action === 'potion' && (player.potions <= 0 || (player.hp >= getPlayerStats().maxHp && !hasStatus(player, 'veneno')))) {
    document.querySelector('#battle-message').textContent = player.potions <= 0 ? 'No quedan pociones. Elige otro movimiento.' : 'Luma ya tiene toda su energía. Elige otro movimiento.';
    return;
  }
  if (!playerStunned && action === 'run' && battle.isBoss) return;
  if (skill) closeSkillMenu();
  consumeTurn();
  const messages = [];
  if (playerStunned) {
    messages.push('Luma está aturdida y pierde su acción.');
    completeCombatTurn(playerStatusesAtStart, enemyCounterattack(messages), messages);
    return;
  }
  if (action === 'skill') {
    // Arreglos y objetos literales: calcula el daño de la habilidad y la eficacia elemental.
    player.focus -= skill.cost;
    const stats = getPlayerStats();
    const baseDamage = randomDamage(5 + player.level, 8 + player.level) + stats.attack;
    const effect = getElementEffect(skill.element, battle);
    const elementMultiplier = 1 + (stats.elementBonus[skill.element] || 0);
    const frozenMultiplier = hasStatus(player, 'congelado') ? 0.75 : 1;
    if (frozenMultiplier < 1) messages.push('El congelamiento reduce el daño de Luma en un 25%.');
    const damage = Math.max(1, Math.round(baseDamage * skill.power * effect.multiplier * elementMultiplier * frozenMultiplier));
    const enemyHpBefore = battle.hp;
    battle.hp = Math.max(0, battle.hp - damage);
    showDamageImpact('enemy', enemyHpBefore - battle.hp, effect.multiplier);
    const multiplierLabel = skill.power === 1 ? '' : ` · potencia ×${skill.power}`;
    messages.push(`Luma usa ${skill.name}${multiplierLabel} y causa ${damage} PV.`);
    if (effect.message) messages.push(effect.message);
    if (elementMultiplier > 1) messages.push(`${skill.element} del equipo aumenta el poder en un ${Math.round((elementMultiplier - 1) * 100)}%.`);
    if (battle.hp > 0) tryInflictStatus(skill, battle, messages, battle.name);
    renderBattleBars();
    if (battle.hp <= 0) {
      resolveRoundStatuses(playerStatusesAtStart, [], messages, false);
      recoverFocusAfterTurn();
      finishBattle(true, false, messages);
      return;
    }
  } else if (action === 'guard') {
    battle.guarding = true;
    messages.push('Luma se protege. El próximo golpe será menos fuerte.');
  } else if (action === 'potion') {
    player.potions -= 1;
    const healed = Math.min(8, getPlayerStats().maxHp - player.hp);
    player.hp += healed;
    if (healed > 0) {
      playCssEffect(ui.playerSprite, 'is-healing');
      showFloatingNumber('player', healed, 'healing');
    }
    messages.push(healed > 0 ? `Usaste una poción. Luma recupera ${healed} PV.` : 'Luma ya tiene toda su energía. La poción se gastó.');
    if (removeStatus(player, 'veneno')) messages.push('La poción de luz limpia el veneno de Luma.');
    updatePlayerPanel();
    renderBattleBars();
  } else if (action === 'run') {
    if (Math.random() < 0.6) {
      resolveRoundStatuses(playerStatusesAtStart, [], messages, false);
      recoverFocusAfterTurn();
      finishBattle(false, true, messages);
      return;
    }
    messages.push('El sendero está bloqueado. No pudiste escapar.');
  }
  completeCombatTurn(playerStatusesAtStart, enemyCounterattack(messages), messages);
}

function continueExploration() {
  if (game.completed) return;
  ui.battleView.hidden = true;
  ui.exploration.hidden = false;
  game.battle = null;
  renderWorld();
}

// Prepara un capítulo: reinicia variables de estado, actualiza textos del DOM y reconstruye el mapa
function launchChapter(index, freshStart = false) {
  const chapter = chapters[index];
  game.chapterIndex = index;
  if (freshStart) {
    player.maxFocusBonus = 0;
    game.quests = {};
    game.defeatedCreatures = {};
    game.questFlags = {};
    player.gear = [];
    player.equipment = { weapon: null, charm: null };
    player.level = 1;
    player.xp = 0;
    player.potions = 2;
    player.herbs = 0;
    player.hp = getPlayerStats().maxHp;
  } else {
    player.hp = getPlayerStats().maxHp;
    player.potions += 1;
  }
  player.focus = getPlayerStats().maxFocus;
  player.x = 1;
  player.y = 1;
  player.fragments = 0;
  player.keys = 0;
  game.quests[chapter.npc.quest.id] = 'available';
  game.questFlags[chapter.npc.quest.id] = false;
  game.turn = 1;
  game.skipNextTurn = false;
  game.alertActive = false;
  player.statuses = [];
  if (game.battle) game.battle.statuses = [];
  game.inBattle = false;
  game.completed = false;
  game.chapterComplete = false;
  game.battle = null;
  ui.playerStatuses.replaceChildren();
  ui.enemyStatuses.replaceChildren();
  ui.turnCount.textContent = 'TURNO 01';
  ui.worldCard.hidden = false;
  ui.exploration.hidden = false;
  ui.battleView.hidden = true;
  ui.battleActions.hidden = false;
  ui.skillMenu.hidden = true;
  ui.battleContinue.hidden = true;
  ui.trapAlert.hidden = true;
  ui.ending.hidden = true;
  document.body.classList.remove('body-alert');
  document.body.classList.remove('biome-valley', 'biome-cave', 'biome-peak');
  document.body.classList.add(`biome-${chapter.biome}`);
  ui.worldCard.classList.remove('is-alert');
  ui.worldCard.classList.remove('biome-valley', 'biome-cave', 'biome-peak');
  ui.worldCard.classList.add(`biome-${chapter.biome}`);
  document.querySelector('#chapter-mark-number').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
  document.querySelector('#chapter-mark-name').textContent = chapter.shortName;
  document.querySelector('#zone-label').textContent = `CAPÍTULO ${String(index + 1).padStart(2, '0')} · ${chapter.region}`;
  document.querySelector('#zone-title').textContent = chapter.zone;
  document.querySelector('#weather-icon').textContent = chapter.weatherIcon;
  document.querySelector('#weather-label').textContent = chapter.weather;
  document.querySelector('#legend-resource-symbol').textContent = chapter.resourceGlyph;
  document.querySelector('#legend-resource-name').textContent = chapter.resource.toUpperCase();
  document.querySelector('#resource-label').textContent = chapter.resourcePlural.toUpperCase();
  document.querySelector('#quest-title').textContent = chapter.objectiveTitle;
  document.querySelector('#quest-description').textContent = chapter.objective;
  document.querySelector('#quest-step-one').textContent = chapter.stepOne;
  document.querySelector('#quest-step-two').textContent = chapter.stepTwo;
  updateQuestPanel();
  buildWorld();
  updatePlayerPanel();
  renderWorld();
  setWorldMessage(`Reúne tres ${chapter.resourcePlural} y encuentra a ${enemyTypes[chapter.boss].name}.`, `Luma llegó a ${chapter.name}. La aventura continúa.`);
}

function advanceChapter() {
  if (!game.chapterComplete || game.completed) return;
  launchChapter(game.chapterIndex + 1);
}

function resetAdventure() {
  game.discoveredCreatures = [];
  game.quests = {};
  game.questFlags = {};
  game.defeatedCreatures = {};
  player.gear = [];
  player.equipment = { weapon: null, charm: null };
  player.statuses = [];
  if (game.battle) game.battle.statuses = [];
  game.activeModal = null;
  game.modalOpener = null;
  game.dialogueLine = 0;
  game.inventoryTab = 'materials';
  ui.inventoryModal.hidden = true;
  ui.bestiaryModal.hidden = true;
  ui.dialogueModal.hidden = true;
  document.querySelectorAll('[data-bag-tab]').forEach(tab => {
    const selected = tab.dataset.bagTab === 'materials';
    tab.classList.toggle('is-selected', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  launchChapter(0, true);
  renderInventoryTab();
  updateBestiaryCount();
}

// EVENTOS DEL NAVEGADOR: click en el control direccional
document.querySelectorAll('[data-move]').forEach(button => {
  button.addEventListener('click', () => movePlayer(button.dataset.move));
});
// EVENTOS: click para abrir la mochila y la guía de criaturas
document.querySelector('#open-inventory').addEventListener('click', event => openModal('inventory', event.currentTarget));
document.querySelector('#open-bestiary').addEventListener('click', event => openModal('bestiary', event.currentTarget));
// EVENTOS: teclado (Enter o espacio) en los controles que funcionan como botones
document.querySelectorAll('#open-inventory, #open-bestiary').forEach(control => {
  control.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      control.click();
    }
  });
});
document.querySelectorAll('[data-bag-tab]').forEach(button => {
  button.addEventListener('click', () => {
    game.inventoryTab = button.dataset.bagTab;
    renderInventoryTab();
    document.querySelectorAll('[data-bag-tab]').forEach(tab => {
      const selected = tab.dataset.bagTab === game.inventoryTab;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
  });
});
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
[ui.inventoryModal, ui.bestiaryModal, ui.dialogueModal].forEach(modal => {
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
});
ui.inventoryList.addEventListener('click', event => {
  const action = event.target.closest('[data-feature-action]')?.dataset.featureAction;
  const gearAction = event.target.closest('[data-gear-action]');
  if (gearAction) equipGear(gearAction.dataset.gearAction, gearAction.dataset.gearId);
  if (action === 'potion') usePotionFromInventory();
  if (action === 'pickaxe') activatePickaxe();
  if (action === 'lantern') activateLantern();
  renderInventoryTab();
});
// EVENTOS: teclado (flechas, WASD, I, B, P, L, Esc)
document.addEventListener('keydown', event => {
  if (game.activeModal) {
    if (event.key === 'Escape') closeModal();
    return;
  }
  if (event.key === 'i' || event.key === 'I') { event.preventDefault(); openModal('inventory'); return; }
  if (event.key === 'b' || event.key === 'B') { event.preventDefault(); openModal('bestiary'); return; }
  if (event.key === 'p' || event.key === 'P') { event.preventDefault(); activatePickaxe(); return; }
  if (event.key === 'l' || event.key === 'L') { event.preventDefault(); activateLantern(); return; }
  const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
  const direction = keyMap[event.key];
  if (direction) {
    event.preventDefault();
    movePlayer(direction);
  }
});
// EVENTOS: click en las acciones de combate
document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => performBattleAction(button.dataset.action));
});
ui.battleContinue.addEventListener('click', continueExploration);
ui.nextChapter.addEventListener('click', advanceChapter);
document.querySelector('#restart-button').addEventListener('click', resetAdventure);
document.querySelector('#ending-restart').addEventListener('click', resetAdventure);

// EVENTO DEL NAVEGADOR: limpia clases decorativas y elimina números al terminar su animación.
const animationClassByName = {
  'combat-shake': 'is-hit',
  'enemy-effective-flash': 'is-effective',
  'healing-pulse': 'is-healing',
  'level-up-glow': 'is-level-up',
  'enemy-defeat': 'is-defeated',
  'status-notice': 'is-status-applied',
  'status-message': 'is-status-applied'
};
document.addEventListener('animationend', event => {
  if (event.animationName === 'floating-number-rise') {
    event.target.remove();
    return;
  }
  const className = animationClassByName[event.animationName];
  if (className) event.target.classList.remove(className);
});

// Inicio de la aventura
launchChapter(0, true);
updateBestiaryCount();
