# Web Search Contracts

These contracts define the backend shape for Dockie's remote-first fake-web search.

## Important assumption

The backend must treat the fake sites as deployed remote websites.

- It may read [sources.json](/c:/Users/dikac/codes/dockie/fake-websites/sources.json) locally as a registry of remote endpoints.
- It must fetch article indexes from each site's `search_index_url`.
- It must not use local site source files as the runtime search corpus.

## Search result contract

The `web_search` tool returns:

- `query`
- `normalized_query`
- `topics`
- `candidate_sources`
- `results`
- `retrieved_at`
- `search_mode`

Each result includes:

- `id`
- `title`
- `url`
- `source`
- `source_id`
- `source_type`
- `source_class`
- `trust_level`
- `published`
- `updated`
- `summary`
- `snippet`
- `tags`
- `relevance_score`
- `match_reason`

## UI progress contract

The next frontend/backend streaming layer should support these web-search progress states:

- `web_search_started`
- `web_search_source_fetch_started`
- `web_search_source_fetch_finished`
- `web_search_results_ready`
- `web_search_no_results`
- `web_search_failed`

Suggested payload shape:

```json
{
  "type": "web_search_source_fetch_started",
  "source_id": "nigeria-port-watch",
  "source_name": "Nigeria Port Watch",
  "query": "lagos congestion update",
  "timestamp": "2026-03-30T10:30:00Z"
}
```

That event layer is not wired yet, but this is the contract the UI work should build against next.
