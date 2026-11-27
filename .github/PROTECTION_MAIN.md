# Protection de la branche main

Ce document décrit la protection à appliquer sur `main`. Rien n'est appliqué sur GitHub par ce fichier : l'application se fait après validation de l'équipe.

Fichier de configuration associé : `.github/protection-main.json` (corps de la requête de l'API REST).

## Réglages

| Réglage | Valeur | Raison |
| --- | --- | --- |
| Push direct sur `main` | Interdit | Chaque changement passe par une pull request |
| Pull request obligatoire | Oui | Fusion uniquement par PR relue (dossier de conception §10) |
| Approbations requises | 0 | Décision de l'équipe : la fusion se fait dès que la CI passe, sans second relecteur |
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

- compilation : déjà couverte par le job `Tests & Coverage` (la compilation précède les tests), tant qu'aucun job dédié n'existe
- `cargo clippy`
- `cargo fmt --check`
- lint du front-end SvelteKit
- détection de secrets sur chaque pull request

`deploy.yml` ne se déclenche que manuellement (`workflow_dispatch`) : ce n'est pas un check de PR et il ne doit pas être requis.

## Décisions prises

- **Dépôt cible** : `TuroYT/GreenScorePlugin-Open`.
- **Administrateurs soumis aux règles** : oui. Sans cela, le push direct sur `main` resterait possible pour le mainteneur, ce que l'équipe refuse.
- **Pas d'approbation requise** : l'auteur d'une PR peut fusionner dès que `Tests & Coverage` est vert. Le ticket §10 parle de « revue obligatoire » : cette décision l'écarte, à garder en tête si la revue doit revenir plus tard.
- **Pas de modèles d'issues** pour l'instant : les Issues restent désactivées, les formulaires d'issues ont été retirés.

## Prérequis avant application

Un check requis qui n'a jamais tourné bloque toutes les PR. Il faut donc qu'une PR vers `main` ait déclenché `Tests & Coverage` une fois, et que ce check soit vert, avant d'appliquer la protection.

## Application (après validation uniquement)

```bash
gh api --method PUT repos/TuroYT/GreenScorePlugin-Open/branches/main/protection --input .github/protection-main.json
```

Vérifier ensuite :

```bash
gh api repos/TuroYT/GreenScorePlugin-Open/branches/main/protection --jq '{checks: .required_status_checks.contexts, reviews: .required_pull_request_reviews.required_approving_review_count, admins: .enforce_admins.enabled}'
```

Test conseillé : ouvrir une PR de test, vérifier que le bouton de fusion est bloqué tant que `Tests & Coverage` n'est pas vert, puis qu'il se débloque une fois vert. Vérifier aussi qu'un push direct sur `main` est refusé. Ne pas faire ce test sur `main` lui-même si la règle n'est pas encore active.

## Annulation

```bash
gh api --method DELETE repos/OWNER/REPO/branches/main/protection
```
