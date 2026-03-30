import { useEffect, useMemo, useState } from "react";
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
          <span>{loading ? "Loading articles..." : `${filteredArticles.length} article(s)`}</span>
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
