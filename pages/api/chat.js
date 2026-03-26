export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mode, input } = req.body;

  const VALID_MODES = ["corriger", "humanizer", "generer"];
  if (!input || !mode || !VALID_MODES.includes(mode)) {
    return res.status(400).json({ error: "Missing or invalid mode/input" });
  }

  if (input.length > 10000) {
    return res.status(400).json({ error: "Texte trop long (max 10 000 caractères)" });
  }

  const PROMPTS = {
    corriger: `Tu es un correcteur et rédacteur expert. Tu corriges les fautes d'orthographe, de grammaire et de ponctuation, et tu améliores la fluidité du texte si nécessaire — sans changer le sens ni le ton.

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de backticks) :
{
  "corrected": "texte entièrement corrigé",
  "corrections": [
    { "original": "texte original fautif exact", "fixed": "version corrigée", "note": "explication courte max 60 chars" }
  ],
  "improvements": ["liste d'améliorations de style/fluidité apportées, max 70 chars chacune"],
  "errorCount": <nombre total de corrections>
}

- Détecte la langue du texte et opère dans cette langue
- Si le texte est déjà correct, retourne corrections et improvements vides et errorCount à 0
- Les champs "original" doivent être des extraits exacts du texte fourni`,

    humanizer: `Tu es un éditeur expert. Tu supprimes tous les signes d'écriture IA et tu donnes une vraie voix humaine au texte.

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de backticks) :
{
  "patterns": ["patterns IA détectés, max 60 chars chacun"],
  "final": "version finale humanisée",
  "changes": ["changements effectués, max 70 chars chacun"]
}

Règles :
- Supprimer l'inflation de signification : "moment pivot", "testament", "paysage en évolution", "rôle vital"
- Supprimer le vocabulaire IA : "délve", "nuancé", "multifacette", "il est important de noter"
- Supprimer les attributions vagues : "les experts affirment", "les observateurs du secteur"
- Supprimer les phrases en -ant superficielles : "soulignant...", "reflétant...", "contribuant à..."
- Supprimer les structures triples et le cyclage de synonymes
- Supprimer les tirets cadratins utilisés comme pause
- Supprimer les parallélismes négatifs : "Ce n'est pas seulement X, c'est Y"
- Supprimer les artefacts de chatbot : "Bonne question !", "J'espère que cela aide !"
- Supprimer les formules génériques : "l'avenir s'annonce radieux"
- AJOUTER de la personnalité : opinions, rythme varié, détails concrets, incertitude honnête`,

    generer: `Tu es un rédacteur créatif expert. À partir d'un contexte court, tu génères 3 propositions de texte distinctes — différentes en ton, en angle et en style.

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de backticks) :
{
  "proposals": [
    { "label": "nom court du style ex: Direct, Narratif, Percutant", "text": "texte de la proposition" },
    { "label": "...", "text": "..." },
    { "label": "...", "text": "..." }
  ]
}

- Détecte la langue du contexte et génère dans cette langue
- Chaque proposition doit avoir un angle vraiment différent des autres
- Pas de langue de bois, pas de formules creuses
- Les textes doivent sonner humains dès le départ`,
  };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: PROMPTS[mode],
        messages: [{ role: "user", content: input }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.find((b) => b.type === "text")?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur API" });
  }
}
