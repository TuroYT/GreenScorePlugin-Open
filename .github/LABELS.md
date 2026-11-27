# Labels

Liste des labels proposés pour les issues et les pull requests. Rien n'est créé sur GitHub par ce fichier.

## Labels déjà présents sur le dépôt

Ces labels viennent des valeurs par défaut de GitHub. Les modèles d'issues utilisent `bug` et `enhancement`, qui existent déjà.

| Label | Usage |
| --- | --- |
| `bug` | Comportement incorrect ou plantage (utilisé par le modèle Bug) |
| `enhancement` | Nouvelle fonctionnalité ou amélioration (utilisé par le modèle Fonctionnalité) |
| `documentation` | Changement de documentation seule |
| `question` | Question sans changement de code attendu |
| `duplicate`, `invalid`, `wontfix` | Fermeture sans correction |
| `good first issue`, `help wanted` | Tâches ouvertes aux nouveaux contributeurs |
| `accessibility` | Problème d'accessibilité |

## Labels proposés à créer

| Label | Couleur suggérée | Usage |
| --- | --- | --- |
| `backend` | `#1d76db` | Changement dans l'API Rust |
| `frontend` | `#0e8a16` | Changement dans l'application SvelteKit |
| `plugin` | `#5319e7` | Changement dans le plugin navigateur |
| `base-de-donnees` | `#fbca04` | Schéma, migrations, requêtes SQL |
| `ci` | `#c5def5` | GitHub Actions, outils de contrôle |
| `dx` | `#bfdadc` | Outillage et expérience développeur (modèles, scripts, Docker Compose) |
| `securite` | `#b60205` | Faille, secret, protection des données personnelles |

Les noms n'utilisent ni accents ni espaces, pour rester simples à taper dans les filtres et les commandes.

## Création (après validation)

Commande à lancer une fois par label, en remplaçant `OWNER/REPO` :

```bash
gh label create backend --repo OWNER/REPO --color 1d76db --description "Changement dans l'API Rust"
```

Les modèles d'issues ne référencent que `bug` et `enhancement`. Les labels proposés ci-dessus ne sont donc pas nécessaires au fonctionnement des modèles : ils servent au tri et aux filtres.
