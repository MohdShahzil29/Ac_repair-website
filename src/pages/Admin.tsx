import { FormEvent, useEffect, useMemo, useState } from "react";
import { Lock, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clearSubmissions,
  fetchSubmissions,
  type AdminCredentials,
  type BookingSubmission,
} from "@/lib/submissions";

const SESSION_KEY = "ac-repair-admin-session";

const adminId = import.meta.env.VITE_ADMIN_ID ?? "admin";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin123";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const readSession = (): AdminCredentials | null => {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as AdminCredentials) : null;
  } catch {
    return null;
  }
};

const Admin = () => {
  const [credentials, setCredentials] = useState<AdminCredentials | null>(() => readSession());
  const [login, setLogin] = useState({ id: "", password: "" });
  const [submissions, setSubmissions] = useState<BookingSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return submissions.filter((item) => new Date(item.submittedAt).toDateString() === today).length;
  }, [submissions]);

  const loadSubmissions = async (creds: AdminCredentials) => {
    setIsLoading(true);
    try {
      const data = await fetchSubmissions(creds);
      setSubmissions(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (credentials) {
      void loadSubmissions(credentials);
    }
  }, [credentials]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (login.id !== adminId || login.password !== adminPassword) {
      toast.error("Invalid admin ID or password");
      return;
    }

    const creds = { id: login.id, password: login.password };
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(creds));
    setCredentials(creds);
    toast.success("Admin login successful");
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setCredentials(null);
    setLogin({ id: "", password: "" });
    setSubmissions([]);
    toast.success("Logged out");
  };

  const handleRefresh = async () => {
    if (!credentials) return;
    await loadSubmissions(credentials);
    toast.success("Submissions refreshed");
  };

  const handleClear = async () => {
    if (!credentials) return;

    try {
      await clearSubmissions(credentials);
      setSubmissions([]);
      toast.success("All submissions cleared");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to clear bookings.");
    }
  };

  if (!credentials) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
        <form onSubmit={handleLogin} className="glass-card glow-border w-full max-w-md p-8 space-y-6">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Login to view customer booking requests.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Admin ID</label>
              <input
                value={login.id}
                onChange={(event) => setLogin({ ...login, id: event.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter admin ID"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <input
                type="password"
                value={login.password}
                onChange={(event) => setLogin({ ...login, password: event.target.value })}
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter password"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">
            Login
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 md:px-8">
      <div className="container mx-auto space-y-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest">tdacmechanic</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-2">Booking Submissions</h1>
            <p className="text-muted-foreground mt-2">Saved requests from the website booking form.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <section className="grid sm:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-3xl font-display font-bold mt-2">{submissions.length}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-3xl font-display font-bold mt-2">{totalToday}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-sm text-muted-foreground">Latest</p>
            <p className="text-lg font-semibold mt-3 truncate">
              {submissions[0] ? submissions[0].service : "No requests yet"}
            </p>
          </div>
        </section>

        <section className="glass-card glow-border overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border/60 p-5 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-display font-semibold">Customer Details</h2>
            <Button variant="destructive" size="sm" onClick={handleClear} disabled={submissions.length === 0 || isLoading}>
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {isLoading && submissions.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">No booking submissions yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="min-w-40">{formatDateTime(item.submittedAt)}</TableCell>
                    <TableCell className="font-medium min-w-36">{item.name}</TableCell>
                    <TableCell className="min-w-36">{item.phone}</TableCell>
                    <TableCell className="min-w-44">{item.email || "-"}</TableCell>
                    <TableCell className="min-w-40">{item.service}</TableCell>
                    <TableCell className="min-w-36">{item.date}</TableCell>
                    <TableCell className="min-w-64 text-muted-foreground">{item.message || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
