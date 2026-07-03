import { registerUser, loginUser } from "../services/api";
import { useState } from "react";
import { Menu, X, Leaf, Globe, Wind, Droplets, Flame, ChevronRight, Mail, Phone, MapPin, Star, Send, User, LogOut, ArrowRight, BookOpen, Users, MessageSquare, Home } from "lucide-react";
import { useEffect } from "react";
import { getArticles } from "../services/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "home" | "content" | "profile" | "feedback" | "team" | "contact";

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  bio: string;
  location: string;
  articlesRead: number;
}

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  tag: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const [articles, setArticles] = useState([]);

const TEAM: TeamMember[] = [
  {
    name: "don jhon",
    role: "Project Lead & Environmental Researcher",
    bio: "Environmental science graduate with 4 years of field research across the Western Ghats. Priya drives CliMateAcT's content strategy and community partnerships.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&auto=format"
  },
  {
    name: "marques brownlee",
    role: "Full-Stack Developer",
    bio: "Computer Science undergraduate passionate about using technology for social good. Arjun built and maintains the CliMateAcT platform.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format"
  },
  {
    name: "Geenath Damsara",
    role: "UI/UX Designer",
    bio: "Design student who believes that good information design can change behavior. Kavya shaped CliMateAcT's visual identity and user experience.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format"
  },
  {
    name: "linus",
    role: "Content Curator & Writer",
    bio: "Journalism student and environmental blogger. Rohan researches, summarizes, and writes the articles that keep CliMateAcT's content fresh and accurate.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format"
  },
  {
    name: "jack",
    role: "Community & Outreach",
    bio: "Social work student focused on grassroots climate education. Sneha manages CliMateAcT's feedback loop and connects the app to real communities.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&auto=format"
  }
];

const STATS = [
  { value: "4.2M+", label: "Tonnes CO₂ added daily", icon: Wind },
  { value: "8M", label: "Deaths from air pollution yearly", icon: Flame },
  { value: "1.5°C", label: "Critical warming threshold", icon: Globe },
  { value: "40%", label: "Landfill waste is compostable", icon: Leaf }
];

// ─── Components ───────────────────────────────────────────────────────────────

function Navbar({ currentPage, setPage, isLoggedIn, onAuthClick, onLogout }: {
  currentPage: Page;
  setPage: (p: Page) => void;
  isLoggedIn: boolean;
  onAuthClick: () => void;
  onLogout: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { label: string; page: Page; icon: typeof Home }[] = [
    { label: "Home", page: "home", icon: Home },
    { label: "Content", page: "content", icon: BookOpen },
    { label: "Team", page: "team", icon: Users },
    { label: "Feedback", page: "feedback", icon: MessageSquare },
    { label: "Contact", page: "contact", icon: Mail },
  ];

  if (isLoggedIn) {
    navLinks.push({ label: "Profile", page: "profile", icon: User });
  }

  const handleNav = (page: Page) => {
    setPage(page);
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-primary-foreground font-bold text-xl tracking-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>
              CliMate<span className="text-accent">AcT</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  currentPage === page
                    ? "bg-accent text-white"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Auth button desktop */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-5 py-2 bg-accent text-white text-sm font-semibold rounded-sm hover:bg-accent/90 transition-colors"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-primary-foreground p-2"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-white/10 px-4 pb-4">
          {navLinks.map(({ label, page, icon: Icon }) => (
            <button
              key={page}
              onClick={() => handleNav(page)}
              className={`flex items-center gap-3 w-full text-left px-3 py-3 text-sm font-medium border-b border-white/10 last:border-0 ${
                currentPage === page ? "text-accent" : "text-primary-foreground/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
          {isLoggedIn ? (
            <Button onClick={handleLogout}>
  Logout
</Button>
          ) : (
            <button onClick={onAuthClick} className="mt-3 w-full py-2.5 bg-accent text-white text-sm font-semibold rounded-sm">
              Login / Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function AuthModal({ onClose, onLogin }: { onClose: () => void; onLogin: (user: UserData) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "", bio: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "register" && !form.name) {
      setError("Please enter your name.");
      return;
    }
    try {


      if (mode === "register") {


        const result = await registerUser({

          name: form.name,
          email: form.email,
          password: form.password,
          location: form.location,
          bio: form.bio

        });

        if (!result.success) {
          setError(result.message);
          return;
        }

        alert("Registration successful! Please login.");

        setMode("login");

        return;

      }

      const result = await loginUser({
        email: form.email,
        password: form.password
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      localStorage.setItem("token", result.token);

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      onLogin({
        name: result.user.name,
        email: result.user.email,
        joinDate: result.user.joinDate,
        bio: result.user.bio,
        location: result.user.location,
        
        articlesRead: 0
      });

      onClose();


    } catch (error) {

      setError("Server connection failed.");

    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>
              {mode === "login" ? "Welcome back" : "Join CliMateAcT"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {mode === "login" ? "Sign in to your account" : "Create your free account"}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["login", "register"] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                mode === m ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Priya Nair"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address *</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />
          </div>
          {mode === "register" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Texas,USA"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Short Bio</label>
                <textarea
                  placeholder="Tell us what motivates you about climate action..."
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none"
                />
              </div>
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ onAuthClick, setPage }: { onAuthClick: () => void; setPage: (p: Page) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-primary"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1600&h=900&fit=crop&auto=format)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/70" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 border border-accent/30 rounded-sm mb-8">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Climate Emergency — Act Now</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-primary-foreground leading-none mb-6" style={{ fontFamily: "'Roboto Slab', serif" }}>
              The planet<br />
              <span className="text-accent">can't wait.</span><br />
              Neither can we.
            </h1>

            <p className="text-lg text-primary-foreground/70 leading-relaxed mb-10 max-w-xl">
              CliMateAcT is your education hub for environmental action. Read expert-curated articles, learn to reduce your footprint, and join a community committed to protecting the planet.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setPage("content")}
                className="flex items-center gap-2 px-7 py-3.5 bg-accent text-white font-semibold rounded-sm hover:bg-accent/90 transition-all hover:gap-3"
              >
                Start Reading
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onAuthClick}
                className="px-7 py-3.5 border border-primary-foreground/30 text-primary-foreground font-semibold rounded-sm hover:bg-white/10 transition-colors"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats bar */}
      <section className="bg-foreground py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/20 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-black text-background" style={{ fontFamily: "'Roboto Slab', serif" }}>{value}</div>
                  <div className="text-xs text-background/50 font-medium mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-4">Why CliMateAcT</p>
              <h2 className="text-4xl font-black text-foreground mb-6 leading-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>
                Education is the first step to action.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Most people want to help the environment but don't know where to start. Confusing jargon, overwhelming data, and scattered information make it hard to take meaningful steps.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                CliMateAcT distills complex environmental science into clear, actionable knowledge — updated regularly so you're always learning from the latest research and real-world solutions.
              </p>
              <button onClick={() => setPage("content")} className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Explore our content <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, title: "Reduce Pollution", desc: "Learn how everyday choices contribute to — and can reduce — air, water, and soil contamination." },
                { icon: Globe, title: "Save Resources", desc: "Practical guides on cutting energy, water, and material consumption in your home and workplace." },
                { icon: Droplets, title: "Protect Water", desc: "Understand the water crisis and discover simple habits that protect freshwater for future generations." },
                { icon: Wind, title: "Clean Energy", desc: "Explore renewable energy options available to individuals, communities, and policymakers." }
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border border-border p-5 rounded-sm hover:border-accent/40 transition-colors group">
                  <div className="w-9 h-9 bg-secondary rounded-sm flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                    <Icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured articles preview */}
      <section className="py-20 bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Latest Articles</p>
              <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>What we're reading</h2>
            </div>
            <button onClick={() => setPage("content")} className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map(article => (
              <div key={article.id} className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-lg transition-all group cursor-pointer" onClick={() => setPage("content")}>
                <div className="h-44 bg-muted overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-sm">{article.category}</span>
                    <span className="text-muted-foreground text-xs">5 min</span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm leading-snug mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>{article.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{article.content.substring(0,120)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-black text-primary-foreground mb-4" style={{ fontFamily: "'Roboto Slab', serif" }}>
            Ready to make a difference?
          </h2>
          <p className="text-primary-foreground/60 mb-8 leading-relaxed">
            Join thousands of readers learning how to live and act more sustainably. Registration is free, takes 30 seconds, and unlocks your personal profile.
          </p>
          <button onClick={onAuthClick} className="px-8 py-3.5 bg-accent text-white font-semibold rounded-sm hover:bg-accent/90 transition-colors">
            Join CliMateAcT — It&apos;s Free
          </button>
        </div>
      </section>
    </div>
  );
}

type DBArticle = {
  id: number;
  title: string;
  category: string;
  content: string;
  image: string;
  author: string;
  created_at: string;
};

function ContentPage() {
  const [selected, setSelected] = useState<DBArticle | null>(null);
  const [articles, setArticles] = useState<DBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Pollution", "Renewable Energy", "Sustainability", "Waste", "Oceans"];

const filtered =
    filter === "All"
        ? articles
        : articles.filter(
              a => a.category === filter
          );
            useEffect(() => {

    async function loadArticles() {

        try {

            const result = await getArticles();

            if (result.success) {
                setArticles(result.articles);
            }

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    loadArticles();

}, []);
  if (selected) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          ← Back to articles
        </button>
        <div className="mb-6">
          <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-sm">selected.category</span>
          <span className="ml-3 text-muted-foreground text-xs">new Date(selected.created_at).toLocaleDateString() · {selected.readTime}</span>
        </div>
        <h1 className="text-3xl font-black text-foreground mb-6 leading-tight" style={{ fontFamily: "'Roboto Slab', serif" }}>{selected.title}</h1>
        <div className="h-72 rounded-sm overflow-hidden mb-8 bg-muted">
          <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-4">
          <p className="text-base font-medium text-foreground">selected.content   </p>
          <p>
            Understanding the scale of this issue requires looking at both the data and the human stories behind it. Scientists, activists, and ordinary citizens across the world are working every day to find scalable solutions — and many of them are already succeeding.
          </p>
          <p>
            The most effective interventions combine individual behavior change with systemic policy reform. Neither alone is sufficient. When personal choices align with supportive regulation and accessible infrastructure, real transformation happens at speed.
          </p>
          <p>
            What you can do today: start by understanding the issue deeply (you are already doing this), then identify one concrete behavioral change in your life, and finally advocate for systemic change in your community, workplace, and through your vote.
          </p>
          <div className="bg-secondary border border-border rounded-sm p-5 mt-6">
            <h3 className="font-bold text-foreground mb-2 text-sm" style={{ fontFamily: "'Roboto Slab', serif" }}>Key Takeaways</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Individual actions matter but systemic change is essential</li>
              <li>Technology and policy solutions already exist — deployment is the challenge</li>
              <li>Education and community action accelerate adoption of sustainable practices</li>
              <li>Every 0.1°C of warming averted saves lives and ecosystems</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Knowledge Hub</p>
        <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>Climate Action Articles</h1>
        <p className="text-muted-foreground mt-2">Regularly updated summaries from environmental research and journalism.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 text-sm font-medium rounded-sm border transition-colors ${
              filter === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(article => (
          <div
            key={article.id}
            onClick={() => setSelected(article)}
            className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all group cursor-pointer"
          >
            <div className="h-48 bg-muted overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-semibold rounded-sm">{article.category}</span>
                <span className="text-muted-foreground text-xs">5 min    </span>
              </div>
              <h2 className="font-bold text-foreground text-sm leading-snug mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>{article.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">{article.content.substring(0,120)}...</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">new Date(article.created_at).toLocaleDateString()</span>
                <span className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ user }: { user: UserData }) {
  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Account</p>
        <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>Your Profile</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-sm p-6 text-center">
            <div className="w-20 h-20 bg-primary rounded-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-primary-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>{initials}</span>
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: "'Roboto Slab', serif" }}>{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
            <div className="w-full h-px bg-border mb-4" />
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium text-foreground">{user.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium text-foreground">{user.joinDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Articles read</span>
                <span className="font-medium text-foreground">{user.articlesRead}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-sm p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "'Roboto Slab', serif" }}>
              <User className="w-4 h-4 text-accent" />
              About You
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{user.bio}</p>
          </div>

          <div className="bg-card border border-border rounded-sm p-6">
            <h3 className="font-bold text-foreground mb-4" style={{ fontFamily: "'Roboto Slab', serif" }}>Your Climate Journey</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Articles Read", value: user.articlesRead, icon: BookOpen },
                { label: "Days Active", value: "1", icon: Leaf },
                { label: "Topics Explored", value: "1", icon: Globe }
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-secondary/50 rounded-sm p-4 text-center">
                  <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-black text-foreground mb-1" style={{ fontFamily: "'Roboto Slab', serif" }}>{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-sm p-5">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Keep learning, keep acting.</p>
                <p className="text-sm text-muted-foreground">Every article you read builds your knowledge. Share what you learn with your community — education spreads faster than pollution.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", rating: 0, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-sm flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-3" style={{ fontFamily: "'Roboto Slab', serif" }}>Thank you, {form.name.split(" ")[0]}!</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">Your feedback helps us improve CliMateAcT. We read every submission and use it to make the platform better for our community.</p>
        <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", rating: 0, message: "" }); }} className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors">
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Share Your Thoughts</p>
        <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>Feedback</h1>
        <p className="text-muted-foreground mt-2">Your input shapes what we build and how we present climate education.</p>
      </div>

      <div className="bg-card border border-border rounded-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name *</label>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address *</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Subject</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            >
              <option value="">Select a topic...</option>
              <option value="content">Article Quality & Content</option>
              <option value="design">Website Design & UX</option>
              <option value="feature">Feature Request</option>
              <option value="bug">Report a Bug</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${form.rating >= n ? "text-accent fill-accent" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
              {form.rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground self-center">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][form.rating]}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Your Message *</label>
            <textarea
              placeholder="Tell us what you think about CliMateAcT — what's working, what could be better, ideas for content topics..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12 text-center">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">The People Behind CliMateAcT</p>
        <h1 className="text-4xl font-black text-foreground mb-3" style={{ fontFamily: "'Roboto Slab', serif" }}>Team SE-51</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We are a multidisciplinary team of students passionate about using digital tools to accelerate climate education and inspire real-world action.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {TEAM.map(member => (
          <div key={member.name} className="bg-card border border-border rounded-sm overflow-hidden hover:shadow-md hover:border-accent/30 transition-all group">
            <div className="h-56 bg-muted overflow-hidden">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-foreground text-base mb-0.5" style={{ fontFamily: "'Roboto Slab', serif" }}>{member.name}</h3>
              <p className="text-xs text-accent font-semibold mb-3">{member.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-sm p-8 text-center">
        <h2 className="text-2xl font-black text-primary-foreground mb-3" style={{ fontFamily: "'Roboto Slab', serif" }}>Driven by purpose, united by urgency.</h2>
        <p className="text-primary-foreground/60 max-w-xl mx-auto text-sm leading-relaxed">
          CliMateAcT was born from a shared belief: that access to clear, honest environmental education is the foundation of a sustainable future. We build with care because the stakes are real.
        </p>
      </div>
    </div>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Get in Touch</p>
        <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: "'Roboto Slab', serif" }}>Contact Us</h1>
        <p className="text-muted-foreground mt-2">Questions, collaborations, or just want to say hello? We would love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-sm p-6">
            <h3 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Roboto Slab', serif" }}>Contact Details</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "team@climateact.edu.in" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                { icon: MapPin, label: "Address", value: "Department of Computer Science\nSt. Xavier's College, Mumbai — 400 001" }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-secondary rounded-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                    <p className="text-sm text-foreground font-medium whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/15 rounded-sm p-5">
            <h4 className="font-bold text-foreground text-sm mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>Office Hours</h4>
            <p className="text-sm text-muted-foreground">Monday – Friday: 10:00 AM – 5:00 PM IST</p>
            <p className="text-sm text-muted-foreground">We typically respond within 24 hours.</p>
          </div>
        </div>

        {/* Message form */}
        <div className="bg-card border border-border rounded-sm p-6">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: "'Roboto Slab', serif" }}>Message sent!</h3>
              <p className="text-sm text-muted-foreground mb-6">We will get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-foreground mb-5" style={{ fontFamily: "'Roboto Slab', serif" }}>Send a Message</h3>
              <form onSubmit={e => { e.preventDefault(); if (form.name && form.email && form.message) setSent(true); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Name *</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Email *</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">Message *</label>
                  <textarea placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-3 py-2.5 bg-input-background border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none" />
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-sm hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const handleLogin = (user: UserData) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage("home");
  };

  const handleSetPage = (page: Page) => {
    if (page === "profile" && !isLoggedIn) {
      setShowAuth(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    setCurrentUser(JSON.parse(user));
    setIsLoggedIn(true);
  }
  useEffect(() => {

    async function loadArticles() {

        try {

            const result = await getArticles();

            if (result.success) {
                setArticles(result.articles);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingArticles(false);
        }

    }

    loadArticles();

}, []);
}, []);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setCurrentUser(null);
  setIsLoggedIn(false);
};
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar
        currentPage={currentPage}
        setPage={handleSetPage}
        isLoggedIn={isLoggedIn}
        onAuthClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <main className="pt-16">
        {currentPage === "home" && (
          <HomePage onAuthClick={() => setShowAuth(true)} setPage={handleSetPage} />
        )}
        {currentPage === "content" && <ContentPage />}
        {currentPage === "profile" && currentUser && <ProfilePage user={currentUser} />}
        {currentPage === "feedback" && <FeedbackPage />}
        {currentPage === "team" && <TeamPage />}
        {currentPage === "contact" && <ContactPage />}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background/60 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-background" style={{ fontFamily: "'Roboto Slab', serif" }}>
                CliMate<span className="text-accent">AcT</span>
              </span>
            </div>
            <p className="text-xs text-center">
              Built by Team SE-51 · Climate education for a sustainable future · © 2026
            </p>
            <div className="flex gap-4 text-xs">
              {(["home", "content", "team", "contact"] as Page[]).map(p => (
                <button key={p} onClick={() => handleSetPage(p)} className="capitalize hover:text-background transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} />
      )}
    </div>
  );
}
