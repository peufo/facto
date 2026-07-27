# Roadmap — Facto (Universal Process Graph)

Roadmap en phases, sans dates : chaque phase se termine quand son objectif est atteint, pas à une échéance fixe. Document vivant, à réviser après chaque phase plutôt qu'à suivre au pied de la lettre.

## Où on en est

Le moteur central (Process/Commit/Connection/Attribute, fusion récursive dans `computeSnapshot`) fonctionne et est branché à une UI de debug. Deux modules existent (`core`, `location`). Le rendu spatial (canvas + SVG, pan/zoom) est construit mais pas encore connecté aux vraies données. Pas de tests, pas d'auth, `REFERENCE` non implémenté.

## Phase 1 — Rendre le graphe visible

**Objectif : passer des tables JSON brutes à une carte où on voit vraiment son usine.**

- Brancher `SceneCanvas`/`SceneSVG` sur les vrais `Process`/`Commit` (actuellement le rendu et les données vivent séparément)
- Utiliser les attributs du module `location` (`position_x`, `position_y`, `dimension_x`, `dimension_y`, `rotation`) pour positionner chaque Process sur le canvas
- Résoudre l'attribut `parent` (type `REFERENCE`) pour la hiérarchie de conteneurs (atelier → ligne → machine)
- Ce dernier point force à sortir `REFERENCE` de son statut de TODO (`computeSnapshot` l'ignore actuellement) — la Phase 1 règle donc de facto une partie de la question technique "live vs figé" plutôt que de la traiter dans l'abstrait

**Fait quand** : on peut créer une machine, lui donner une position et un parent, et la voir apparaître au bon endroit sur la carte.

## Phase 2 — Confronter la démo au réel

**Objectif : vérifier que l'idée résonne avant d'investir plus loin.**

- Montrer la carte (pas le concept, l'objet qui tourne) à 2-3 personnes qui vivent le problème MES/traçabilité au quotidien
- Chercher un signal simple : est-ce que "voir son usine comme un graphe versionné" répond à une douleur réelle, ou est-ce que c'est intéressant seulement d'un point de vue technique ?
- Identifier lequel des modules manquants (`finance`, `quality`, `invoice`, `user`) serait le plus utile à démontrer ensuite, en fonction de ces retours

**Fait quand** : au moins un retour concret qui oriente la priorité de la Phase 4 (quel module développer en premier).

## Phase 3 — Fiabiliser le moteur

**Objectif : que le cœur du système survive à plus qu'un usage solo/démo.**

- Trancher explicitement la sémantique live vs figé pour les connexions `DEPENDENCY` (la Phase 1 aura déjà donné un premier signal concret sur ce que ça implique en pratique)
- Écrire des tests sur `computeSnapshot`/`createCommit` : fusion, namespacing, cas de collision de clés
- Décider d'une stratégie pour les collisions de clés de snapshot (actuellement un TODO explicite dans le code)
- Traiter le N+1 de `computeSnapshot` (un aller-retour DB par connexion, séquentiel) — seulement une fois qu'il y a une vraie charge de test issue de la Phase 1/2, pour optimiser sur des données réelles plutôt qu'en spéculant

**Fait quand** : les tests couvrent les cas de fusion connus, et la sémantique live/figé est documentée noir sur blanc (pas juste "ça marche comme ça pour l'instant").

## Phase 4 — Élargir la couverture métier

**Objectif : prouver que le modèle généralise au-delà de position/hiérarchie spatiale.**

- Développer 1-2 modules parmi `finance`/`quality`/`invoice`/`user`, en priorisant celui identifié en Phase 2
- Vérifier que le système d'attributs typés (unités, DEPENDENCY/REFERENCE) tient sans ajustement structurel majeur sur un domaine différent de la localisation spatiale

**Fait quand** : un module métier complet fonctionne de bout en bout (création, fusion, affichage) sans avoir dû retoucher le moteur central.

## Phase 5 — Requêtage analytique

**Objectif : rendre les données exploitables au-delà du "voir un objet à la fois".**

- Une fois plusieurs modules en place, la question "toutes les machines avec rpm > 1000" devient un vrai besoin plutôt qu'un risque théorique
- Explorer une stratégie de projection/read-model par module (vues matérialisées, index secondaires sur des clés fréquentes) plutôt que de scanner du JSON

**Fait quand** : au moins une requête analytique cross-process fonctionne sans scan complet de table.

## Phase 6 — Position produit & accès externe

**Objectif : passer d'un prototype solo à quelque chose qu'un tiers peut utiliser.**

- Clarifier le positionnement : probablement pas une confrontation frontale avec SAP/Siemens Opcenter/Dassault, plutôt une niche (PME sans MES du tout, ou brique de traçabilité ciblée)
- Chercher un premier design partner réel avant d'investir dans l'auth/multi-utilisateur — pas de raison de construire des rôles et permissions tant qu'il n'y a pas un second utilisateur réel en vue
- Une fois ce partenaire identifié : implémenter l'authentification (le repo a un résidu de starter `$lib/server/auth` jamais implémenté, à reprendre ou refaire proprement)

**Fait quand** : une personne extérieure au projet utilise Facto sur un cas réel, même petit.
