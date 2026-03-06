import { useState, useRef, useEffect } from "react";

const STREAM_URL = "https://stream.zeno.fm/yn65fsaurfhvv"; // Rádio teste - substituir pela URL do cliente
const AZURACAST_API = "https://de1.api.radio-browser.info/json/stations/byname/jovem%20pan";
const LOGO_URL = null;

const PROGRAMACAO = [
  { hora: "06:00", programa: "Manhã Light", apresentador: "Carlos Mendes", ao_vivo: false },
  { hora: "08:00", programa: "Café com Música", apresentador: "Ana Paula", ao_vivo: true },
  { hora: "10:00", programa: "Hits do Momento", apresentador: "DJ Rafael", ao_vivo: false },
  { hora: "12:00", programa: "Almoço Especial", apresentador: "Marina Costa", ao_vivo: false },
  { hora: "14:00", programa: "Tarde Romântica", apresentador: "João Victor", ao_vivo: false },
  { hora: "16:00", programa: "Rush Hour", apresentador: "Fernanda Lima", ao_vivo: false },
  { hora: "18:00", programa: "Noite Light", apresentador: "Pedro Alves", ao_vivo: false },
  { hora: "21:00", programa: "Lounge Night", apresentador: "Beatriz Rocha", ao_vivo: false },
];

const NOTICIAS = [
  { id: 1, tipo: "noticia", titulo: "Novo álbum de Ivete Sangalo chega às plataformas", tempo: "2h atrás", desc: "A cantora baiana lança seu 15º álbum de estúdio com participações especiais de grandes nomes da música brasileira." },
  { id: 2, tipo: "podcast", titulo: "Papo de Músico - Ep. 42: A Evolução do Samba", tempo: "1 dia atrás", desc: "Neste episódio conversamos com grandes nomes do samba carioca sobre a evolução do ritmo ao longo das décadas.", duracao: "48 min" },
  { id: 3, tipo: "noticia", titulo: "Festival de Verão anuncia line-up completo", tempo: "3h atrás", desc: "O maior festival de música do Rio de Janeiro confirma mais de 30 artistas nacionais e internacionais." },
  { id: 4, tipo: "podcast", titulo: "Música & Memória - Ep. 15: Jovem Guarda", tempo: "2 dias atrás", desc: "Uma viagem no tempo revisitando os maiores sucessos e curiosidades da Jovem Guarda dos anos 60.", duracao: "35 min" },
  { id: 5, tipo: "noticia", titulo: "Roberto Carlos confirma shows em 2025", tempo: "5h atrás", desc: "O Rei da música brasileira anuncia turnê nacional com 20 cidades no próximo ano." },
];

const CHAT_INICIAL = [
  { id: 1, user: "Maria S.", msg: "Que música incrível! 🎵", time: "14:32" },
  { id: 2, user: "João P.", msg: "Bom dia! Ouvindo do Rio 👋", time: "14:33" },
  { id: 3, user: "Ana Lima", msg: "Manda um salve pra galera de Niterói!!", time: "14:35" },
];

const DARK = {
  bg: "#111113", surface: "#1c1c1f", surfaceHover: "#242428",
  border: "rgba(255,255,255,0.07)", text: "#f2f2f3",
  textSub: "rgba(255,255,255,0.4)", textMuted: "rgba(255,255,255,0.2)",
  accent: "#6d57f0", accentLight: "rgba(109,87,240,0.12)", accentBorder: "rgba(109,87,240,0.25)",
  input: "#1c1c1f", inputBorder: "rgba(255,255,255,0.09)",
  header: "rgba(17,17,19,0.94)", live: "#22c55e",
  liveBg: "rgba(34,197,94,0.08)", liveBorder: "rgba(34,197,94,0.2)",
  shadow: "0 1px 4px rgba(0,0,0,0.5)",
};
const LIGHT = {
  bg: "#f5f5f7", surface: "#ffffff", surfaceHover: "#f9f9fb",
  border: "rgba(0,0,0,0.07)", text: "#111113",
  textSub: "rgba(0,0,0,0.45)", textMuted: "rgba(0,0,0,0.25)",
  accent: "#5b46e0", accentLight: "rgba(91,70,224,0.07)", accentBorder: "rgba(91,70,224,0.18)",
  input: "#f5f5f7", inputBorder: "rgba(0,0,0,0.09)",
  header: "rgba(245,245,247,0.94)", live: "#16a34a",
  liveBg: "rgba(22,163,74,0.07)", liveBorder: "rgba(22,163,74,0.18)",
  shadow: "0 1px 3px rgba(0,0,0,0.07)",
};

// SVG Icons
const I = {
  home: <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  cal: <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  news: <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a4 4 0 01-4-4V6"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/></svg>,
  chat: <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  menu: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  moon: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  sun: <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  chevron: <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  play: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause: <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  vol: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>,
  globe: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  lock: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  mic: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
};

const FBIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
const IGIcon = () => <svg viewBox="0 0 24 24" width="20" height="20"><defs><linearGradient id="ig1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs><path fill="url(#ig1)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const YTIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
const XIcon = ({ color }) => <svg viewBox="0 0 24 24" width="18" height="18" fill={color || "currentColor"}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const WAIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.28 7.04L.787 23.25l4.338-1.379A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.371l-.36-.214-3.716 1.18 1.234-3.618-.234-.373A9.818 9.818 0 1112 21.818z"/></svg>;

export default function RadioApp() {
  const [dark, setDark] = useState(true);
  const [aba, setAba] = useState("home");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [chatMsg, setChatMsg] = useState("");
  const [chatNome, setChatNome] = useState("");
  const [mensagens, setMensagens] = useState(CHAT_INICIAL);
  const [menuAberto, setMenuAberto] = useState(false);
  const [ouvintes, setOuvintes] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [filtro, setFiltro] = useState("Tudo");
  const audioRef = useRef(null);
  const chatEndRef = useRef(null);
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(AZURACAST_API);
        const data = await res.json();
        if (!Array.isArray(data)) {
          setOuvintes(data.listeners?.current ?? null);
          const s = data.now_playing?.song;
          if (s) setNowPlaying({ titulo: s.title, artista: s.artist, capa: s.art });
        } else {
          const s = data[0];
          if (s) { setOuvintes(s.clickcount ? parseInt(s.clickcount) : null); setNowPlaying({ titulo: s.name, artista: s.tags || "Ao vivo", capa: s.favicon }); }
        }
      } catch (e) {}
    };
    fetch_(); const iv = setInterval(fetch_, 30000); return () => clearInterval(iv);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensagens]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
    setPlaying(!playing);
  };

  const enviarMsg = () => {
    if (!chatMsg.trim()) return;
    setMensagens(prev => [...prev, { id: Date.now(), user: chatNome.trim() || "Ouvinte", msg: chatMsg.trim(), time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatMsg("");
  };

  const progAtual = PROGRAMACAO.find(p => { const h = parseInt(p.hora), now = new Date().getHours(); return h <= now && now < h + 2; }) || PROGRAMACAO[1];
  const noticiasFiltradas = NOTICIAS.filter(n => filtro === "Tudo" || (filtro === "Notícias" && n.tipo === "noticia") || (filtro === "Podcasts" && n.tipo === "podcast"));
  const card = { background: T.surface, borderRadius: 14, padding: "14px 16px", border: `1px solid ${T.border}`, boxShadow: T.shadow };

  return (
    <div style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif", background: T.bg, minHeight: "100vh", color: T.text, maxWidth: 430, margin: "0 auto", position: "relative", transition: "background 0.25s, color 0.25s" }}>
      <audio ref={audioRef} src={STREAM_URL} preload="none" />

      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: T.header, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setMenuAberto(true)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}>{I.menu}</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: "hidden", background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            {LOGO_URL ? <img src={LOGO_URL} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📻"}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Light FM Rio</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.live }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.live, display: "inline-block", animation: "blink 1.8s infinite" }} />
              AO VIVO
            </div>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.textSub, cursor: "pointer", padding: "5px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
          {dark ? I.sun : I.moon} {dark ? "Claro" : "Escuro"}
        </button>
      </header>

      {/* MENU */}
      {menuAberto && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }} onClick={() => setMenuAberto(false)}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 272, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflowY: "auto", transition: "background 0.25s" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${T.border}`, position: "relative" }}>
              <button onClick={() => setMenuAberto(false)} style={{ position: "absolute", top: 14, right: 14, background: T.bg, border: `1px solid ${T.border}`, color: T.textSub, width: 28, height: 28, borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✕</button>
              <div style={{ width: 54, height: 54, borderRadius: 15, overflow: "hidden", background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>
                {LOGO_URL ? <img src={LOGO_URL} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📻"}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Light FM Rio</div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>lightfm@gmail.com</div>
              {ouvintes !== null && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, background: T.liveBg, border: `1px solid ${T.liveBorder}`, borderRadius: 20, padding: "3px 10px" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.live, display: "inline-block", animation: "blink 1.8s infinite" }} />
                  <span style={{ fontSize: 11, color: T.live, fontWeight: 700 }}>{ouvintes.toLocaleString("pt-BR")} ouvindo</span>
                </div>
              )}
            </div>

            <div style={{ padding: "10px 10px 0" }}>
              {[
                { icon: I.home, label: "Início", action: () => { setAba("home"); setMenuAberto(false); } },
                { icon: I.globe, label: "Site Oficial", action: () => {} },
                { icon: <WAIcon />, label: "WhatsApp", action: () => {} },
              ].map((item, i) => (
                <button key={i} onClick={item.action} style={{ width: "100%", background: "none", border: "none", color: T.text, padding: "11px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontSize: 14, fontWeight: 500, borderRadius: 10, marginBottom: 2 }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <span style={{ color: T.textSub }}>{item.icon}</span>
                  {item.label}
                  <span style={{ marginLeft: "auto", color: T.textMuted }}>{I.chevron}</span>
                </button>
              ))}
            </div>

            <div style={{ padding: "14px 10px 12px" }}>
              <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, paddingLeft: 12 }}>Redes Sociais</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Facebook", icon: <FBIcon /> },
                  { label: "Instagram", icon: <IGIcon /> },
                  { label: "YouTube", icon: <YTIcon /> },
                  { label: "Twitter / X", icon: <XIcon color={T.text} /> },
                ].map((s, i) => (
                  <button key={i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 6px", cursor: "pointer", color: T.textSub, fontSize: 12, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = T.bg}>
                    {s.icon}
                    <span style={{ color: T.text }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "auto", padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
              <button style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                {I.lock} Termos de Uso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAYER */}
      <div style={{ margin: "14px 14px 0", ...card }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 62, height: 62, borderRadius: 12, flexShrink: 0, background: T.accentLight, border: `1px solid ${T.accentBorder}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            {nowPlaying?.capa ? <img src={nowPlaying.capa} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} /> : "🎵"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Tocando agora</div>
            <div style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nowPlaying?.titulo || progAtual.programa}</div>
            <div style={{ fontSize: 12, color: T.textSub, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              {I.mic} {nowPlaying?.artista || `com ${progAtual.apresentador}`}
            </div>
            {ouvintes !== null && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, background: T.liveBg, border: `1px solid ${T.liveBorder}`, borderRadius: 20, padding: "2px 8px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.live, display: "inline-block", animation: "blink 1.8s infinite" }} />
                <span style={{ fontSize: 10, color: T.live, fontWeight: 700 }}>{ouvintes.toLocaleString("pt-BR")} ouvindo</span>
              </div>
            )}
          </div>
          <button onClick={togglePlay} style={{ width: 50, height: 50, borderRadius: 14, border: "none", cursor: "pointer", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 14px ${T.accent}35`, transition: "all 0.2s" }}>
            {playing ? I.pause : I.play}
          </button>
        </div>

        {playing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, marginTop: 14, height: 18, justifyContent: "center" }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} style={{ width: 2.5, borderRadius: 2, background: T.accent, opacity: 0.5, animation: `wave ${0.35 + (i % 6) * 0.1}s ease-in-out infinite alternate`, animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: playing ? 12 : 16 }}>
          <span style={{ color: T.textMuted }}>{I.vol}</span>
          <input type="range" min="0" max="100" value={volume}
            onChange={e => { setVolume(e.target.value); if (audioRef.current) audioRef.current.volume = e.target.value / 100; }}
            style={{ flex: 1, accentColor: T.accent, cursor: "pointer" }} />
          <span style={{ fontSize: 10, color: T.textMuted, width: 26, textAlign: "right" }}>{volume}%</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", margin: "10px 14px 0", background: T.surface, borderRadius: 12, padding: 4, border: `1px solid ${T.border}` }}>
        {[{ id: "home", icon: I.home, label: "Início" }, { id: "programacao", icon: I.cal, label: "Grade" }, { id: "noticias", icon: I.news, label: "Notícias" }, { id: "chat", icon: I.chat, label: "Chat" }].map(item => (
          <button key={item.id} onClick={() => setAba(item.id)} style={{ flex: 1, padding: "7px 4px", border: "none", cursor: "pointer", borderRadius: 9, fontSize: 10, fontWeight: 600, background: aba === item.id ? T.accent : "transparent", color: aba === item.id ? "#fff" : T.textSub, transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "12px 14px 32px" }}>

        {aba === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSub, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>Programação de hoje</div>
              {PROGRAMACAO.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.ao_vivo ? T.accent : T.textMuted, minWidth: 40 }}>{p.hora}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.programa}</div>
                    <div style={{ fontSize: 11, color: T.textSub, marginTop: 1 }}>{p.apresentador}</div>
                  </div>
                  {p.ao_vivo && <span style={{ fontSize: 9, fontWeight: 800, background: T.liveBg, color: T.live, border: `1px solid ${T.liveBorder}`, padding: "2px 7px", borderRadius: 6, letterSpacing: 0.5 }}>AO VIVO</span>}
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.textSub, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 }}>Siga a gente</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ label: "Facebook", icon: <FBIcon /> }, { label: "Instagram", icon: <IGIcon /> }, { label: "YouTube", icon: <YTIcon /> }, { label: "Twitter / X", icon: <XIcon color={T.text} /> }].map((s, i) => (
                  <button key={i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 8px", cursor: "pointer", color: T.text, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 9, justifyContent: "center" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = T.bg}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {aba === "programacao" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.textSub, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Grade semanal</div>
            {PROGRAMACAO.map((p, i) => (
              <div key={i} style={{ ...card, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, borderLeft: `3px solid ${p.ao_vivo ? T.accent : T.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.ao_vivo ? T.accent : T.textMuted, minWidth: 44 }}>{p.hora}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.programa}</div>
                  <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{p.apresentador}</div>
                </div>
                {p.ao_vivo && <span style={{ fontSize: 9, fontWeight: 800, background: T.liveBg, color: T.live, border: `1px solid ${T.liveBorder}`, padding: "2px 7px", borderRadius: 6 }}>AO VIVO</span>}
              </div>
            ))}
          </div>
        )}

        {aba === "noticias" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["Tudo", "Notícias", "Podcasts"].map(f => (
                <button key={f} onClick={() => setFiltro(f)} style={{ padding: "5px 14px", borderRadius: 20, border: `1px solid ${filtro === f ? T.accent : T.border}`, background: filtro === f ? T.accentLight : "transparent", color: filtro === f ? T.accent : T.textSub, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>{f}</button>
              ))}
            </div>
            {noticiasFiltradas.map(item => (
              <div key={item.id} style={{ ...card, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = T.surface}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 7, gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, background: T.accentLight, color: T.accent, border: `1px solid ${T.accentBorder}`, padding: "2px 7px", borderRadius: 6, letterSpacing: 0.5 }}>
                    {item.tipo === "podcast" ? "PODCAST" : "NOTÍCIA"}
                  </span>
                  <span style={{ fontSize: 11, color: T.textMuted, marginLeft: "auto" }}>{item.tempo}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.35, marginBottom: 5 }}>{item.titulo}</div>
                <div style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>{item.desc.slice(0, 90)}...</div>
                {item.duracao && <div style={{ fontSize: 11, color: T.accent, marginTop: 8, fontWeight: 600 }}>▶ {item.duracao}</div>}
              </div>
            ))}
          </div>
        )}

        {aba === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: T.liveBg, borderRadius: 10, padding: "8px 14px", border: `1px solid ${T.liveBorder}`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.live, display: "inline-block", animation: "blink 1.8s infinite" }} />
              <span style={{ fontSize: 12, color: T.live, fontWeight: 700 }}>
                {ouvintes !== null ? `${ouvintes.toLocaleString("pt-BR")} ouvintes online` : `${mensagens.length + 42} ouvintes online`}
              </span>
            </div>

            <div style={{ ...card, padding: 12, height: 290, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {mensagens.map(m => (
                <div key={m.id} style={{ display: "flex", gap: 9 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: T.accentLight, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent }}>
                    {m.user[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 7, alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{m.user}</span>
                      <span style={{ fontSize: 10, color: T.textMuted }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.textSub, marginTop: 1, lineHeight: 1.4 }}>{m.msg}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <input value={chatNome} onChange={e => setChatNome(e.target.value)} placeholder="Seu nome (opcional)"
              style={{ background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && enviarMsg()} placeholder="Mande um salve! 👋"
                style={{ flex: 1, background: T.input, border: `1px solid ${T.inputBorder}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, outline: "none" }} />
              <button onClick={enviarMsg} style={{ background: T.accent, border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", fontSize: 16, cursor: "pointer" }}>➤</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wave { 0% { height: 3px; } 100% { height: 18px; } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.15); border-radius: 4px; }
        input::placeholder { color: rgba(128,128,128,0.35); }
        button:active { opacity: 0.72; }
      `}</style>
    </div>
  );
}
