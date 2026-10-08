import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Download, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/site/Logo";
import { api, formatApiError } from "@/lib/api";

const STATUSES = [
  ["nouveau", "Nouveau"], ["en_etude", "En étude"], ["devis_envoye", "Devis envoyé"], ["gagne", "Gagné"], ["perdu", "Perdu"],
];
const MAT = { fonte: "Fonte", acier: "Acier", aluminium: "Aluminium", autre: "Autre" };

const Login = ({ onAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onAuth(data);
    } catch (e2) {
      setErr(formatApiError(e2?.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen blueprint grid place-items-center px-5">
      <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-sm bg-white border border-line p-8 relative tick">
        <Logo />
        <h1 className="font-display font-bold text-2xl mt-8">Espace administrateur</h1>
        <p className="text-sm text-slate-600 mt-1">Consultez les demandes de devis.</p>
        <input data-testid="admin-login-email" type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-6 w-full bg-paper border border-line px-4 py-3 focus:outline-none focus:border-steel" />
        <input data-testid="admin-login-password" type="password" required placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-3 w-full bg-paper border border-line px-4 py-3 focus:outline-none focus:border-steel" />
        {err && <p data-testid="admin-login-error" className="mt-3 text-sm text-[#bf0000]">{err}</p>}
        <button data-testid="admin-login-submit" disabled={busy} className="mt-6 w-full inline-flex justify-center items-center gap-2 bg-ink text-white font-semibold py-3 rounded-full hover:bg-steel disabled:opacity-60 transition-colors">
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}Se connecter
        </button>
        <Link to="/" data-testid="admin-back-link" className="block text-center mt-4 text-sm text-slate-600 hover:text-ink">← Retour au site</Link>
      </form>
    </div>
  );
};

const toCsv = (rows) => {
  const head = ["Date", "Nom", "Entreprise", "Téléphone", "E-mail", "Matériau", "Machine", "Message", "Statut"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [head, ...rows.map((q) => [q.created_at, q.name, q.company, q.phone, q.email, MAT[q.material] || q.material, q.machine, q.message, q.status])]
    .map((r) => r.map(esc).join(";")).join("\n");
};

const Dashboard = ({ user, onLogout }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/quotes");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(formatApiError(e?.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  const shown = useMemo(() => (filter === "all" ? rows : rows.filter((r) => r.status === filter)), [rows, filter]);
  const setStatus = async (id, status) => {
    const { data } = await api.patch(`/quotes/${id}`, { status });
    setRows((r) => r.map((x) => (x.id === id ? data : x)));
    toast.success("Statut mis à jour");
  };
  const remove = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    await api.delete(`/quotes/${id}`);
    setRows((r) => r.filter((x) => x.id !== id));
  };
  const exportCsv = () => {
    const blob = new Blob(["\ufeff" + toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "demandes-devis-ow.csv";
    a.click();
  };
  return (
    <div className="min-h-screen bg-paper" data-testid="admin-dashboard">
      <header className="bg-white border-b border-line">
        <div className="mx-auto max-w-[1360px] px-5 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" data-testid="admin-home-link"><Logo /></Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-600">{user?.email}</span>
            <button data-testid="admin-logout-btn" onClick={onLogout} className="inline-flex items-center gap-2 border border-line px-4 py-2 rounded-full text-sm hover:border-ink"><LogOut className="w-4 h-4" />Déconnexion</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1360px] px-5 md:px-10 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="eyebrow">Tableau de bord</div>
            <h1 className="font-display font-bold text-3xl mt-2">Demandes de devis <span className="text-steel" data-testid="admin-quote-count">({shown.length})</span></h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger data-testid="admin-filter-select" className="w-[180px] bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
            <button data-testid="admin-refresh-btn" onClick={load} className="inline-flex items-center gap-2 border border-line bg-white px-4 py-2 rounded-full text-sm hover:border-ink"><RefreshCw className="w-4 h-4" />Actualiser</button>
            <button data-testid="admin-export-btn" onClick={exportCsv} className="inline-flex items-center gap-2 bg-ink text-white px-4 py-2 rounded-full text-sm hover:bg-steel"><Download className="w-4 h-4" />Export CSV</button>
          </div>
        </div>
        <div className="bg-white border border-line overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm" data-testid="admin-quotes-table">
            <thead className="bg-paper text-left font-mono text-[11px] uppercase tracking-[0.12em] text-slate-600">
              <tr>{["Date", "Contact", "Entreprise", "Matériau", "Machine", "Message", "Statut", ""].map((h) => <th key={h} className="px-4 py-3 font-normal">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-600"><Loader2 className="w-5 h-5 animate-spin inline" /></td></tr>}
              {!loading && shown.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-600" data-testid="admin-empty">Aucune demande pour le moment.</td></tr>}
              {!loading && shown.map((q) => (
                <tr key={q.id} className="border-t border-line align-top" data-testid={`admin-row-${q.id}`}>
                  <td className="px-4 py-4 font-mono text-xs whitespace-nowrap">{new Date(q.created_at).toLocaleString("fr-FR")}<span className="block mt-1 text-slate-500 uppercase" data-testid={`admin-lang-${q.id}`}>{q.lang || "fr"}</span></td>
                  <td className="px-4 py-4"><div className="font-semibold text-ink">{q.name}</div><a href={`mailto:${q.email}`} className="block text-steel">{q.email}</a><a href={`tel:${q.phone}`} className="block font-mono text-xs text-slate-600">{q.phone}</a></td>
                  <td className="px-4 py-4">{q.company}</td>
                  <td className="px-4 py-4">{MAT[q.material] || q.material}</td>
                  <td className="px-4 py-4 font-mono">{q.machine || "—"}</td>
                  <td className="px-4 py-4 max-w-[260px] text-slate-600">{q.message || "—"}</td>
                  <td className="px-4 py-4">
                    <Select value={q.status} onValueChange={(v) => setStatus(q.id, v)}>
                      <SelectTrigger data-testid={`admin-status-${q.id}`} className="w-[150px] h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-4"><button data-testid={`admin-delete-${q.id}`} onClick={() => remove(q.id)} className="p-2 text-slate-500 hover:text-[#bf0000]" aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default function Admin() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    api.get("/auth/me").then(({ data }) => setUser(data)).catch(() => setUser(false));
  }, []);
  const logout = async () => {
    await api.post("/auth/logout").catch(() => null);
    setUser(false);
  };
  if (user === null) return <div className="min-h-screen grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-steel" /></div>;
  if (!user) return <Login onAuth={setUser} />;
  return <Dashboard user={user} onLogout={logout} />;
}
