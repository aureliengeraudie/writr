# WRITR — Instructions projet

## Description

Outil web d'écriture IA avec 4 modes : Corriger (orthographe/grammaire), Humanizer (dé-IA-ifier un texte), Générer (3 propositions variées), Drague (expert séduction apps de rencontre). Chaque mode inclut un chat conversationnel pour affiner les résultats. Propulsé par Claude Sonnet 4 via l'API Anthropic.

## Stack

- **Framework** : Next.js 16 (Pages Router)
- **UI** : React 18, inline styles (pas de CSS framework)
- **API** : Claude Sonnet 4 (`claude-sonnet-4-20250514`) via API REST Anthropic
- **Déploiement** : Vercel

## Structure

```
pages/index.js          → Point d'entrée, render <Writr />
pages/_app.js           → Head (meta, title, favicon) + global CSS reset
pages/api/chat.js       → API route proxy vers Anthropic (clé jamais côté client)
components/Writr.jsx    → Composant UI unique (4 modes, résultats, chat, copy)
docs/planning/PRD.md    → Product Requirements Document
```

## Conventions

- **Pas de CSS framework** : inline styles + CSS classes pour le responsive (media queries `@media max-width: 640px`)
- **Single component** : toute l'UI est dans `Writr.jsx` avec des sous-composants locaux (`SectionLabel`, `Pill`, `CopyBar`, `ChatThread`)
- **API route unique** : `/api/chat` gère les 4 modes via le champ `mode` du body + supporte `messages` pour le chat de raffinement
- **Prompts structurés** : chaque mode a son propre system prompt qui demande du JSON strict + un prompt `refine` pour le chat conversationnel
- **Responsive** : mobile-first, testé sur iPhone (header stack, grids en colonne, paddings adaptés)

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Clé API Anthropic (obligatoire) |

## Commandes

```bash
npm run dev     # Dev server sur localhost:3000
npm run build   # Build production
npm start       # Serveur production
```

## Règles

- Ne jamais exposer `ANTHROPIC_API_KEY` côté client
- Input limité à 10 000 caractères côté API
- Les 4 modes valides sont : `corriger`, `humanizer`, `generer`, `drague`
- Les réponses Claude sont parsées en JSON (avec nettoyage des backticks markdown)
- Le chat de raffinement envoie l'historique complet via le champ `messages` du body (au lieu de `input`)
