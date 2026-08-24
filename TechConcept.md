# Technisches Konzept

## 1. Scenes definieren

| Scene            | Aufgabe                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `BootScene`      | Initialisierung des Spiels                                                  |
| `MenuScene`      | Hauptmenü und Start des Spiels                                              |
| `WaveStartScene` | Auswahl des Super Shots vor einer Wave                                      |
| `GameScene`      | Hauptspiel mit Spieler, Gegnern, Asteroiden, Schwarzen Löchern und Boostern |
| `GameOverScene`  | Anzeige des Game-Over-Zustands                                              |
| `BossScene`      | Boss-Kampf nach Wave 10                                                     |

---

## 2. Game Objects definieren

### Spieler

Das vom Spieler gesteuerte Raumschiff.

### Alien

Gegnerische Raumschiffe.

### Projectile

Normale Schüsse des Spielers.

### Super Shot

Besondere Angriffe des Spielers:

* Laser
* Bombe
* Rundschuss

### Asteroid

Bewegliches Hindernis, das den Spieler beschädigen kann.

### Schwarzes Loch

Statisches Hindernis, das Schaden verursacht und Schüsse blockiert.

### Booster

Temporäre Verstärkungen:

* Heal
* Shield
* Attack Speed
* Super Shot Charger

### Boss

Hauptgegner nach der 10. Wave.

### Spawn Point

Position, an der Gegner oder andere Objekte erscheinen können.

### UI

Anzeige von:

* Lebensenergie
* Shield
* Score
* aktueller Wave
* Super-Shot-Zustand

---

## 3. Eigenschaften des Spielers

| Eigenschaft       | Beschreibung                          |
| ----------------- | ------------------------------------- |
| `health`          | Aktuelle Lebensenergie                |
| `maxHealth`       | Maximale Lebensenergie                |
| `speed`           | Bewegungsgeschwindigkeit              |
| `attackSpeed`     | Geschwindigkeit der normalen Schüsse  |
| `damage`          | Schaden der normalen Schüsse          |
| `shield`          | Aktueller Schutzschild                |
| `superShot`       | Ausgewählter Super Shot               |
| `superShotCharge` | Aktueller Ladezustand des Super Shots |
| `score`           | Aktueller Punktestand                 |

---

## 4. Aktionen / Funktionen des Spielers

### Bewegung

Der Spieler kann sich mit WASD bewegen.

```text
moveUp()
moveDown()
moveLeft()
moveRight()
```

### Schießen

Mit `SPACE` feuert der Spieler seine normale Waffe ab.

```text
shoot()
```

### Super Shot

Mit `E` aktiviert der Spieler den ausgewählten Super Shot.

```text
useSuperShot()
```

Der Super Shot kann abhängig von der Auswahl unterschiedliche Funktionen ausführen:

```text
useLaser()
useBomb()
useRoundShot()
```

### Schaden erhalten

Der Spieler kann durch Gegner, Asteroiden und Schwarze Löcher Schaden erhalten.

```text
takeDamage()
```

### Heilung

Ein Heal-Booster stellt Lebensenergie wieder her.

```text
heal()
```

### Shield aktivieren

Der Shield-Booster aktiviert einen temporären Schutz.

```text
activateShield()
```

### Attack Speed erhöhen

Der Attack-Speed-Booster erhöht vorübergehend die Schussgeschwindigkeit.

```text
activateAttackSpeed()
```

### Super Shot aufladen

Der Super Shot Charger erhöht die verfügbare Super-Shot-Energie.

```text
chargeSuperShot()
```

### Spieler zerstören

Wenn die Lebensenergie des Spielers 0 erreicht, wird der Spieler zerstört und der Game-Over-Zustand ausgelöst.

```text
destroy()
```
