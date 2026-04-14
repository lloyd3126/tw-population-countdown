# Maintenance Guidance

Use this file to decide when `tw-gov-data` needs to be reviewed or updated.

## When This Skill Is Outdated

This skill is outdated when it starts making incorrect assumptions about `data.gov.tw`, or when its workflow no longer reflects the best available API path.

## Hard Outdated Cases

Update the skill immediately if any of these happen:

- the formal API base path changes
- `GET /rest/dataset` changes behavior or parameters
- `GET /rest/dataset/{identifier}` changes response structure
- important metadata fields are renamed, removed, or moved
- `downloadURL` or `accessURL` handling changes materially
- authentication, authorization, or rate-limit requirements change
- `api/front` endpoints used by the skill stop working or drift significantly

These are correctness issues. The skill may return wrong guidance if not updated.

## Soft Outdated Cases

Review the skill soon if any of these happen:

- the official platform introduces a better search or metadata API
- common user requests shift away from the examples in this skill
- the current examples no longer reflect real use cases
- the response guidance becomes too vague or too verbose
- the UI metadata no longer helps users discover the skill

These are quality issues. The skill may still work, but not optimally.

## Maintenance Triggers

Start maintenance work when any of the following is true:

### Trigger A: API Failure

- a formal `data.gov.tw/api/v1/rest/...` endpoint fails
- the response status changes unexpectedly
- the documented endpoint no longer behaves as assumed

### Trigger B: Response Drift

- fields used by this skill are renamed, removed, or moved
- `distribution` no longer contains the expected link or format fields
- date or pagination behavior changes enough to break current guidance

### Trigger C: User-Facing Failure

- the skill repeatedly returns unusable links
- the skill can no longer summarize datasets accurately
- the skill repeatedly confuses metadata discovery with out-of-scope tasks
- two or more core user flows fail in practice

### Trigger D: Official Change

- official API documentation changes
- the platform introduces a new preferred formal API
- authentication, authorization, or usage constraints change

### Trigger E: Scheduled Review

- 1 to 3 months have passed since the last light review
- the project is preparing a release or broader rollout

## Core Assumptions To Recheck

The following assumptions should be periodically verified:

- `data.gov.tw/api/front/...` remains the primary operational API path
- `data.gov.tw/api/front/dataset/export?format=json` remains usable for bulk inventory
- the published `data.gov.tw/api/v1/rest/...` spec is still non-operational unless re-verified
- dataset metadata still includes the fields this skill depends on
- one dataset may contain multiple resources
- resource URLs may point outside `data.gov.tw`
- metadata inspection is still the intended scope of this skill

## Maintenance Workflow

When a maintenance trigger occurs, follow this sequence.

### Step 1: Confirm the Trigger

Identify which trigger category applies:

- API failure
- response drift
- user-facing failure
- official change
- scheduled review

Do not edit the skill before confirming what changed.

### Step 2: Re-Test Core Flows

Re-test at least these flows:

1. Search for datasets by topic
2. Summarize one dataset by identifier
3. Compare multiple candidate datasets
4. Extract file formats and download links
5. List recently changed datasets

Capture which flows still work, which degrade, and which fail.

### Step 3: Verify API Priority

Re-check whether:

- `api/front` is still the primary operational path
- export is still the best bulk inventory path
- `api/v1/rest` has become live and worth promoting
- page scraping is still avoidable for normal tasks

If the preferred API order changes, update the skill documents accordingly.

### Step 4: Update the Skill Files

Update only the files affected by the change:

- `SKILL.md`
- `references/API.md`
- `references/EXAMPLES.md`
- `agents/openai.yaml`

Typical mapping:

- API or field changes usually require `SKILL.md` and `references/API.md`
- shifted user intent usually requires `references/EXAMPLES.md`
- naming or UI-positioning changes usually require `agents/openai.yaml`

### Step 5: Re-Run the Core Flows

After edits, re-run the same core flows and confirm the skill instructions still match real platform behavior.

### Step 6: Record the Outcome

At minimum, record mentally or in project notes:

- what triggered maintenance
- what changed
- which files were updated
- whether all core flows passed after the update

## Maintenance Exit Criteria

Maintenance is complete only when all of these are true:

- the trigger cause is understood
- the relevant API behavior has been re-verified
- the affected skill files are updated
- the core flows pass again or have documented constraints
- the skill scope remains explicit and unambiguous

## Escalation Cases

Pause and escalate scope decisions instead of silently patching if:

- `data.gov.tw` introduces a materially new API surface
- metadata discovery is no longer the main user need
- users now repeatedly need schema validation or data-content analysis
- maintenance would require broadening the skill beyond its intended purpose

In these cases, decide whether to:

- keep the skill narrow
- split the skill
- create a new companion skill

## Update Triggers Summary

Update this skill when:

1. official API docs or behavior change
2. two or more core user flows no longer work cleanly
3. the skill repeatedly misclassifies in-scope vs out-of-scope tasks
4. the project scope changes, such as adding schema validation or downstream analysis

## Core User Flows To Re-Test

When reviewing the skill, test at least these flows:

1. Search for datasets by topic
2. Summarize one dataset by identifier
3. Compare multiple candidate datasets
4. Extract file formats and download links
5. List recently changed datasets

If two or more of these flows fail or degrade noticeably, update the skill.

## Suggested Review Cadence

- Immediate review when an endpoint fails
- Light manual review every 1 to 3 months
- Full review whenever platform scope or user intent changes

## Files Most Likely To Need Updates

- `SKILL.md`
- `references/API.md`
- `references/EXAMPLES.md`
- `agents/openai.yaml`

## Non-Goals For Maintenance

Do not expand the skill automatically just because `data.gov.tw` exposes more features.

Only expand scope when there is a clear product reason, such as:

- users repeatedly need a missing workflow
- a new formal API materially improves the current workflow
- the project intentionally broadens beyond metadata discovery
