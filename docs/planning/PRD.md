# WRITR — Product Requirements Document

## Vision

Outil web simple et rapide pour améliorer ses textes grâce à l'IA Claude. Trois modes complémentaires qui couvrent les besoins d'écriture quotidiens : correction, humanisation de textes IA, et génération de contenu.

## Problème

- Corriger un texte manuellement est fastidieux et on rate toujours des fautes
- Les textes générés par IA sont reconnaissables (patterns, vocabulaire, structure)
- Générer du contenu varié demande plusieurs itérations

## Utilisateurs cibles

- Rédacteurs, freelances, community managers
- Étudiants, professionnels qui écrivent au quotidien
- Toute personne utilisant de l'IA pour écrire et voulant un résultat naturel

## Fonctionnalités

### Mode Corriger
- Corrige orthographe, grammaire, ponctuation
- Améliore la fluidité sans changer le sens/ton
- Affiche le détail de chaque correction (avant → après + explication)
- Compte les erreurs et améliorations de style
- Détection automatique de la langue

### Mode Humanizer
- Détecte les patterns typiques d'écriture IA
- Réécrit le texte avec une voix humaine authentique
- Comparaison avant/après côte à côte
- Liste des patterns détectés et changements effectués

### Mode Générer
- Génère 3 propositions distinctes à partir d'un brief court
- Chaque proposition a un ton/angle/style différent
- Navigation par onglets entre les propositions
- Détection automatique de la langue du brief

## Stack technique

| Composant | Choix |
|-----------|-------|
| Framework | Next.js (Pages Router) |
| UI | React, inline styles |
| API LLM | Claude Sonnet 4 via API Anthropic |
| Déploiement | Vercel |

## Architecture

```
pages/index.js          → Render <Writr />
pages/api/chat.js       → API route, proxy sécurisé vers Anthropic
components/Writr.jsx    → UI complète (single component)
```

La clé API n'est jamais exposée côté client. L'API route sert de proxy sécurisé.

## Contraintes

- Max 10 000 caractères par requête (limite côté API)
- Max 2048 tokens de réponse Claude
- Pas d'auth (outil personnel / démo)
- Pas de stockage de données utilisateur

## Métriques de succès

- Build Next.js sans erreur
- Déploiement Vercel fonctionnel
- Les 3 modes retournent des résultats corrects
- Temps de réponse < 10s
