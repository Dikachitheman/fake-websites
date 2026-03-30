import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourcesPath = path.join(rootDir, "sources.json");

const registry = JSON.parse(await readFile(sourcesPath, "utf8"));

const palettes = {
  "sallaum-lines": { accent: "#0f766e", surface: "#ecfeff", text: "#11302f" },
  "grimaldi-group": { accent: "#991b1b", surface: "#fef2f2", text: "#3f1414" },
  "nigeria-port-watch": { accent: "#1d4ed8", surface: "#eff6ff", text: "#172554" },
  "naija-customs-guide": { accent: "#047857", surface: "#ecfdf5", text: "#052e26" },
  "corridor-briefing": { accent: "#6d28d9", surface: "#f5f3ff", text: "#2e1065" },
  "fx-bulletin": { accent: "#0f766e", surface: "#f0fdfa", text: "#134e4a" },
  "west-africa-weather": { accent: "#1e40af", surface: "#eff6ff", text: "#1e3a8a" },
  "maritime-sanctions-watch": { accent: "#7c2d12", surface: "#fff7ed", text: "#431407" },
  "apapa-tin-can-terminal": { accent: "#134e4a", surface: "#f0fdf4", text: "#052e2b" },
  "vessel-tracker-news": { accent: "#1e1b4b", surface: "#eef2ff", text: "#1e1b4b" },
  "shipping-lane-analyst": { accent: "#4338ca", surface: "#eef2ff", text: "#312e81" },
  "nigeria-trade-desk": { accent: "#065f46", surface: "#ecfdf5", text: "#064e3b" }
};

function packageJson(source) {
  return JSON.stringify(
    {
      name: source.id,
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.7.0",
        vite: "^5.4.19"
      }
    },
    null,
    2
  ) + "\n";
}

function viteConfig() {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`;
}

function indexHtml(source) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${source.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function mainJsx() {
  return `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}

function siteConfigJs(source) {
  const palette = palettes[source.id] ?? { accent: "#0f766e", surface: "#f0fdfa", text: "#134e4a" };
  return `export const siteConfig = ${JSON.stringify(
    {
      id: source.id,
      name: source.name,
      description: source.description ?? source.content_owner,
      baseUrl: source.base_url,
      searchIndexUrl: source.search_index_url,
      brandPositioning: source.brand_positioning,
      contentOwner: source.content_owner,
      accent: palette.accent,
      surface: palette.surface,
      text: palette.text
    },
    null,
    2
  )};
`;
}

function appJsx() {
  return `import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "./siteConfig";

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function ArticleCard({ article }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="article-card">
      <div className="article-meta">
        <Badge>{article.source_type.replace(/_/g, " ")}</Badge>
        <span className="muted">Updated {article.updated}</span>
      </div>
      <h2>{article.title}</h2>
      <p className="summary">{article.summary}</p>
      <div className="tag-row">
        {article.tags.map((tag) => (
          <span key={tag} className="tag">#{tag}</span>
        ))}
      </div>
      {expanded ? <p className="body-copy">{article.body}</p> : null}
      <button type="button" className="toggle-btn" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Hide article" : "Read article"}
      </button>
    </article>
  );
}

export default function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/search-index.json")
      .then((response) => response.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setArticles([]);
        setLoading(false);
      });
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return articles;
    }
    return articles.filter((article) => {
      const haystack = [
        article.title,
        article.summary,
        article.body,
        ...(article.tags ?? [])
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [articles, query]);

  return (
    <div className="page-shell">
      <header className="hero">
        <p className="eyebrow">{siteConfig.brandPositioning}</p>
        <h1>{siteConfig.name}</h1>
        <p className="hero-copy">{siteConfig.description}</p>
      </header>

      <main className="content-shell">
        <section className="toolbar">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this source..."
          />
          <a href="/search-index.json" target="_blank" rel="noreferrer">
            Open search-index.json
          </a>
        </section>

        <section className="status-row">
          <span>{loading ? "Loading articles..." : \`\${filteredArticles.length} article(s)\`}</span>
          <span className="muted">{siteConfig.contentOwner}</span>
        </section>

        <section className="article-list">
          {loading ? <div className="empty-state">Loading...</div> : null}
          {!loading && filteredArticles.length === 0 ? (
            <div className="empty-state">No articles yet. Populate public/search-index.json next.</div>
          ) : null}
          {!loading
            ? filteredArticles.map((article) => <ArticleCard key={article.id} article={article} />)
            : null}
        </section>
      </main>
    </div>
  );
}
`;
}

function stylesCss(source) {
  const palette = palettes[source.id] ?? { accent: "#0f766e", surface: "#f0fdfa", text: "#134e4a" };
  return `:root {
  --accent: ${palette.accent};
  --surface: ${palette.surface};
  --ink: ${palette.text};
  --panel: #ffffff;
  --border: rgba(15, 23, 42, 0.1);
  --muted: #64748b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  background:
    radial-gradient(circle at top left, var(--surface), transparent 42%),
    linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  color: #0f172a;
}

a {
  color: var(--accent);
}

button,
input {
  font: inherit;
}

.page-shell {
  min-height: 100vh;
}

.hero {
  padding: 3.5rem 1.5rem 2rem;
  background: linear-gradient(140deg, var(--accent), color-mix(in srgb, var(--accent) 70%, white 30%));
  color: white;
}

.hero h1 {
  margin: 0.15rem 0 0.5rem;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
  opacity: 0.82;
}

.hero-copy {
  max-width: 48rem;
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.92;
}

.content-shell {
  width: min(980px, calc(100vw - 2rem));
  margin: -1.5rem auto 0;
  padding-bottom: 3rem;
}

.toolbar,
.status-row,
.article-card {
  background: var(--panel);
  border: 1px solid var(--border);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
}

.toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 1.2rem;
}

.toolbar input {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: #f8fafc;
}

.status-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  margin-top: 1rem;
}

.muted {
  color: var(--muted);
}

.article-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.article-card {
  padding: 1.25rem;
  border-radius: 1.25rem;
}

.article-card h2 {
  margin: 0.65rem 0 0.5rem;
  color: var(--ink);
  font-size: 1.4rem;
}

.article-meta,
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
}

.summary,
.body-copy {
  line-height: 1.75;
  color: #334155;
}

.body-copy {
  white-space: pre-line;
}

.badge,
.tag,
.toggle-btn {
  border-radius: 999px;
}

.badge {
  background: var(--surface);
  color: var(--ink);
  padding: 0.3rem 0.7rem;
  font-size: 0.82rem;
}

.tag {
  padding: 0.22rem 0.6rem;
  background: #f8fafc;
  border: 1px solid var(--border);
  color: #475569;
  font-size: 0.82rem;
}

.toggle-btn {
  border: none;
  background: var(--accent);
  color: white;
  padding: 0.7rem 1rem;
  cursor: pointer;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed var(--border);
  border-radius: 1rem;
}

@media (max-width: 720px) {
  .toolbar,
  .status-row {
    flex-direction: column;
    align-items: stretch;
  }
}
`;
}

async function ensureDir(dirPath) {
  await mkdir(dirPath, { recursive: true });
}

for (const source of registry.sources) {
  const siteDir = path.join(rootDir, source.id);
  const srcDir = path.join(siteDir, "src");
  const publicDir = path.join(siteDir, "public");

  await ensureDir(srcDir);
  await ensureDir(publicDir);

  await writeFile(path.join(siteDir, "package.json"), packageJson(source), "utf8");
  await writeFile(path.join(siteDir, "vite.config.js"), viteConfig(), "utf8");
  await writeFile(path.join(siteDir, "index.html"), indexHtml(source), "utf8");
  await writeFile(path.join(srcDir, "main.jsx"), mainJsx(), "utf8");
  await writeFile(path.join(srcDir, "App.jsx"), appJsx(), "utf8");
  await writeFile(path.join(srcDir, "siteConfig.js"), siteConfigJs(source), "utf8");
  await writeFile(path.join(srcDir, "styles.css"), stylesCss(source), "utf8");
  await writeFile(path.join(publicDir, "search-index.json"), "[]\n", "utf8");
}

console.log(`Scaffolded ${registry.sources.length} fake web React apps in ${rootDir}`);
