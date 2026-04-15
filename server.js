const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// ── Bingo items ──────────────────────────────────────────────

// "allgemein" items are always mixed into every category
const allgemein = [
  "Lehrer kommt zu spät", "Jemand schläft", "Handy klingelt", "Kann ich aufs Klo?",
  "Jemand isst heimlich", "Stille wenn Lehrer Frage stellt", "Einer redet die ganze Zeit",
  "Jemand hat kein Material dabei", "Pause wird sehnsüchtig erwartet",
  "Gruppenarbeit = einer arbeitet", "Jemand kommt zu spät rein",
  "Falscher Raum am Anfang", "Hitzefrei-Hoffnung", "Vertretungslehrer kommt",
  "Unterricht fällt aus (Jubel)", "Jemand erzählt vom Wochenende",
  "Kreide/Marker ist leer", "Stuhl quietscht laut", "Jemand fragt wie viel Uhr es ist",
  "Tafel/Whiteboard ist voll", "Lehrer macht Witz, keiner lacht",
  "Lehrer macht Witz, alle lachen", "Einer packt 5 Min früher ein",
  "Sitznachbar quatscht die ganze Zeit", "Fenster auf vs Fenster zu Debatte",
  "Heizung geht nicht", "Jemand hat Energy Drink dabei", "Lehrer vergisst wo er war",
  "PowerPoint hat 200 Slides", "Jemand gähnt ansteckend",
  "Es wird über Essen diskutiert", "Jemand spielt am Handy",
  "Lehrer erzählt private Geschichte", "Die Uhr geht zu langsam",
  "Klausurtermin wird verkündet (Panik)", "Jemand sagt 'das hatten wir doch schon'",
];

const items = {
  si: [
    // Technik / Systemintegration
    "Drucker geht nicht", "Haben Sie neu gestartet?", "WLAN fällt aus",
    "Admin-Passwort vergessen", "Windows Update im Unterricht", "Beamer funktioniert nicht",
    "Jemand googelt die Antwort", "Linux vs Windows Debatte", "Ping auf 8.8.8.8",
    "Jemand hat sich ausgesperrt", "USB-Stick wird nicht erkannt", "Bluescreen bei jemandem",
    "Kabel defekt", "Falsches Subnetz eingetragen", "CMD statt PowerShell",
    "DNS ist immer Schuld", "IP-Konflikt im Netzwerk", "Switch vs Hub Diskussion",
    "Jemand installiert was Verbotenes", "Firewall blockiert alles", "DHCP vergibt keine IPs",
    "Jemand tippt ipconfig /all", "Bildschirm schwarz — Kabel steckt nicht",
    "Virtualisierung ist Magie", "Gruppenrichtlinie zerschießt alles",
    "Lehrer kennt das Tool nicht", "Jemand hat Root-Rechte und sollte nicht",
    "Backup? Welches Backup?", "Jemand löscht ausversehen was", "Server antwortet nicht",
    "Port 80 vs 443 Erklärung", "OSI-Modell wird erwähnt",
    "Jemand sagt Internet statt Intranet", "Taskmanager als Lösung für alles",
    "PC braucht 10 Min zum Hochfahren", "Treiber fehlt", "Jemand baut am falschen PC",
    "Cloud = Computer von jemand anderem", "Jemand verwechselt RAM und ROM",
    "Jemand öffnet 50 Chrome Tabs",
    // Ausbildung / Betrieb
    "Im Betrieb ist das anders", "Das braucht ihr für die Prüfung",
    "Berichtsheft nicht geschrieben", "Jemand war gestern krank (sicher)",
    "Ausbilder wird zitiert", "Prüfungsangst-Gespräch", "Überstunden-Diskussion",
    "Jemand sucht neuen Betrieb", "IHK wird verflucht", "Klassenfahrt-Planung im Unterricht",
    "Jemand hat den Stoff nicht gelernt", "Ausbildungsnachweis fehlt",
    "Kollege im Betrieb hat keine Ahnung", "Jemand will nach der Ausbildung studieren",
    "Übernahme wird diskutiert", "Azubi-Vergütung ungerecht",
    "Prüfungsvorbereitung = YouTube", "Jemand hat 3 Wochen Urlaub am Stück",
    "Chef hat was Dummes gesagt", "Betrieb hat kein Budget", "Abteilungswechsel steht an",
    "Jemand hat die falsche Ausbildung gewählt", "Berufsschule > Betrieb oder umgekehrt",
    "Lernfeld wird verwechselt", "Prüfung ist in X Wochen — Panik",
    "Zwischenprüfung zählt nicht... oder?", "Jemand macht Ausbildung nur wegen Geld",
    "Lehrer erzählt von seiner Ausbildung", "Praktische Prüfung Themensuche",
    "Jemand kommt direkt vom Betrieb und ist fertig",
  ],
  wirtschaft: [
    "Angebot und Nachfrage", "Jemand versteht BWL nicht", "Kaufvertrag wird erklärt",
    "Rechnung ohne MwSt", "Jemand schläft bei Buchungssätzen", "Was war nochmal Skonto?",
    "Brutto vs Netto Verwirrung", "Inflation wird erwähnt", "Jemand sagt Kapitalismus",
    "Aktien-Tipp vom Sitznachbar", "Bilanz geht nicht auf", "Soll an Haben",
    "Jemand fragt wozu man das braucht", "Steuern sind zu kompliziert",
    "Lehrer bringt Praxisbeispiel", "Jemand verwechselt BWL und VWL",
    "Konjunkturzyklus an der Tafel", "Vertragsrecht ist langweilig",
    "Jemand rechnet falsch", "BIP wird erklärt", "Mahnverfahren Ablauf",
    "Jemand hat keine Ahnung von Steuern", "Azubi-Gehalt reicht nicht",
    "Marketing 4P werden aufgezählt", "Jemand fragt was ein KPI ist",
    "EZB wird erwähnt", "Buchungssatz hat 5 Zeilen", "Was ist nochmal eine GmbH?",
    "Lehrer redet über Aktien", "Gewinn vs Umsatz Unterschied",
  ],
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getPool(category) {
  if (category === 'alle') {
    return [...items.si, ...items.wirtschaft, ...allgemein];
  }
  return [...(items[category] || []), ...allgemein];
}

// ── Room state ───────────────────────────────────────────────

const rooms = new Map();

function createRoom(category) {
  let code;
  do { code = generateCode(); } while (rooms.has(code));

  const pool = shuffle(getPool(category)).slice(0, 24);
  const room = {
    code,
    category,
    items: pool,
    marked: new Set([12]), // free space
    players: new Map(),
    createdAt: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

// Clean up stale rooms every 30 min
setInterval(() => {
  const cutoff = Date.now() - 3 * 60 * 60 * 1000; // 3h
  for (const [code, room] of rooms) {
    if (room.createdAt < cutoff) rooms.delete(code);
  }
}, 30 * 60 * 1000);

// ── Socket.IO ────────────────────────────────────────────────

io.on('connection', (socket) => {
  let currentRoom = null;
  let playerName = null;

  socket.on('create-room', ({ name, category }, cb) => {
    const room = createRoom(category);
    currentRoom = room.code;
    playerName = name || 'Anon';
    room.players.set(socket.id, playerName);
    socket.join(room.code);

    cb({
      code: room.code,
      items: room.items,
      marked: [...room.marked],
      players: [...room.players.values()],
    });

    io.to(room.code).emit('players-update', [...room.players.values()]);
  });

  socket.on('join-room', ({ name, code }, cb) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return cb({ error: 'Raum nicht gefunden' });

    currentRoom = room.code;
    playerName = name || 'Anon';
    room.players.set(socket.id, playerName);
    socket.join(room.code);

    cb({
      code: room.code,
      items: room.items,
      marked: [...room.marked],
      players: [...room.players.values()],
    });

    io.to(room.code).emit('players-update', [...room.players.values()]);
    io.to(room.code).emit('player-joined', playerName);
  });

  socket.on('toggle-cell', (index) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room || index === 12) return;

    if (room.marked.has(index)) {
      room.marked.delete(index);
    } else {
      room.marked.add(index);
    }

    io.to(room.code).emit('cell-toggled', {
      index,
      marked: room.marked.has(index),
      by: playerName,
    });

    // Check bingo server-side
    const lines = [
      [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
      [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
      [0,6,12,18,24],[4,8,12,16,20],
    ];
    const bingoLines = lines.filter(line => line.every(i => room.marked.has(i)));
    if (bingoLines.length > 0) {
      const bingoCells = new Set(bingoLines.flat());
      io.to(room.code).emit('bingo', { cells: [...bingoCells], by: playerName });
    }
  });

  socket.on('new-card', ({ category }) => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const pool = shuffle(getPool(category || room.category)).slice(0, 24);
    room.items = pool;
    room.marked = new Set([12]);
    room.category = category || room.category;

    io.to(room.code).emit('new-card', {
      items: room.items,
      marked: [...room.marked],
      category: room.category,
    });
  });

  socket.on('disconnect', () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    room.players.delete(socket.id);
    io.to(room.code).emit('players-update', [...room.players.values()]);
    io.to(room.code).emit('player-left', playerName);

    if (room.players.size === 0) {
      rooms.delete(room.code);
    }
  });
});

// ── Start ────────────────────────────────────────────────────

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Bingo-Server läuft auf http://localhost:${PORT}`);
});
