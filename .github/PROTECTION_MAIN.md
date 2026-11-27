# Protection de la branche main

Ce document décrit la protection à appliquer sur `main`. Rien n'est appliqué sur GitHub par ce fichier : l'application se fait après validation de l'équipe.

Fichier de configuration associé : `.github/protection-main.json` (corps de la requête de l'API REST).

## Réglages

| Réglage | Valeur | Raison |
| --- | --- | --- |
| Push direct sur `main` | Interdit | Chaque changement passe par une pull request |
| Pull request obligatoire | Oui | Fusion uniquement par PR relue (dossier de conception §10) |
| Approbations requises | 1 | Une relecture au minimum avant fusion |
| Approbations périmées | Annulées à chaque nouveau commit | Une relecture porte sur le code relu |
| Dernier push approuvé | Oui | Le dernier commit doit aussi être relu |
| Checks requis | `Tests & Coverage`, à jour avant fusion | Tests du backend Rust (`rust-tests.yml`) |
| Conversations résolues | Oui | Aucune remarque de revue ne reste ouverte |
| Force push | Interdit | Pas de réécriture de l'historique partagé |
| Suppression de `main` | Interdite | Protection contre la suppression accidentelle |
| Historique linéaire | Non | L'historique actuel contient des commits de fusion (`Merge pull request #...`) |
| Restrictions de push | Aucune (`null`) | Pas d'équipe ni d'app à autoriser, les règles ci-dessus suffisent |
| Propriétaires de code (CODEOWNERS) | Non | Aucun fichier CODEOWNERS dans le dépôt |
| Administrateurs soumis aux règles | Oui | Sans cela, un administrateur contourne la revue |

## Checks à ajouter plus tard

Le dossier de conception (§10) prévoit ces contrôles sur les pull requests. Aucun n'existe encore dans `.github/workflows/` : ils ne doivent être ajoutés à la liste des checks requis qu'une fois leur workflow en place et vert sur une PR, sinon toutes les PR restent bloquées.

- `cargo clippy`
- `cargo fmt --check`
- lint du front-end SvelteKit
- détection de secrets sur chaque pull request

`deploy.yml` ne se déclenche que manuellement (`workflow_dispatch`) : ce n'est pas un check de PR et il ne doit pas être requis.

## Points à trancher avant application

1. **Dépôt cible.** `origin` pointe vers `TuroYT/GreenScorePlugin-Open`, un fork, et `upstream` vers `green-score-plugin/GreenScorePlugin-Rust-Svelte`. Le dépôt à protéger doit être choisi. Le fichier JSON ne contient aucun nom de dépôt : il s'applique à celui qu'on désigne.
2. **Administrateurs et revue à un seul relecteur.** Avec `enforce_admins` à `true` et une approbation requise, l'auteur d'une PR ne peut pas l'approuver lui-même : il faut un second membre disponible. Si l'équipe préfère qu'un administrateur puisse fusionner seul, passer `enforce_admins` à `false`.
3. **Actions actives.** Vérifier que les workflows tournent sur le dépôt cible avant de rendre `Tests & Coverage` requis. Au moment de la rédaction, les Actions sont activées sur `TuroYT/GreenScorePlugin-Open` et le workflow `Tests Backend Rust` est actif.

## Application (après validation uniquement)

Remplacer `OWNER/REPO` par le dépôt choisi, puis lancer depuis la racine du dépôt :

```bash
gh api --method PUT repos/OWNER/REPO/branches/main/protection --input .github/protection-main.json
```

Vérifier ensuite :

```bash
gh api repos/OWNER/REPO/branches/main/protection --jq '{checks: .required_status_checks.contexts, reviews: .required_pull_request_reviews.required_approving_review_count, admins: .enforce_admins.enabled}'
```

Test conseillé : ouvrir une PR de test sans l'approuver et vérifier que le bouton de fusion reste bloqué. Ne pas tester par un push direct sur `main`.

## Annulation

```bash
gh api --method DELETE repos/OWNER/REPO/branches/main/protection
```
