import { useState, useRef } from "react";

const PLACEHOLDERS = {
  corriger:  "Colle ton texte ici — fautes d'orthographe, de grammaire, de ponctuation, tout sera corrigé et amélioré si besoin.",
  humanizer: "Colle ici un texte généré par IA. L'outil va détecter les patterns typiques et le réécrire avec une vraie voix humaine.",
  generer:   "Décris en une phrase ce que tu veux générer.\n\nEx : « email de relance client, ton professionnel mais chaleureux »\nEx : « bio courte pour profil DJ sur Instagram, style direct et cool »\nEx : « description d'une fonctionnalité SaaS pour une landing page »",
};

const LOADING_MSGS = {
  corriger:  ["Lecture du texte…", "Chasse aux fautes…", "Vérification finale…"],
  humanizer: ["Scan des patterns IA…", "Extraction du slop…", "Réinjection de l'âme…"],
  generer:   ["Analyse du contexte…", "Génération des variantes…", "Mise en forme…"],
};

const MODE_CONFIG = {
  corriger:  { label: "Corriger",  cta: "Corriger →",  accent: "#2a7a4a", accentLight: "#edf7f1", accentMid: "#c6e8d4", accentText: "#1a5c36" },
  humanizer: { label: "Humanizer", cta: "Humaniser →", accent: "#c05a1a", accentLight: "#fdf3ec", accentMid: "#f5d4b8", accentText: "#9a3e0e" },
  generer:   { label: "Générer",   cta: "Générer →",   accent: "#3a5ab0", accentLight: "#eef1fb", accentMid: "#c4ccf0", accentText: "#2a3e8a" },
};

export default function Writr() {
  const [mode, setMode]             = useState("corriger");
  const [input, setInput]           = useState("");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError]           = useState(null);
  const [copiedIdx, setCopiedIdx]   = useState(null);
  const [selectedP, setSelectedP]   = useState(0);
  const intervalRef                 = useRef(null);

  const cfg = MODE_CONFIG[mode];

  const switchMode = (m) => { setMode(m); setInput(""); setResult(null); setError(null); setSelectedP(0); };

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setError(null); setSelectedP(0);
    let i = 0;
    const msgs = LOADING_MSGS[mode];
    setLoadingMsg(msgs[0]);
    intervalRef.current = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMsg(msgs[i]); }, 1800);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch {
      setError("Une erreur est survenue. Réessaie avec un texte plus long.");
    } finally {
      clearInterval(intervalRef.current);
      setLoading(false);
    }
  };

  const copy = (text, idx = 0) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const wc = (t) => t?.trim().split(/\s+/).filter(Boolean).length ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1a1a1a", fontFamily: "'Georgia', serif" }}>

      {/* HEADER */}
      <header style={{ padding: "18px 36px", borderBottom: "1.5px solid #e8e8e8",
        display: "flex", alignItems: "center", gap: "16px", background: "#fff" }}>
        <div>
          <div style={{ fontSize: "9px", letterSpacing: "0.28em", color: "#bbb",
            fontFamily: "monospace", textTransform: "uppercase" }}>Outil d'écriture</div>
          <div style={{ fontSize: "20px", letterSpacing: "0.08em", color: "#111",
            fontFamily: "monospace", fontWeight: "800" }}>WRITR</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "2px",
          background: "#f4f4f4", border: "1.5px solid #e8e8e8", borderRadius: "8px", padding: "3px" }}>
          {Object.entries(MODE_CONFIG).map(([id, c]) => (
            <button key={id} onClick={() => switchMode(id)} style={{
              padding: "7px 18px",
              background: mode === id ? c.accent : "transparent",
              color: mode === id ? "#fff" : "#888",
              border: "none", borderRadius: "6px",
              fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "monospace", cursor: "pointer",
              fontWeight: mode === id ? "700" : "400", transition: "all 0.15s",
            }}>{c.label}</button>
          ))}
        </div>
      </header>

      <main style={{ padding: "32px 36px", maxWidth: "960px" }}>
        <div style={{ fontSize: "12px", color: "#aaa", fontStyle: "italic",
          marginBottom: "22px", fontFamily: "monospace" }}>
          {mode === "corriger"  && "— corrige l'orthographe, la grammaire et améliore la fluidité"}
          {mode === "humanizer" && "— détecte les patterns IA et réécrit avec une vraie voix"}
          {mode === "generer"   && "— décris un contexte, reçois 3 propositions avec des styles différents"}
        </div>

        {/* TEXTAREA */}
        <div style={{ marginBottom: "16px" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) run(); }}
            placeholder={PLACEHOLDERS[mode]}
            style={{
              width: "100%", minHeight: mode === "generer" ? "110px" : "150px",
              background: "#fafafa", border: "1.5px solid #e4e4e4", borderRadius: "8px",
              color: "#222", fontFamily: "'Georgia', serif", fontSize: "15px",
              lineHeight: "1.75", padding: "16px", resize: "vertical",
              outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = cfg.accent}
            onBlur={(e)  => e.target.style.borderColor = "#e4e4e4"}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "#ccc", fontFamily: "monospace" }}>
              {input.trim() ? `${wc(input)} mots` : "⌘ + Entrée pour lancer"}
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {input && (
                <button onClick={() => { setInput(""); setResult(null); setError(null); }} style={{
                  padding: "8px 16px", background: "#fff", border: "1.5px solid #e4e4e4",
                  borderRadius: "6px", color: "#aaa", fontSize: "11px", letterSpacing: "0.08em",
                  textTransform: "uppercase", fontFamily: "monospace", cursor: "pointer",
                }}>Effacer</button>
              )}
              <button onClick={run} disabled={loading || !input.trim()} style={{
                padding: "8px 24px",
                background: loading || !input.trim() ? "#f0f0f0" : cfg.accent,
                color: loading || !input.trim() ? "#bbb" : "#fff",
                border: "none", borderRadius: "6px",
                fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "monospace", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontWeight: "700", transition: "all 0.15s",
              }}>
                {loading ? loadingMsg : cfg.cta}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "#fff5f5", border: "1.5px solid #fccaca",
            borderRadius: "6px", color: "#c03030", fontSize: "12px", fontFamily: "monospace",
            marginBottom: "20px" }}>{error}</div>
        )}

        {/* ══ CORRIGER ══ */}
        {result && mode === "corriger" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              <Pill color={result.errorCount === 0 ? "#2a7a4a" : "#c05a1a"}
                bg={result.errorCount === 0 ? "#edf7f1" : "#fdf3ec"}
                border={result.errorCount === 0 ? "#c6e8d4" : "#f5d4b8"}>
                {result.errorCount === 0 ? "✓ Aucune faute" : `${result.errorCount} correction${result.errorCount > 1 ? "s" : ""}`}
              </Pill>
              {result.improvements?.length > 0 && (
                <Pill color="#3a5ab0" bg="#eef1fb" border="#c4ccf0">
                  {result.improvements.length} amélioration{result.improvements.length > 1 ? "s" : ""}
                </Pill>
              )}
            </div>

            <SectionLabel color={cfg.accentText}>Texte corrigé</SectionLabel>
            <div style={{ padding: "20px", background: cfg.accentLight, border: `1.5px solid ${cfg.accentMid}`,
              borderRadius: "8px", fontSize: "15px", lineHeight: "1.85", color: "#1a1a1a",
              whiteSpace: "pre-wrap", marginBottom: "8px" }}>{result.corrected}</div>
            <CopyBar onCopy={() => copy(result.corrected)} copied={copiedIdx === 0} accent={cfg.accent} wc={wc(result.corrected)} />

            {result.corrections?.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <SectionLabel>Corrections</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {result.corrections.map((c, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr",
                      alignItems: "start", gap: "8px", padding: "10px 14px",
                      background: "#fafafa", border: "1.5px solid #efefef", borderRadius: "6px" }}>
                      <span style={{ fontSize: "13px", color: "#c03030",
                        textDecoration: "line-through", fontFamily: "monospace", wordBreak: "break-word" }}>{c.original}</span>
                      <span style={{ color: "#ccc", fontSize: "12px", textAlign: "center", paddingTop: "2px" }}>→</span>
                      <div>
                        <span style={{ fontSize: "13px", color: "#2a7a4a", fontFamily: "monospace", wordBreak: "break-word" }}>{c.fixed}</span>
                        {c.note && <div style={{ fontSize: "11px", color: "#aaa", fontStyle: "italic", marginTop: "3px" }}>{c.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.improvements?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <SectionLabel>Améliorations de style</SectionLabel>
                {result.improvements.map((imp, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "7px 10px",
                    background: i % 2 === 0 ? "#fafafa" : "transparent",
                    borderRadius: "4px", fontSize: "13px", color: "#666" }}>
                    <span style={{ color: "#ddd" }}>◦</span>{imp}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ HUMANIZER ══ */}
        {result && mode === "humanizer" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            {result.patterns?.length > 0 && (
              <div style={{ marginBottom: "22px" }}>
                <SectionLabel>{result.patterns.length} pattern{result.patterns.length > 1 ? "s" : ""} IA détecté{result.patterns.length > 1 ? "s" : ""}</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {result.patterns.map((p, i) => (
                    <span key={i} style={{ padding: "4px 12px", background: cfg.accentLight,
                      border: `1.5px solid ${cfg.accentMid}`, borderRadius: "4px",
                      fontSize: "11px", color: cfg.accentText, fontFamily: "monospace" }}>◈ {p}</span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
              <div>
                <SectionLabel color="#bbb">Avant</SectionLabel>
                <div style={{ padding: "16px", background: "#fafafa", border: "1.5px solid #ebebeb",
                  borderRadius: "8px", fontSize: "14px", lineHeight: "1.75", color: "#aaa", whiteSpace: "pre-wrap" }}>{input}</div>
              </div>
              <div>
                <SectionLabel color={cfg.accentText}>Après</SectionLabel>
                <div style={{ padding: "16px", background: cfg.accentLight, border: `1.5px solid ${cfg.accentMid}`,
                  borderRadius: "8px", fontSize: "14px", lineHeight: "1.75", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>{result.final}</div>
              </div>
            </div>
            <CopyBar onCopy={() => copy(result.final)} copied={copiedIdx === 0} accent={cfg.accent} wc={wc(result.final)} />
            {result.changes?.length > 0 && (
              <div style={{ marginTop: "22px" }}>
                <SectionLabel>Changements effectués</SectionLabel>
                {result.changes.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "7px 10px",
                    background: i % 2 === 0 ? "#fafafa" : "transparent",
                    borderRadius: "4px", fontSize: "13px", color: "#777" }}>
                    <span style={{ color: "#ddd" }}>–</span>{c}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ GÉNÉRER ══ */}
        {result && mode === "generer" && (
          <div style={{ animation: "fadeUp 0.3s ease" }}>
            <SectionLabel>3 propositions générées</SectionLabel>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
              {result.proposals?.map((p, i) => (
                <button key={i} onClick={() => setSelectedP(i)} style={{
                  padding: "7px 18px",
                  background: selectedP === i ? cfg.accent : "#fff",
                  color: selectedP === i ? "#fff" : "#888",
                  border: `1.5px solid ${selectedP === i ? cfg.accent : "#e4e4e4"}`,
                  borderRadius: "6px", fontSize: "11px", letterSpacing: "0.1em",
                  textTransform: "uppercase", fontFamily: "monospace",
                  cursor: "pointer", fontWeight: selectedP === i ? "700" : "400", transition: "all 0.15s",
                }}>{p.label}</button>
              ))}
            </div>
            {result.proposals?.[selectedP] && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ padding: "22px", background: cfg.accentLight, border: `1.5px solid ${cfg.accentMid}`,
                  borderRadius: "8px", fontSize: "15px", lineHeight: "1.85", color: "#1a1a1a", whiteSpace: "pre-wrap" }}>
                  {result.proposals[selectedP].text}
                </div>
                <CopyBar onCopy={() => copy(result.proposals[selectedP].text, selectedP)}
                  copied={copiedIdx === selectedP} accent={cfg.accent} wc={wc(result.proposals[selectedP].text)} />
              </div>
            )}
            <div style={{ borderTop: "1.5px solid #efefef", paddingTop: "20px" }}>
              <SectionLabel>Toutes les propositions</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.proposals?.map((p, i) => (
                  <div key={i} onClick={() => setSelectedP(i)} style={{
                    padding: "14px 16px",
                    background: selectedP === i ? cfg.accentLight : "#fafafa",
                    border: `1.5px solid ${selectedP === i ? cfg.accentMid : "#ebebeb"}`,
                    borderRadius: "8px", cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase",
                      fontFamily: "monospace", color: selectedP === i ? cfg.accentText : "#bbb",
                      marginBottom: "5px" }}>{p.label}</div>
                    <div style={{ fontSize: "13px", color: "#888", lineHeight: "1.6",
                      overflow: "hidden", display: "-webkit-box",
                      WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        textarea::placeholder { color: #ccc; font-style: italic; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f8f8f8; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
      `}</style>
    </div>
  );
}

function SectionLabel({ children, color = "#bbb" }) {
  return <div style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase",
    color, fontFamily: "monospace", marginBottom: "10px" }}>{children}</div>;
}

function Pill({ children, color, bg, border }) {
  return <div style={{ padding: "5px 14px", background: bg, border: `1.5px solid ${border}`,
    borderRadius: "20px", fontSize: "11px", fontFamily: "monospace", color }}>{children}</div>;
}

function CopyBar({ onCopy, copied, accent, wc }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
      <span style={{ fontSize: "11px", color: "#ccc", fontFamily: "monospace" }}>{wc} mots</span>
      <button onClick={onCopy} style={{
        padding: "6px 14px", background: "#fff",
        border: `1.5px solid ${copied ? accent : "#e4e4e4"}`, borderRadius: "6px",
        color: copied ? accent : "#aaa", fontSize: "10px", letterSpacing: "0.1em",
        textTransform: "uppercase", fontFamily: "monospace", cursor: "pointer", transition: "all 0.2s",
      }}>{copied ? "Copié ✓" : "Copier"}</button>
    </div>
  );
}
