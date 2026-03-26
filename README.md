# WRITR

Outil d'écriture propulsé par Claude — 3 modes : Corriger, Humanizer, Générer.

---

## Déploiement sur Vercel (5 minutes)

### 1. Récupère ta clé API Anthropic
Va sur https://console.anthropic.com → API Keys → Create Key
Copie la clé (commence par `sk-ant-...`)

### 2. Push le projet sur GitHub
```bash
git init
git add .
git commit -m "init writr"
git remote add origin https://github.com/TON_USERNAME/writr.git
git push -u origin main
```

### 3. Déploie sur Vercel
- Va sur https://vercel.com
- "Add New Project" → importe ton repo GitHub
- Dans **Environment Variables**, ajoute :
  - Name : `ANTHROPIC_API_KEY`
  - Value : ta clé `sk-ant-...`
- Clique **Deploy**

C'est tout. Vercel te donne une URL publique du style `writr-xxx.vercel.app`.

---

## Développement local

```bash
cp .env.example .env.local
# Édite .env.local et colle ta clé API

npm install
npm run dev
# → http://localhost:3000
```

---

## Structure

```
writr/
├── pages/
│   ├── index.js          # Page principale
│   └── api/
│       └── chat.js       # Route API sécurisée (clé jamais exposée côté client)
├── components/
│   └── Writr.jsx         # Composant UI complet
├── .env.example          # Template variables d'environnement
└── package.json
```
