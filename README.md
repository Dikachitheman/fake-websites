# Fake Web Sources

This folder hosts the simulated web ecosystem for Dockie's upcoming `web_search` tool.

## Architecture

- There are **12 separate fake websites**.
- Each website should live in its **own standalone React app** inside `fake-websites/<site-id>`.
- Each app is intended for **independent Vercel deployment**.
- Each app exposes a machine-readable `public/search-index.json` endpoint.
- The backend should use [sources.json](/c:/Users/dikac/codes/dockie/fake-websites/sources.json) as the source registry for discovery and routing.

## Site Inventory

| Site ID | Product Name | Brand Type | Content Ownership |
|---|---|---|---|
| `sallaum-lines` | Sallaum Lines | Official carrier | West Africa service notices, voyage updates, cargo notices |
| `grimaldi-group` | Grimaldi Group | Official carrier | Fleet rotations, ETA revisions, vessel swap notices |
| `nigeria-port-watch` | Nigeria Port Watch | Independent monitoring | Anchorage queues, berth congestion, port bulletins |
| `naija-customs-guide` | Naija Customs Guide | Process/reference | PAAR, Form M, NICIS-2, demurrage explainers |
| `corridor-briefing` | Corridor Briefing | Analyst publication | Lane intelligence, weather context, carrier performance |
| `fx-bulletin` | FX Bulletin | Financial bulletin | USD/NGN, CBN policy, duty FX implications |
| `west-africa-weather` | West Africa Weather | Weather publication | Monsoon, swell, visibility, seasonal risk |
| `maritime-sanctions-watch` | Maritime Sanctions Watch | Compliance publication | Vessel screening, sanctions, registry checks |
| `apapa-tin-can-terminal` | Apapa Tin Can Terminal | Terminal operations | Berth notices, gate congestion, charges, throughput |
| `vessel-tracker-news` | Vessel Tracker News | Tracking publication | AIS reports, movement summaries, tracking explainers |
| `shipping-lane-analyst` | Shipping Lane Analyst | Analytics publication | ETA reliability, freight rates, market analysis |
| `nigeria-trade-desk` | Nigeria Trade Desk | Trade-policy desk | Trade regulation, exporter guides, reform coverage |

## Product Decisions Captured Here

- Simulated web articles are for `web_search`, not the internal knowledge base.
- Fake sites are **separate React apps**, not one shared multi-brand app.
- The agent should decide when `web_search` is needed.
- Hybrid ranking should vary by question type rather than always preferring the same source class.

## Expected App Structure

Each site folder should follow a lightweight static shape:

```text
fake-websites/<site-id>/
  package.json
  vite.config.ts
  index.html
  src/
  public/
    search-index.json
```

## Backend Expectations

The future `web_search` tool should:

1. Load `sources.json`.
2. Use `search_routing` to narrow the candidate sites by topic when possible.
3. Search each site's `search-index.json`.
4. Return ranked results with citation-safe metadata: title, URL, source, dates, tags, summary, and match reason.
