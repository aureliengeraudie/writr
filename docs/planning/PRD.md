# WRITR — Product Requirements Document

## Vision

Outil web simple et rapide pour améliorer ses textes grâce à l'IA Claude. Quatre modes complémentaires qui couvrent les besoins d'écriture quotidiens : correction, humanisation de textes IA, génération de contenu, et aide à la séduction sur les apps de rencontre. Chaque mode inclut un chat conversationnel pour itérer sur les résultats.

## Problème

- Corriger un texte manuellement est fastidieux et on rate toujours des fautes
- Les textes générés par IA sont reconnaissables (patterns, vocabulaire, structure)
- Générer du contenu varié demande plusieurs itérations
- Sur les apps de rencontre, les premières phrases d'accroche et les réponses sont cruciales et difficiles à trouver

## Utilisateurs cibles

- Rédacteurs, freelances, community managers
- Étudiants, professionnels qui écrivent au quotidien
- Toute personne utilisant de l'IA pour écrire et voulant un résultat naturel
- Utilisateurs d'apps de rencontre (Tinder, Bumble, Happn, Hinge) cherchant de l'aide pour leurs messages

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

### Mode Drague
- Spécialisé apps de rencontre (Tinder, Bumble, Happn, Hinge)
- Accepte une bio de profil, une description, ou un message reçu
- Analyse la situation et génère 3 approches différentes (taquin, curieux, bold...)
- Chaque proposition inclut une explication de pourquoi ça marche
- Tips contextuels pour la suite de la conversation
- Évite les clichés : pas de compliments physiques directs, pas de "hey ça va"
- Privilégie l'humour, la taquinerie, les questions ouvertes

### Chat conversationnel (tous les modes)
- Après chaque résultat, un chat permet d'itérer sur le texte
- L'utilisateur peut demander des modifications : "rends-le plus direct", "ajoute ça", "elle a répondu X"
- L'historique complet est envoyé à l'API pour garder le contexte
- Chaque réponse a un bouton Copier + compteur de mots

## Stack technique

| Composant | Choix |
|-----------|-------|
| Framework | Next.js (Pages Router) |
| UI | React, inline styles + CSS classes responsive |
| API LLM | Claude Sonnet 4 via API Anthropic |
| Déploiement | Vercel |

## Architecture

```
pages/index.js          → Render <Writr />
pages/api/chat.js       → API route, proxy sécurisé vers Anthropic
components/Writr.jsx    → UI complète (single component, 4 modes + chat + responsive)
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
- Les 4 modes retournent des résultats corrects
- Le chat de raffinement fonctionne sur les 4 modes
- Responsive OK sur iPhone (tous les onglets visibles)
- Temps de réponse < 10s
