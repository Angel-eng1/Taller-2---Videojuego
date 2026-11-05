// Raíces de Bruma: RPG de exploración por casillas y combate por turnos.
'use strict';

const mapSize = { width: 13, height: 9 };
const player = { x: 1, y: 1, hp: 24, maxHp: 24, level: 1, xp: 0, fragments: 0, potions: 2, herbs: 0 };
const game = { tiles: [], turn: 1, chapterIndex: 0, skipNextTurn: false, alertActive: false, inBattle: false, completed: false, chapterComplete: false, battle: null, discoveredCreatures: [], activeModal: null, inventoryTab: 'materials' };

const chapters = [
  {
    name: 'El Valle Antiguo', shortName: 'EL VALLE', region: 'BOSQUE DEL VALLE', zone: 'Sendero de los ecos', weather: 'BRUMA LIGERA', weatherIcon: '☼', biome: 'valley',
    resource: 'Cristal', resourcePlural: 'cristales', resourceGlyph: '✦', boss: 'guardian',
    objectiveTitle: 'Despierta el santuario.', objective: 'El guardián solo dejará pasar a quien traiga los tres fragmentos del valle.',
    stepOne: 'Explora el bosque y recoge sus cristales.', stepTwo: 'Guía a Luma hasta el guardián del santuario.',
    ending: 'El valle respira.', endingCopy: 'Luma reunió los cristales y devolvió la luz al bosque.',
    walls: [[3,1],[7,1],[5,2],[9,2],[5,3],[10,3],[2,5],[8,5],[4,7],[7,7],[10,7]], breakables: [[11,6]],
    grass: [[2,2],[3,2],[7,3],[8,4],[10,5],[2,6],[6,6],[9,6]],
    relics: [[4,1],[9,3],[3,6]], herbs: [[4,4],[10,6],[11,7]], traps: [[6,5]],
    creatures: [[4,3,'moss'],[9,5,'bramble']], signs: [[1,5]], bossAt: [11,1]
  },
  {
    name: 'Las Cuevas de Eco', shortName: 'LAS CUEVAS', region: 'GRUTAS LUMINOSAS', zone: 'Galería de las voces', weather: 'POLVO DE LUZ', weatherIcon: '✧', biome: 'cave',
    resource: 'Eco', resourcePlural: 'ecos', resourceGlyph: '◉', boss: 'echoGolem',
    objectiveTitle: 'Silencia la caverna.', objective: 'Reúne tres ecos resonantes para abrir la cámara del corazón de piedra.',
    stepOne: 'Busca los ecos entre las columnas de cristal.', stepTwo: 'Vence al Gólem de Eco en la cámara profunda.',
    ending: 'La cueva vuelve a cantar.', endingCopy: 'Luma calmó la resonancia y el camino bajo la montaña se abrió.',
    walls: [[3,1],[8,1],[5,2],[10,2],[3,4],[7,4],[9,5],[4,7],[8,7]], breakables: [[7,4]],
    grass: [[2,2],[4,2],[8,3],[2,5],[6,6],[10,6]],
    relics: [[2,4],[6,2],[10,4]], herbs: [[4,5],[9,6]], traps: [[6,5]],
    creatures: [[4,3,'echoWisp'],[9,3,'caveBat']], signs: [[1,6]], bossAt: [11,1]
  },
  {
    name: 'La Cumbre de Bruma', shortName: 'LA CUMBRE', region: 'CRESTA CELESTE', zone: 'Cima de los vientos', weather: 'NIEVE SUAVE', weatherIcon: '❄', biome: 'peak',
    resource: 'Sello', resourcePlural: 'sellos', resourceGlyph: '⬡', boss: 'mistQueen',
    objectiveTitle: 'Disipa la gran bruma.', objective: 'Encuentra los tres sellos de altura y alcanza la cima para desafiar a la reina de la niebla.',
    stepOne: 'Recorre las terrazas y reúne los sellos.', stepTwo: 'Vence a la Reina de Bruma en la cumbre.',
    ending: 'El cielo se abre.', endingCopy: 'Luma rompió el último sello de la bruma. El valle queda libre y la aventura llega a su fin.',
    walls: [[3,1],[7,1],[10,2],[4,3],[8,3],[2,5],[6,5],[9,6],[4,7],[7,7]], breakables: [[4,3]],
    grass: [[2,2],[6,2],[9,3],[3,4],[7,4],[10,5],[2,6],[5,6]],
    relics: [[5,1],[9,4],[3,6]], herbs: [[2,4],[10,6]], traps: [[6,6]],
    creatures: [[4,2,'ridgeWolf'],[8,5,'frostWisp']], signs: [[1,6]], bossAt: [11,1]
  }
];

const ui = {
  grid: document.querySelector('#world-grid'),
  worldCard: document.querySelector('.world-card'),
  exploration: document.querySelector('#exploration-view'),
  battleView: document.querySelector('#battle-view'),
  battleActions: document.querySelector('#battle-actions'),
  battleContinue: document.querySelector('#battle-continue'),
  trapAlert: document.querySelector('#trap-alert'),
  worldMessage: document.querySelector('#world-message'),
  turnCount: document.querySelector('#turn-count'),
  crystalCount: document.querySelector('#resource-count'),
  crystalTrack: document.querySelector('#crystal-track'),
  inventoryCrystals: document.querySelector('#inventory-crystals'),
  inventoryPotions: document.querySelector('#inventory-potions'),
  inventoryHerbs: document.querySelector('#inventory-herbs'),
  hpLabel: document.querySelector('#hp-side-label'),
  hpBar: document.querySelector('#hp-side-bar'),
  xpLabel: document.querySelector('#xp-label'),
  xpBar: document.querySelector('#xp-bar'),
  level: document.querySelector('#level-badge'),
  journal: document.querySelector('#journal-entry'),
  ending: document.querySelector('#ending-card'),
  nextChapter: document.querySelector('#next-chapter-button'),
  inventoryModal: document.querySelector('#inventory-modal'),
  bestiaryModal: document.querySelector('#bestiary-modal'),
  inventoryList: document.querySelector('#inventory-list'),
  bestiaryGrid: document.querySelector('#bestiary-grid')
};

const enemyTypes = {
  moss: { name: 'Musguito', sprite: 'moss', element: 'Tierra', weakness: 'Luz', habitat: 'El Valle Antiguo', lore: 'Un pequeño guardián que brota en los senderos húmedos.', maxHp: 13, minDamage: 2, maxDamage: 4, xp: 1, isBoss: false },
  bramble: { name: 'Zarzal', sprite: 'bramble', element: 'Espina', weakness: 'Luz', habitat: 'El Valle Antiguo', lore: 'Protege los claros cubiertos de raíces retorcidas.', maxHp: 17, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  guardian: { name: 'Guardián del valle', sprite: 'guardian', element: 'Roca', weakness: 'Luz', habitat: 'El Valle Antiguo', lore: 'Antigua estatua que cuida los cristales del santuario.', maxHp: 29, minDamage: 4, maxDamage: 6, xp: 3, isBoss: true },
  echoWisp: { name: 'Eco errante', sprite: 'echo', element: 'Eco', weakness: 'Tierra', habitat: 'Las Cuevas de Eco', lore: 'Una voz perdida que toma forma entre las galerías.', maxHp: 15, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  caveBat: { name: 'Murciélago de cuarzo', sprite: 'bat', element: 'Cristal', weakness: 'Eco', habitat: 'Las Cuevas de Eco', lore: 'Sus alas resuenan cuando alguien toca las paredes.', maxHp: 18, minDamage: 3, maxDamage: 5, xp: 1, isBoss: false },
  echoGolem: { name: 'Gólem de Eco', sprite: 'echo-golem', element: 'Cristal', weakness: 'Luz', habitat: 'Las Cuevas de Eco', lore: 'Guardián tallado para contener el corazón resonante.', maxHp: 33, minDamage: 4, maxDamage: 7, xp: 3, isBoss: true },
  ridgeWolf: { name: 'Lobo de escarcha', sprite: 'wolf', element: 'Hielo', weakness: 'Luz', habitat: 'La Cumbre de Bruma', lore: 'Sigue las huellas de los viajeros por las terrazas nevadas.', maxHp: 20, minDamage: 4, maxDamage: 6, xp: 1, isBoss: false },
  frostWisp: { name: 'Espíritu glaciar', sprite: 'frost', element: 'Hielo', weakness: 'Tierra', habitat: 'La Cumbre de Bruma', lore: 'Se forma donde la bruma se congela al amanecer.', maxHp: 22, minDamage: 4, maxDamage: 6, xp: 1, isBoss: false },
  mistQueen: { name: 'Reina de Bruma', sprite: 'mist-queen', element: 'Bruma', weakness: 'Luz', habitat: 'La Cumbre de Bruma', lore: 'La guardiana final. Su niebla cubrió los caminos del valle.', maxHp: 38, minDamage: 5, maxDamage: 7, xp: 3, isBoss: true }
};

function makeTile(type = 'floor', extra = {}) {
  return { type, visited: false, revealed: false, ...extra };
}

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

  const features = [
    ...chapter.walls.map(([x, y]) => ({ x, y, type: 'wall' })),
    ...chapter.breakables.map(([x, y]) => ({ x, y, type: 'breakable', breakable: true })),
    ...chapter.grass.map(([x, y]) => ({ x, y, type: 'grass' })),
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
}

const tilePresentation = {
  wall: { glyph: '♣', className: 'is-wall', label: 'árbol' },
  breakable: { glyph: '', className: 'is-breakable', label: 'tronco caído' },
  floor: { glyph: '', className: 'is-path', label: 'sendero' },
  grass: { glyph: '·', className: 'is-grass', label: 'hierba' },
  relic: { glyph: '', className: 'is-relic', label: 'fragmento' },
  herb: { glyph: '✚', className: 'is-herb', label: 'hierba curativa' },
  trap: { glyph: '', className: 'is-path', label: 'sendero' },
  spentTrap: { glyph: '!', className: 'is-discovered-trap', label: 'trampa activada' },
  creature: { glyph: '♟', className: 'is-creature', label: 'criatura' },
  boss: { glyph: '◈', className: 'is-boss', label: 'guardián del capítulo' },
  sign: { glyph: '?', className: 'is-exit', label: 'inscripción antigua' }
};

function renderWorld() {
  const fragment = document.createDocumentFragment();
  const chapter = chapters[game.chapterIndex];
  function makeCharacterSprite(sprite) {
    const figure = document.createElement('span');
    figure.className = `map-character character-sprite sprite-${sprite}`;
    figure.setAttribute('aria-hidden', 'true');
    figure.append(document.createElement('i'), document.createElement('b'), document.createElement('em'));
    return figure;
  }

  game.tiles.forEach((row, y) => {
    row.forEach((tile, x) => {
      const cell = document.createElement('div');
      const presentation = tilePresentation[tile.type];
      cell.className = `map-cell ${presentation.className}`;
      if (tile.visited) cell.classList.add('is-visited');
      const isPlayer = player.x === x && player.y === y;
      if (isPlayer) {
        cell.classList.add('is-player');
        cell.append(makeCharacterSprite('luma'));
      } else if (tile.type === 'wall') {
        const tree = document.createElement('span');
        tree.className = 'map-tree';
        tree.setAttribute('aria-hidden', 'true');
        cell.append(tree);
      } else if (tile.type === 'breakable') {
        const trunk = document.createElement('span');
        trunk.className = 'map-object-breakable';
        trunk.setAttribute('aria-hidden', 'true');
        trunk.append(document.createElement('i'), document.createElement('b'));
        cell.append(trunk);
      } else if (tile.type === 'creature' || tile.type === 'boss') {
        const enemyId = tile.type === 'boss' ? chapter.boss : tile.enemy;
        cell.append(makeCharacterSprite(enemyTypes[enemyId].sprite));
      } else if (tile.type === 'relic' || tile.type === 'herb' || tile.type === 'spentTrap' || tile.type === 'sign') {
        const object = document.createElement('span');
        object.className = `map-object map-object-${tile.type}`;
        object.textContent = tile.type === 'relic' ? chapter.resourceGlyph : (tile.type === 'herb' ? '✚' : (tile.type === 'spentTrap' ? '!' : '?'));
        object.setAttribute('aria-hidden', 'true');
        cell.append(object);
      } else if (tile.type === 'trap' && tile.revealed) {
        cell.classList.add('is-trap-revealed');
        const trap = document.createElement('span');
        trap.className = 'map-object map-object-trap';
        trap.textContent = '!';
        trap.setAttribute('aria-hidden', 'true');
        cell.append(trap);
      }
      cell.setAttribute('role', 'gridcell');
      const label = tile.type === 'relic' ? chapter.resource : (tile.type === 'trap' && tile.revealed ? 'trampa oculta' : presentation.label);
      cell.setAttribute('aria-label', isPlayer ? `Luma y tú, ${label}` : label);
      fragment.append(cell);
    });
  });
  ui.grid.replaceChildren(fragment);
  updateToolAvailability();
}

function updatePlayerPanel() {
  const chapter = chapters[game.chapterIndex];
  const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
  const xpPercent = Math.min(100, (player.xp / 3) * 100);
  ui.hpLabel.textContent = `${player.hp} / ${player.maxHp}`;
  ui.hpBar.style.width = `${hpPercent}%`;
  ui.xpLabel.textContent = `${player.xp} / 3`;
  ui.xpBar.style.width = `${xpPercent}%`;
  ui.level.textContent = `NIVEL ${String(player.level).padStart(2, '0')}`;
  ui.crystalCount.textContent = `${player.fragments} / 3`;
  ui.inventoryCrystals.textContent = String(player.fragments);
  document.querySelector('#inventory-resource-symbol').firstChild.textContent = `${chapter.resourceGlyph} `;
  ui.inventoryPotions.textContent = String(player.potions);
  ui.inventoryHerbs.textContent = String(player.herbs);
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

function renderInventoryTab() {
  if (!ui.inventoryList) return;
  const chapter = chapters[game.chapterIndex];
  const entries = {
    materials: [
      { icon: chapter.resourceGlyph, name: chapter.resourcePlural, quantity: player.fragments, description: `Fragmentos reunidos en ${chapter.name}. Abren el camino al guardián.` },
      { icon: '❋', name: 'Hierbas curativas', quantity: player.herbs, description: 'Plantas del camino que se convierten en pociones de luz.' }
    ],
    items: [
      { icon: '✚', name: 'Poción de luz', quantity: player.potions, description: 'Recupera hasta 8 puntos de energía.', action: 'potion', disabled: player.potions <= 0 || game.completed || player.hp >= player.maxHp }
    ],
    tools: [
      { icon: '⌁', name: 'Pico de explorador', quantity: 'EQUIPADO', description: 'Rompe un tronco caído y abre un paso bloqueado.', action: 'pickaxe', disabled: !canUsePickaxe() },
      { icon: '◉', name: 'Farol de luciérnaga', quantity: 'EQUIPADO', description: 'Revela trampas ocultas hasta cuatro pasos alrededor de Luma.', action: 'lantern', disabled: !canUseLantern() }
    ]
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

function openModal(name, opener = null) {
  if (game.activeModal) closeModal();
  game.activeModal = name;
  game.modalOpener = opener;
  document.body.classList.add('feature-open');
  const modal = name === 'inventory' ? ui.inventoryModal : ui.bestiaryModal;
  modal.hidden = false;
  if (name === 'inventory') renderInventoryTab();
  else renderBestiary();
  modal.querySelector('[role="dialog"]').focus();
}

function closeModal() {
  if (!game.activeModal) return;
  const modal = game.activeModal === 'inventory' ? ui.inventoryModal : ui.bestiaryModal;
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
  renderWorld();
  setWorldMessage('¡Camino despejado! El pico abrió un atajo.', 'Luma apartó un árbol con el pico y abrió un nuevo paso.');
}

function activateLantern() {
  if (game.inBattle || game.completed) return;
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
  renderWorld();
  setWorldMessage('El farol revela una trampa cercana. Ahora puedes rodearla.', 'La luz azul del farol descubrió una marca peligrosa bajo la hierba.');
}

function usePotionFromInventory() {
  if (game.inBattle) {
    if (player.hp >= player.maxHp || player.potions <= 0) return;
    performBattleAction('potion');
    renderInventoryTab();
    return;
  }
  if (game.completed || player.potions <= 0 || player.hp >= player.maxHp) return;
  if (game.skipNextTurn) { resolveSkippedTurn(); return; }
  consumeTurn();
  player.potions -= 1;
  const healed = Math.min(8, player.maxHp - player.hp);
  player.hp += healed;
  updatePlayerPanel();
  setWorldMessage(`Luma usó una poción y recuperó ${healed} PV.`, 'Una poción brillante ayudó a Luma a recuperar energía.');
  renderInventoryTab();
}

function movePlayer(direction) {
  if (game.inBattle || game.completed) return;
  if (game.skipNextTurn) {
    resolveSkippedTurn();
    return;
  }

  const movement = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction];
  if (!movement) return;
  const x = player.x + movement[0];
  const y = player.y + movement[1];
  const tile = game.tiles[y]?.[x];
  if (!tile || (tile.type === 'wall' && !tile.breakable)) {
    setWorldMessage('Los árboles son demasiado densos por aquí. Busca otro camino.', 'El bosque cierra ese paso.');
    return;
  }
  if (tile.type === 'breakable') {
    setWorldMessage('Un tronco caído bloquea el paso. Usa el pico para romperlo.', 'El sendero está bloqueado por un tronco caído.');
    return;
  }
  const chapter = chapters[game.chapterIndex];
  if (tile.type === 'boss' && player.fragments < 3) {
    setWorldMessage(`El guardián bloquea el paso. Te faltan ${3 - player.fragments} ${chapter.resourcePlural}.`, `Una voz resuena: «Trae los tres ${chapter.resourcePlural}».`);
    return;
  }

  const origin = { x: player.x, y: player.y };
  player.x = x;
  player.y = y;
  tile.visited = true;
  consumeTurn();

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
    updatePlayerPanel();
    setWorldMessage('Encontraste una hierba curativa. Luma la guardó como una poción.', 'Una planta de luz crecía entre las raíces.');
  } else if (tile.type === 'trap') {
    tile.type = 'spentTrap';
    tile.visited = true;
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
    setWorldMessage('El bosque guarda silencio. El sendero continúa.', 'Luma avanzó entre la hierba húmeda.');
  }

  renderWorld();
}

function randomDamage(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function startBattle(enemyId, x, y, origin) {
  const definition = enemyTypes[enemyId];
  if (!game.discoveredCreatures.includes(enemyId)) game.discoveredCreatures.push(enemyId);
  updateBestiaryCount();
  if (game.activeModal === 'bestiary') renderBestiary();
  game.inBattle = true;
  game.battle = { ...definition, hp: definition.maxHp, x, y, originX: origin.x, originY: origin.y, guarding: false, enemyId };
  ui.exploration.hidden = true;
  ui.battleView.hidden = false;
  ui.battleActions.hidden = false;
  ui.battleContinue.hidden = true;
  ui.trapAlert.hidden = true;
  document.querySelector('#battle-caption').textContent = definition.isBoss ? `${definition.name} protege el camino.` : `¡${definition.name} defiende su territorio!`;
  document.querySelector('#enemy-name').textContent = definition.name;
  document.querySelector('#enemy-sprite').className = `character-sprite sprite-${definition.sprite}`;
  document.querySelector('#enemy-hp-label').textContent = `${game.battle.hp} / ${definition.maxHp} PV`;
  document.querySelector('#battle-message').textContent = definition.isBoss ? `${definition.name} espera tu movimiento.` : `¡${definition.name} aparece en el camino!`;
  document.querySelector('#run-button').hidden = definition.isBoss;
  renderBattleBars();
  updatePlayerPanel();
}

function renderBattleBars() {
  if (!game.battle) return;
  const enemyPercent = Math.max(0, (game.battle.hp / game.battle.maxHp) * 100);
  const playerPercent = Math.max(0, (player.hp / player.maxHp) * 100);
  document.querySelector('#enemy-health').style.width = `${enemyPercent}%`;
  document.querySelector('#player-health').style.width = `${playerPercent}%`;
  document.querySelector('#player-hp-label').textContent = `${player.hp} / ${player.maxHp} PV`;
  document.querySelector('#battle-potions').textContent = `× ${player.potions}`;
  document.querySelector('[data-action="potion"]').disabled = player.potions <= 0 || player.hp >= player.maxHp;
}

function awardExperience(amount) {
  player.xp += amount;
  if (player.xp >= 3) {
    player.xp -= 3;
    player.level += 1;
    player.maxHp += 4;
    player.hp = Math.min(player.maxHp, player.hp + 8);
    document.querySelector('#battle-message').textContent = `¡Luma subió al nivel ${player.level}! Su energía máxima aumentó.`;
  }
  updatePlayerPanel();
}

function finishBattle(won, fled = false) {
  const battle = game.battle;
  const chapter = chapters[game.chapterIndex];
  game.inBattle = false;
  ui.battleActions.hidden = true;
  ui.battleContinue.hidden = false;
  if (won) {
    game.tiles[battle.y][battle.x] = makeTile('floor', { visited: true });
    player.x = battle.x;
    player.y = battle.y;
    awardExperience(battle.xp);
    if (battle.isBoss) {
      game.chapterComplete = true;
      game.completed = game.chapterIndex === chapters.length - 1;
      ui.battleContinue.hidden = true;
      ui.ending.hidden = false;
      ui.worldCard.hidden = true;
      document.querySelector('#ending-kicker').textContent = `CAPÍTULO ${String(game.chapterIndex + 1).padStart(2, '0')} · COMPLETADO`;
      document.querySelector('#ending-title').textContent = chapter.ending;
      document.querySelector('#ending-copy').textContent = `${chapter.endingCopy} Luma alcanzó el nivel ${player.level}.`;
      ui.nextChapter.hidden = game.completed;
      if (!game.completed) {
        ui.nextChapter.textContent = `CONTINUAR AL CAPÍTULO ${String(game.chapterIndex + 2).padStart(2, '0')} ↗`;
      }
      setWorldMessage(chapter.ending, chapter.endingCopy);
    } else if (document.querySelector('#battle-message').textContent.startsWith('¡Luma subió')) {
      document.querySelector('#battle-message').textContent += ` ${battle.name} se retiró. Ganaste ${battle.xp} punto(s) de experiencia.`;
    } else {
      document.querySelector('#battle-message').textContent = `${battle.name} se retiró. Ganaste ${battle.xp} punto(s) de experiencia.`;
    }
    if (!battle.isBoss) {
      setWorldMessage(`${battle.name} se retiró. El sendero está despejado.`, `Luma venció a ${battle.name} y ganó experiencia.`);
    }
  } else if (fled) {
    player.x = battle.originX;
    player.y = battle.originY;
    document.querySelector('#battle-message').textContent = 'Lograste retirarte. No recibes experiencia.';
    setWorldMessage('Te alejaste del encuentro. Puedes volver a intentarlo.', 'Luma se retiró para recuperar el aliento.');
  } else {
    player.hp = Math.max(1, Math.floor(player.maxHp / 2));
    document.querySelector('#battle-message').textContent = 'Luma necesita descansar. Volviste al inicio con la mitad de energía.';
    player.x = 1;
    player.y = 1;
    setWorldMessage('Luma volvió al inicio para recuperarse. La criatura sigue en el bosque.', 'El valle devolvió a Luma al comienzo del sendero.');
  }
  game.battle = null;
  updatePlayerPanel();
  renderWorld();
}

function enemyCounterattack() {
  const battle = game.battle;
  if (!battle || battle.hp <= 0) return;
  let damage = randomDamage(battle.minDamage, battle.maxDamage);
  if (battle.guarding) {
    damage = Math.ceil(damage / 2);
    battle.guarding = false;
  }
  player.hp = Math.max(0, player.hp - damage);
  document.querySelector('#battle-message').textContent = `${battle.name} contraataca. Luma pierde ${damage} PV.`;
  renderBattleBars();
  if (player.hp <= 0) finishBattle(false);
}

function performBattleAction(action) {
  if (!game.inBattle || !game.battle) return;
  const battle = game.battle;
  if (action === 'potion' && (player.potions <= 0 || player.hp >= player.maxHp)) {
    document.querySelector('#battle-message').textContent = player.potions <= 0 ? 'No quedan pociones. Elige otro movimiento.' : 'Luma ya tiene toda su energía. Elige otro movimiento.';
    return;
  }
  if (action === 'run' && battle.isBoss) return;
  consumeTurn();
  if (action === 'strike') {
    const damage = randomDamage(5 + player.level, 8 + player.level);
    battle.hp = Math.max(0, battle.hp - damage);
    document.querySelector('#battle-message').textContent = `Luma usa Destello e inflige ${damage} PV.`;
    renderBattleBars();
    if (battle.hp <= 0) { finishBattle(true); return; }
  } else if (action === 'guard') {
    battle.guarding = true;
    document.querySelector('#battle-message').textContent = 'Luma se protege. El próximo golpe será menos fuerte.';
  } else if (action === 'potion') {
    player.potions -= 1;
    const healed = Math.min(8, player.maxHp - player.hp);
    player.hp += healed;
    document.querySelector('#battle-message').textContent = healed > 0 ? `Usaste una poción. Luma recupera ${healed} PV.` : 'Luma ya tiene toda su energía. La poción se gastó.';
    updatePlayerPanel();
    renderBattleBars();
  } else if (action === 'run') {
    if (battle.isBoss) return;
    if (Math.random() < 0.6) { finishBattle(false, true); return; }
    document.querySelector('#battle-message').textContent = 'El sendero está bloqueado. No pudiste escapar.';
  } else {
    return;
  }
  enemyCounterattack();
}

function continueExploration() {
  if (game.completed) return;
  ui.battleView.hidden = true;
  ui.exploration.hidden = false;
  game.battle = null;
  renderWorld();
}

function launchChapter(index, freshStart = false) {
  const chapter = chapters[index];
  game.chapterIndex = index;
  if (freshStart) {
    player.hp = 24;
    player.maxHp = 24;
    player.level = 1;
    player.xp = 0;
    player.potions = 2;
    player.herbs = 0;
  } else {
    player.hp = player.maxHp;
    player.potions += 1;
  }
  player.x = 1;
  player.y = 1;
  player.fragments = 0;
  game.turn = 1;
  game.skipNextTurn = false;
  game.alertActive = false;
  game.inBattle = false;
  game.completed = false;
  game.chapterComplete = false;
  game.battle = null;
  ui.turnCount.textContent = 'TURNO 01';
  ui.worldCard.hidden = false;
  ui.exploration.hidden = false;
  ui.battleView.hidden = true;
  ui.battleActions.hidden = false;
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
  launchChapter(0, true);
  updateBestiaryCount();
}

document.querySelectorAll('[data-move]').forEach(button => {
  button.addEventListener('click', () => movePlayer(button.dataset.move));
});
document.querySelector('#open-inventory').addEventListener('click', event => openModal('inventory', event.currentTarget));
document.querySelector('#open-bestiary').addEventListener('click', event => openModal('bestiary', event.currentTarget));
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
  });
});
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
[ui.inventoryModal, ui.bestiaryModal].forEach(modal => {
  modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
});
ui.inventoryList.addEventListener('click', event => {
  const action = event.target.closest('[data-feature-action]')?.dataset.featureAction;
  if (action === 'potion') usePotionFromInventory();
  if (action === 'pickaxe') activatePickaxe();
  if (action === 'lantern') activateLantern();
  renderInventoryTab();
});
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
document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => performBattleAction(button.dataset.action));
});
ui.battleContinue.addEventListener('click', continueExploration);
ui.nextChapter.addEventListener('click', advanceChapter);
document.querySelector('#restart-button').addEventListener('click', resetAdventure);
document.querySelector('#ending-restart').addEventListener('click', resetAdventure);

launchChapter(0, true);
updateBestiaryCount();
