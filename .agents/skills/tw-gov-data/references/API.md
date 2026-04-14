# API Quick Reference

Use this file when the task needs concrete API selection, response-field interpretation, or bulk inventory planning.

## Preferred API Order

1. Site-facing API on `https://data.gov.tw/api/front`
2. Bulk export on `https://data.gov.tw/api/front/dataset/export`
3. Documented cross-platform spec on `https://data.gov.tw/api/v1/rest` only after re-verification
4. Page scraping only when the APIs do not expose the needed view

## Live Operational APIs

These are the paths verified to work during maintenance review on 2026-04-13.

### Search and Candidate Discovery

- `POST /api/front/dataset/list`
  Useful for keyword search, ranking, and facet-style filtering.

Observed request shape for keyword search:

```json
{
  "bool": [
    {
      "fulltext": {
        "value": "空氣品質"
      }
    }
  ],
  "filter": [],
  "page_num": 1,
  "page_limit": 10,
  "tids": [],
  "sort": "_score_desc"
}
```

Observed strengths:

- Fast keyword-based discovery
- Rich metadata in each result
- Includes provider, update time, formats, field hints, and resource URLs
- Works well for ranked candidate lists and dataset summaries

Important response fields commonly used by this skill:

- `nid`
- `title`
- `agency_name`
- `changed`
- `updatefreq_desc`
- `content`
- `dataset_resource_description`
- `all_file_format_name`
- `all_url`
- `all_encoding`
- `data_fields`

### Bulk Export

- `GET /api/front/dataset/export?format=json`
  Useful for large metadata export and bulk inventory tasks.

Observed behavior:

- Returns a downloadable JSON export
- Suitable for full-platform inventory or offline filtering

### Dataset-Page-Backed Detail

- `GET /api/front/ai-ready-data/detail/{nid}`
  Returns AI-ready notes for a dataset page id.

Use this only as a supplement. It does not replace the richer metadata available through search results or export data.

## Documented Cross-Platform Spec

Base URL:

- `https://data.gov.tw/api/v1`

The published cross-platform YAML documents:

- `GET /rest/dataset`
- `GET /rest/dataset/{identifier}`

However, during live verification on 2026-04-13:

- `GET https://data.gov.tw/api/v1/rest/dataset` returned `404`
- `GET https://data.gov.tw/api/v1/rest/dataset/{identifier}` returned `404`

Do not rely on `api/v1/rest` as the default operational path unless maintenance re-verifies that it is live again.

## Choosing the Endpoint

Use `POST /api/front/dataset/list` when:

- the user starts from a plain-language topic
- the task needs quick candidate discovery
- the task needs ranking or UI-style filtering
- the task needs single-result metadata rich enough for summary

Use `GET /api/front/dataset/export?format=json` when:

- the user wants a broad platform inventory
- the task benefits from one-shot metadata export
- the task needs bulk filtering outside the search endpoint

Use `GET /api/front/ai-ready-data/detail/{nid}` when:

- the user already has a dataset page id
- the task needs page-specific AI-ready notes
- supplemental detail is helpful after search or export

## Recommended Workflow Patterns

### Search-first workflow

1. Use `POST /api/front/dataset/list` to discover candidate datasets.
2. Extract promising `nid`, titles, and resource links.
3. Summarize directly from search results.
4. Use export data or page-backed detail only when more context is needed.

### Inventory workflow

1. Use `GET /api/front/dataset/export?format=json`.
2. Filter the exported metadata to the user goal.
3. Return a compact inventory summary.

### Single-dataset workflow

1. Resolve the dataset by keyword or `nid`.
2. Use `POST /api/front/dataset/list` or export data to obtain metadata.
3. Summarize purpose, provider, freshness, formats, fields, and links.
