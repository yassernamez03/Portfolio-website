# Agentic RAG Documentation Platform — Deep Project Analysis

**Repository:** [yassernamez03/Agentic-RAG-Documentation-Platform](https://github.com/yassernamez03/Agentic-RAG-Documentation-Platform/tree/master)  
**Application focus:** Electrical technical documentation, field solutions, client equipment, and AI-assisted knowledge retrieval  
**Analysis basis:** Full uploaded source archive, including Next.js source code, API routes, Supabase migrations, ingestion and retrieval services, administrative scripts, localization files, PWA configuration, and package manifests.

> This report is based on static source analysis. The application was not connected to a live Supabase project, OpenAI account, document-processing service, or search provider, so externally dependent runtime behavior remains unverified.

# Executive Summary

The **Agentic RAG Documentation Platform** is a modern Next.js application designed to help electricians, technicians, managers, and clients search technical documentation and field knowledge through an AI assistant.

The platform combines:

- Technical-document management
- PDF ingestion and structured parsing
- OpenAI embeddings
- Supabase PostgreSQL and `pgvector`
- Agentic tool calling
- Internal semantic retrieval
- Real-time web search
- User and role management
- Client and equipment records
- Document-review workflows
- Analytics
- Internationalized interfaces
- Progressive Web App configuration

Its central engineering feature is an agentic Retrieval-Augmented Generation pipeline. The assistant can select between internal documentation search and external web search, then combine retrieved evidence into an answer.

The repository also includes manufacturer-document publishing, field-solution submissions, approval workflows, category management, client-site records, equipment records, maintenance information, browser-generated PDF reports, dashboard statistics, and English/French interfaces.

The codebase demonstrates meaningful work in Next.js App Router, React, TypeScript, Supabase, vector retrieval, document ingestion, AI tool calling, data administration, and responsive interface development.

The main remaining implementation work is concentrated in schema consolidation, ingestion reliability, analytics alignment, multilingual retrieval, PWA completion, testing, and clearer packaging of the document-processing environment.

The project is best positioned as a **feature-rich agentic RAG and technical-documentation prototype** with substantial full-stack, AI-retrieval, and document-processing scope.

# Repository Scale

Approximate source volume from the uploaded archive:

| Area | Files | Approximate lines |
|---|---:|---:|
| `src/` | 72 | 18,416 |
| `scripts/` | 13 | 2,202 |
| `migrations/` | 4 | 740 |
| Localization messages | 2 | 368 |
| TSX | 40 | 13,950 |
| TypeScript | 31 | 4,333 |
| JavaScript | 11 | 2,177 |

The application is materially larger than a demonstration chatbot. It contains a full frontend, administrative features, document management, database scripts, and deployment configuration.

# Technology Stack

## Frontend and Application Framework

- Next.js 15
- React 19
- TypeScript
- Next.js App Router
- Tailwind CSS 4
- React Hook Form
- Zod
- SWR
- `next-intl`
- `next-pwa`

## AI and Retrieval

- OpenAI API
- `gpt-4o-mini`
- `text-embedding-3-small`
- OpenAI function/tool calling
- Supabase PostgreSQL
- `pgvector`
- Hybrid vector and full-text search SQL
- Tavily
- SerpAPI
- DuckDuckGo HTML fallback
- Unstructured document-processing API

## Data and Authentication

- Supabase Auth
- Supabase Storage
- Supabase JavaScript client
- PostgreSQL
- Row Level Security concepts
- SQL RPC functions

## Document and Reporting Tools

- `pdf-lib`
- `pdfjs-dist`
- `jsPDF`
- `xlsx`
- Browser-generated PDF reports

## Deployment and Tooling

- Vercel configuration
- PWA manifest and service worker
- npm scripts
- Database setup scripts
- Data-seeding scripts
- RAG smoke-test scripts

# High-Level Architecture

```text
Browser
  │
  ├── Next.js pages and dashboard
  ├── Supabase browser client
  ├── Document forms and PDF upload
  ├── Client and equipment administration
  └── AI assistant
          │
          ▼
      Next.js API Routes
          │
    ┌─────┼────────────────────────────┐
    ▼     ▼                            ▼
OpenAI  Ingestion service          User admin service
LLM     │                          Supabase service role
        ├── Unstructured API
        ├── OpenAI embeddings
        └── Supabase pgvector
          │
          ▼
   Agentic Retrieval Loop
          │
    ┌─────┴─────────────────────┐
    ▼                           ▼
Internal document search     Web search
Supabase RPC                 Tavily
                             SerpAPI
                             DuckDuckGo
```

# Main Functional Areas

# 1. Authentication and Role-Based Interfaces

The application uses Supabase Auth for:

- Email/password authentication
- Magic-link authentication
- Session retrieval
- Authentication-state changes
- Profile lookup
- User creation through administrative workflows

The profile model is intended to support:

```text
user
admin
client
```

Other parts of the source refer to electrician, supervisor, and manager roles, so the role vocabulary should be consolidated.

## Authentication Context

`AuthContext` retrieves the Supabase session and associated profile, exposes role helpers, stores user/profile state, and coordinates client-side redirects.

## Dashboard Routing

Dashboard components check the current session and direct users to the appropriate interface state.

# 2. Technical Document Library

The library manages two principal content types:

```text
manufacturer_doc
field_solution
```

Content can have workflow states such as:

```text
draft
pending
published
rejected
```

## Official Documentation

Administrators can:

- Create content records
- Attach PDF documents
- Assign categories
- Add error codes
- Publish official documentation
- Edit metadata
- Delete records
- Trigger document ingestion

## Field Solutions

Users can submit practical field knowledge for review.

The application includes:

- Submission forms
- Review interfaces
- Approval and rejection
- Author and date information
- Categorization
- Rich-text editing

The repository contains both a newer unified `content_items` approach and older `submissions` references. The corresponding database schema is incomplete.

## Library Experience

The library interface supports:

- Search
- Category filters
- Content-type filters
- Detail pages
- Edit pages
- Delete operations
- View counts
- PDF links
- Images
- Approval status

# 3. Document Ingestion

The document-ingestion service converts PDFs into vector-searchable chunks.

## Intended Flow

```text
Uploaded PDF
    │
    ▼
Split into 10-page PDF segments
    │
    ▼
Send each segment to Unstructured API
    │
    ▼
Parse titles, narrative text, lists, tables, and images
    │
    ▼
Create overlapping semantic chunks
    │
    ▼
Generate OpenAI embeddings
    │
    ▼
Insert document chunks into Supabase
```

## PDF Splitting

Large PDFs are divided into groups of approximately ten pages before processing.

This reduces request size and can make external parsing more reliable.

## Unstructured Parsing

The service recognizes elements including:

- `Title`
- `NarrativeText`
- `ListItem`
- `Table`
- `Image`

The code retries failed Unstructured requests up to three times using backoff.

## Chunking

The ingestion code uses approximate token counting and targets:

```text
Chunk size: approximately 1,000 tokens
Context/overlap: approximately 200 tokens
```

There are multiple chunking implementations in the repository:

- Logic within `documentIngestion.ts`
- `advancedChunking.ts`
- `unstructuredProcessor.ts`

The duplication makes it unclear which implementation is authoritative.

## Embeddings

The platform uses:

```text
Model: text-embedding-3-small
Dimensions: 1,536
Batch size: 50
```

## Persistence

Chunk rows include information such as:

- Content item ID
- Chunk text
- Embedding
- Page number
- Chunk index
- Section title
- Metadata

The function named `upsertChunks` performs inserts rather than a true upsert.

# 4. Agentic RAG Assistant

The assistant is specialized for electrical-engineering questions.

Its system prompt emphasizes:

- Electrical safety
- Variable-frequency drives
- Industrial equipment
- NEC and IEC standards
- Troubleshooting
- Manufacturer documentation
- Field solutions

## Available Agent Tools

### Internal Search

```text
search_documentation
```

This tool:

1. Embeds the query.
2. Calls a Supabase similarity-search RPC.
3. Groups matching chunks by content item.
4. Fetches document titles.
5. Returns content and similarity values.

### Web Search

```text
search_web
```

This tool tries:

1. Tavily
2. SerpAPI
3. DuckDuckGo HTML search

## Tool-Calling Loop

The agent can perform multiple calls:

```text
User question
    │
    ▼
Initial GPT-4o-mini tool decision
    │
    ├── No tools → final response
    │
    └── Tools requested
            │
            ▼
     Execute tools in parallel
            │
            ▼
     Return results to model
            │
            ▼
     Repeat up to four iterations
            │
            ▼
       Final answer
```

The assistant aggregates internal and web sources across tool iterations.

## Language Detection

A heuristic regular-expression detector categorizes the question as:

- English
- French
- Spanish
- Arabic

The model is asked to answer in the detected language.

This does not correspond exactly to the frontend locale configuration, which supports only English and French.

# 5. Internal Vector Retrieval

## Production Retrieval

The production TypeScript service calls:

```text
match_document_chunks
```

with:

```text
Similarity threshold: 0.38
Candidate count: maximum results × 6
```

Retrieved chunks are grouped by document.

The service then concatenates matching text into a larger content block for each document.

## Keyword Fallback

When vector search fails, the application:

1. Fetches only the first 100 chunks.
2. Counts query-keyword matches in JavaScript.
3. Selects the top-scoring chunks.
4. Groups them by document.

This fallback is useful for resilience but is neither scalable nor comprehensive.

## Hybrid Search

The SQL migration includes:

```text
hybrid_search_chunks
```

It combines:

```text
70% vector similarity
30% text-search relevance
```

The production retrieval service does not call this function.

# 6. Web Search

The web-search layer attempts multiple providers.

## Tavily

- Advanced search
- JSON POST request
- Structured results
- Intended for AI research workflows

## SerpAPI

- Query-string API key
- Search snippets and URLs
- Fallback when Tavily is unavailable

## DuckDuckGo

- Downloads HTML search results
- Extracts links and snippets with regular expressions
- No official API dependency

The fallback improves service availability but is brittle and unsuitable as a trusted source layer without verification.

# 7. Client and Equipment Management

The application includes client-site management.

A client record can contain:

- Organization name
- Site information
- Contact data
- Maintenance notes
- User association
- Equipment

Equipment records can contain technical and maintenance information.

## Client Dashboard

Client users can view:

- Their client profile
- Associated equipment
- Documentation
- Maintenance-related information

## Administrative Workflows

Administrators can:

- Create a client
- Create an associated Supabase Auth user
- Create equipment records
- Edit client details
- Delete client data
- Generate reports

## PDF Reporting

A browser-side utility creates a weekly client report with `jsPDF`.

Part of the reporting code expects older equipment fields directly on the client record, while the current design stores equipment in a separate table.

# 8. Analytics

The analytics interfaces attempt to display:

- Total content
- Total views
- Document counts
- Submission trends
- AI interactions
- User activity
- Popular documents

Parts of this implementation refer to legacy names:

```text
documents
submissions
get_total_views
get_document_counts_by_type
get_submissions_by_month
```

Those tables and functions are absent from the provided consolidated migration.

# 9. Progressive Web App

The repository contains:

- PWA manifest configuration
- Static manifest
- Service worker
- Cache logic
- Offline-related assets
- Icons
- Shortcut definitions

However:

- `next-pwa` is configured with `register: false`.
- No manual service-worker registration was found.
- Cached paths omit the locale prefix.
- Static and dynamic manifest configurations differ.
- Dashboard caching may preserve stale authenticated page shells.

The PWA concept is present but not fully integrated.

# 10. Internationalization

The frontend uses `next-intl`.

Implemented interface locales:

```text
English
French
```

Other parts of the repository claim or partially support:

```text
Spanish
Arabic
German
```

Current inconsistencies include:

- README claims four interface languages.
- UI message bundles exist only for English and French.
- Document language options include German but not Arabic.
- Agent detection includes Arabic and Spanish.
- PostgreSQL full-text search is English-specific.
- PWA manifests are not locale-specific.
- No right-to-left interface handling is present.

# Detailed RAG Data Flow

```text
Administrator uploads PDF
        │
        ▼
PDF stored in Supabase Storage
        │
        ▼
Content item stored in PostgreSQL
        │
        ▼
Browser invokes ingestion API
        │
        ▼
Server splits PDF into page groups
        │
        ▼
Unstructured API parses document
        │
        ▼
Text is divided into overlapping chunks
        │
        ▼
OpenAI creates 1,536-dimensional vectors
        │
        ▼
Chunks inserted into document_chunks
        │
        ▼
User asks electrical question
        │
        ▼
GPT-4o-mini selects tools
        │
        ├── Internal semantic search
        └── Web search
        │
        ▼
Retrieved snippets added to prompt
        │
        ▼
GPT-4o-mini generates final answer
        │
        ▼
Sources displayed in assistant interface
```

# Database Model

The principal consolidated migration defines:

## Profiles

```text
profiles
```

Fields include:

- User ID linked to Supabase Auth
- Email
- Full name
- Role
- Created and updated timestamps

The SQL role constraint accepts only:

```text
user
admin
```

Application code also uses:

```text
client
```

## Categories

```text
categories
```

Used for:

- Manufacturer
- Equipment type
- Error severity
- Other document groupings

## Content

```text
content_items
content_categories
content_images
```

Content items represent official documentation and field solutions.

## AI and Activity

```text
ai_interactions
user_activity
ocr_images
```

## Vector Storage

```text
embeddings
document_chunks
```

`document_chunks` stores 1,536-dimensional vectors and searchable content.

## Client Data

Separate migrations define:

```text
clients
client_equipment
```

The migration chain is incomplete because later policies reference a missing `clients.user_id` column.

# Storage Design

The source refers to several bucket or path concepts:

```text
content_files
document_files
elec_documents
environment-configured PDF bucket
```

A single canonical bucket configuration is not established. Consolidating these names into one storage abstraction would simplify uploads, document retrieval, deployment configuration, and maintenance.

# Positive Engineering Decisions

- Uses a modern Next.js and TypeScript stack.
- Separates OpenAI, embeddings, retrieval, web search, and ingestion into library modules.
- Uses tool calling rather than a fixed single-step prompt.
- Supports both internal knowledge and current web information.
- Uses PostgreSQL vector search rather than an in-memory index.
- Includes retry logic around document parsing.
- Splits large PDFs before external processing.
- Uses overlapping chunks.
- Stores source metadata with chunks.
- Provides document-review and publishing concepts.
- Uses Zod and React Hook Form in several workflows.
- Uses SWR for data fetching.
- Includes administrative data-seeding scripts.
- Provides a synthetic end-to-end RAG smoke test.
- Uses escaped React rendering for ordinary assistant Markdown-like text.
- Provides responsive interfaces, dark styling, and localization infrastructure.
- Models clients and equipment separately.
- Includes PDF-report generation.
- Attempts offline/PWA behavior.

# Electrical Safety and Domain Review

The assistant targets high-stakes topics:

- Electrical faults
- Variable-frequency drives
- Industrial equipment
- NEC and IEC code questions
- Equipment troubleshooting
- Safety procedures

Incorrect advice can cause:

- Electric shock
- Arc-flash exposure
- Equipment damage
- Fire
- Production downtime
- Code violations

## Current Limitations

The assistant:

- Does not require user qualification.
- Does not distinguish advisory from operational instructions.
- Does not verify citations.
- Does not require official manufacturer documentation.
- Does not provide a formal lockout/tagout escalation.
- Does not abstain when evidence is weak.
- Does not identify jurisdiction before citing code.
- Does not validate standard edition or revision.
- Does not distinguish de-energized and energized work.
- Does not surface source page numbers reliably.
- Uses an internal confidence number unrelated to answer correctness.

## Required Safety Framework

For operational electrical questions, the assistant should:

1. State that qualified personnel must perform the work.
2. Require de-energization and lockout/tagout where applicable.
3. Ask for jurisdiction and code edition.
4. Ask for equipment manufacturer, model, and revision.
5. Prefer official manuals and recognized standards.
6. Cite exact pages, sections, or code articles.
7. Refuse unsafe energized-work instructions.
8. Abstain when evidence conflicts.
9. Clearly distinguish retrieved facts from model inference.
10. Require local engineering review for critical actions.

# RAG Quality Review

## Strengths

- Agent can combine internal and current external information.
- Multiple search providers improve availability.
- Tool calls can execute in parallel.
- Retrieval results include similarity values.
- Document chunks are stored persistently.
- The system can iterate through several tool calls.
- The system prompt is domain-specific.
- The source interface displays references.

## Weaknesses

- No reranker
- No query rewriting stage
- No visibility filtering
- No approval-state filtering
- No client/tenant filtering
- No source-quality score
- No document-version score
- No temporal freshness policy
- No chunk-level citation validation
- No page-level source display
- No answer-grounding verification
- No hallucination evaluation
- No benchmark dataset
- No conflict detection
- No prompt-injection defense
- No token-budget management for long grouped content
- No multi-turn conversational memory
- No question decomposition beyond tool calling

# Confidence Score Review

The assistant's confidence is calculated from average internal-document similarity.

This value is not a calibrated answer confidence.

It ignores:

- Web-only answers
- Contradictory sources
- Model uncertainty
- Citation correctness
- Retrieval completeness
- Document authority
- Document age
- Question ambiguity
- Answer synthesis quality

## Recommended naming

Replace `confidence` with:

```text
retrieval_similarity
```

or compute a richer evidence score with explicit components.

Do not present it as a probability that the answer is correct.

# Citation Review

The assistant collects source titles and URLs, but the architecture does not guarantee that each factual claim is supported by its displayed citation.

Internal references generally omit:

- Page number
- Section
- Chunk identifier
- Exact supporting passage
- Document version

## Recommended citation object

```json
{
  "source_id": "UUID",
  "title": "Manufacturer Manual",
  "document_version": "2026-03",
  "page": 47,
  "section": "5.3 Fault Reset",
  "chunk_id": "UUID",
  "supporting_excerpt": "Short excerpt",
  "similarity": 0.82,
  "visibility": "internal"
}
```

A post-generation verifier should map answer claims to source excerpts.

# Search and Ranking Review

## Vector Search

Advantages:

- Semantic matching
- Handles paraphrases
- Suitable for technical questions

Limitations:

- Fixed threshold
- No metadata filter
- No reranking
- Grouping can concatenate too much content
- Maximum similarity represents only one chunk
- Similarity is not relevance probability

## Full-Text Search

The SQL includes English text-search indexes.

Limitations:

- French documentation is not indexed linguistically.
- Spanish and Arabic support is not present.
- Manufacturer part numbers and fault codes require exact-token handling.
- Hyphenated technical identifiers may tokenize poorly.

## Recommended Retrieval Stack

```text
Query normalization
        │
        ├── Exact identifier search
        ├── Full-text search by language
        └── Vector search
        │
        ▼
Metadata and authorization filters
        │
        ▼
Cross-encoder reranking
        │
        ▼
Diversity selection
        │
        ▼
Page-aware source assembly
```

# Ingestion Correctness Review

## Non-Idempotent Inserts

The function named `upsertChunks` inserts rows.

Repeated ingestion can create duplicate chunks.

## Partial Failure

The ingestion process is not transactional.

If parsing or embedding fails midway:

- Some chunks may exist.
- Later chunks may be absent.
- Content can remain marked as published.
- Re-running can duplicate earlier chunks.

## Browser Fire-and-Forget

The document page initiates ingestion from the browser without waiting for completion.

Navigation, browser closure, or network interruption can cancel the request.

## Page Metadata

Chunk text can contain material accumulated from multiple parsed elements, while the stored page number may represent only the current or final element.

## Section Metadata

The schema contains a section-title field, but the insertion path stores it as null.

## Image Handling

Images are often represented by placeholder text rather than OCR or visual understanding.

## Recommended Ingestion State Machine

```text
uploaded
    │
    ▼
queued
    │
    ▼
parsing
    │
    ▼
chunking
    │
    ▼
embedding
    │
    ▼
indexing
    │
    ├── failed
    └── ready
```

Each content version should have an immutable ingestion job and checksum.

# Web Search Reliability Review

## Missing Timeouts

Provider fetches do not consistently enforce explicit timeouts.

A slow search service can delay the entire assistant request.

## Source Trust

Results are accepted based on provider snippets.

No domain allowlist distinguishes:

- Manufacturer documentation
- Government regulations
- Standards organizations
- Forums
- SEO content
- Generated spam

## DuckDuckGo Parsing

HTML result parsing uses regular expressions.

Search-page structure changes can silently break results.

## Recommended Source Policy

For electrical guidance, rank sources approximately:

```text
1. Manufacturer documentation
2. Government regulator
3. Official standards organization
4. Recognized technical institution
5. Authorized distributor
6. Reviewed field solution
7. General web source
```

The assistant should label lower-authority evidence.

# Schema and Migration Review

## Risk Summary

| Severity | Schema issue |
|---|---|
| Critical | `client` role used by code but rejected by profile SQL constraint |
| Critical | Client-equipment migration references missing `clients.user_id` |
| High | `error_codes` used by the UI but absent from migrations |
| High | `submissions` used by pages but absent from migrations |
| High | Analytics uses unavailable tables and RPC functions |
| High | Storage buckets and policies are not reproducible |
| Medium | Legacy and unified content systems coexist |
| Medium | TypeScript types contain fields absent from SQL |
| Medium | Multiple bucket names indicate configuration drift |
| Medium | RLS scripts are advisory rather than applied migrations |

# Critical Schema Finding 1: Role Constraint Conflict

The database constraint allows only:

```text
user
admin
```

Application code creates and expects:

```text
client
```

Against the supplied migration, a client-profile insert will fail.

## Required action

Create a single canonical role enum or role table.

Example:

```text
admin
technician
client
reviewer
```

Use it consistently in:

- SQL
- TypeScript types
- API validation
- User interfaces
- RLS policies
- Tests
- Documentation

# Critical Schema Finding 2: Broken Client Migration

The client-equipment migration creates policies referencing:

```text
clients.user_id
```

The earlier migration does not create that column, and the intervening migration is empty.

A clean migration run can therefore fail.

## Required action

Create a migration that:

1. Adds `clients.user_id`.
2. Adds a foreign key to `auth.users`.
3. Adds a unique or partial-unique constraint where appropriate.
4. Backfills existing clients.
5. Creates indexes.
6. Adds RLS policies after the column exists.

# Missing `error_codes`

The content forms and TypeScript types refer to error codes.

The migration set does not create:

```text
error_codes
content_error_codes
```

# Missing `submissions`

Legacy pages refer to a submissions table.

The migration set does not create it.

The project should either:

- Complete the old submissions workflow, or
- Remove it in favor of `content_items` with `field_solution` type and status.

# Analytics Drift

The analytics code refers to:

```text
documents
get_total_views
get_document_counts_by_type
get_submissions_by_month
```

The schema uses `content_items`, and the referenced RPCs are absent.

The analytics page is likely nonfunctional against a clean database created from this repository.

# API Validation Review

Several API routes perform basic checks but lack a consistent validation layer.

Recommended Zod schemas should enforce:

- Email format
- Password policy
- Role allowlist
- UUID format
- File size
- File type
- Message length
- Content-item ownership
- Equipment field lengths
- URL validation
- Search limits

API responses should use fixed error codes rather than raw exception messages.

# Performance and Cost Review

## Potential Cost Drivers

- OpenAI initial tool-selection call
- Up to four additional model iterations
- Query embedding
- Document embeddings during ingestion
- Unstructured API page parsing
- Tavily or SerpAPI requests
- Supabase vector queries
- Large prompt contexts

## Current Risks

- No per-user quota
- No message-length limit
- No upload-size limit at server route
- No page-count limit
- No budget cap
- No caching of repeated assistant queries
- No duplicate-document checksum
- Repeated ingestion
- Large grouped chunk context

## Recommended Controls

- Token and request budgets
- Per-user and per-organization quotas
- Upload limits
- PDF page limits
- Content checksums
- Embedding cache
- Retrieval cache
- Query cache where safe
- Search-provider timeouts
- Cost telemetry
- Alert thresholds
- Graceful degradation
- Job queue for ingestion

# Reliability Review

## External Dependencies

The platform depends on:

- Supabase
- OpenAI
- Unstructured
- Tavily
- SerpAPI
- DuckDuckGo HTML
- Vercel or another Next.js host

## Missing Reliability Features

- Central retry policy
- Circuit breakers
- Health checks
- Provider status reporting
- Queue-backed ingestion
- Dead-letter jobs
- Idempotency
- Reconciliation jobs
- Structured tracing
- Deployment observability

# Conversation Design Review

The assistant UI visually resembles a chat, but each request sends only the newest user message.

Previous messages remain only in React state.

## Impact

Follow-up questions such as:

```text
What voltage does it require?
```

do not include the prior equipment context.

## Required action

Send a bounded, server-validated message history or store a conversation thread server-side.

Apply:

- Token-window management
- Summarization
- Sensitive-data controls
- Conversation ownership
- Retention rules

# Image Input Review

The assistant interface allows the user to select and preview an image.

The image is not sent to the server or analyzed.

## Impact

The interface implies a capability that does not exist.

## Required action

Either remove the image control or implement:

- Secure upload
- Vision-model processing
- Equipment-label OCR
- Image-size limits
- Privacy handling
- Clear supported-use description

# AI Interaction Storage

The frontend stores AI interactions in Supabase.

The `sources` value is serialized with `JSON.stringify` before being inserted into a JSONB field.

This can create a JSON string inside JSON rather than a structured JSON array.

## Required action

Insert the structured JavaScript object directly.

Also store:

```text
model
prompt version
tool calls
source IDs
latency
token usage
safety state
retrieval filters
```

# View Count Review

The content hook increments views using a client-side read-modify-write sequence.

## Risks

- Lost updates
- User manipulation
- Repeated refresh inflation
- Additional database round trips

## Required action

Use a server-side atomic RPC:

```sql
UPDATE content_items
SET view_count = view_count + 1
WHERE id = ...
```

Apply deduplication or analytics events where required.

# PWA Review

## Positive Elements

- Manifest files
- Icons
- Service worker
- Offline cache concept
- Installable-application intent

## Defects

- Automatic service-worker registration is disabled.
- No manual registration is visible.
- Cache paths lack locale prefixes.
- Manifest sources disagree.
- Start URLs may redirect unexpectedly.
- Authenticated dashboard page shells can become stale.
- No explicit cache versioning tied to releases.
- No offline data policy for sensitive client information.

# Testing Review

## Existing Tests and Scripts

The repository includes scripts for:

- Creating users and categories
- Seeding content
- Verifying database objects
- Testing vector search
- Testing hybrid search
- Cleaning up synthetic chunks

The RAG smoke test:

1. Inserts synthetic electrical chunks.
2. Generates embeddings.
3. Runs vector search.
4. Runs hybrid search.
5. Tests paraphrased queries.
6. Removes test data unless instructed otherwise.

This is a useful infrastructure-level retrieval test.

## Missing Test Coverage

The repository does not include a comprehensive application test suite for:

- Ingestion idempotency
- Parser failures and retries
- Chunk metadata
- Exact fault-code retrieval
- Multilingual retrieval
- Citation support
- Tool-loop limits
- Schema migrations
- Analytics
- Client reports
- PWA behavior
- Accessibility
- Browser workflows

# Recommended Minimum Test Suite

## Ingestion

```text
test_ingestion_rejects_invalid_content_item
test_ingestion_rejects_non_pdf
test_ingestion_rejects_oversized_pdf
test_ingestion_page_limit
test_ingestion_is_idempotent
test_failed_ingestion_rolls_back
test_reingestion_replaces_old_version
test_chunk_page_metadata
test_parser_retry_behavior
```

## Retrieval and RAG

```text
test_exact_fault_code_retrieval
test_french_document_retrieval
test_hybrid_search_ranking
test_conflicting_source_handling
test_citation_support
test_tool_iteration_limit
test_web_search_timeout
test_low_evidence_abstention
test_grouped_context_limit
```

## Client and Reporting

```text
test_client_creation_transaction
test_client_role_schema
test_equipment_requires_valid_client
test_client_pdf_uses_equipment_table
test_client_delete_cleanup
test_report_generation
```

## Interface

```text
test_image_input_not_shown_when_unsupported
test_locale_routes
test_pwa_service_worker_registration
test_analytics_queries
test_accessibility_baseline
```

# Recommended Target Architecture

```text
Browser
    │
    ▼
Next.js server layer
    │
    ├── Request validation
    ├── Application routing
    ├── Usage controls
    └── Structured logging
        │
        ├───────────────────────────────────┐
        ▼                                   ▼
Application services                    Background jobs
        │                                   │
        ├── Content service                 ├── PDF parsing
        ├── Client service                  ├── Chunking
        ├── Equipment service               ├── Embedding
        ├── Search service                  └── Index replacement
        └── Assistant service
                │
                ▼
          Metadata-aware retrieval
                │
     ┌──────────┼─────────────┐
     ▼          ▼             ▼
Exact search  Full text     Vector search
                │
                ▼
             Reranker
                │
                ▼
        Evidence package
                │
                ▼
       Tool-controlled generation
                │
                ▼
       Citation and quality verifier
```

# Recommended Assistant Safety Layer

Before generation:

- Identify jurisdiction.
- Identify manufacturer and model.
- Detect high-risk work.
- Filter sources by authority.
- Check document version.
- Check user role.

After generation:

- Verify factual claims against evidence.
- Verify citations.
- Add lockout/tagout guidance.
- Add qualified-person requirement.
- Flag energized-work instructions.
- Abstain when evidence is insufficient.
- Record model and source versions.

# Development Roadmap

## Phase 1 — Repair the Schema

1. Consolidate the role model used by SQL and TypeScript.
2. Add the missing client relationship fields.
3. Add missing foreign keys and indexes.
4. Add or remove the `error_codes` model consistently.
5. Consolidate legacy submissions into the unified content model.
6. Repair analytics queries.
7. Standardize bucket names.
8. Remove stale TypeScript fields.
9. Create a clean baseline migration.
10. Test migration from an empty database.

## Phase 2 — Stabilize Ingestion

1. Move ingestion to a background queue.
2. Add PDF size and page limits.
3. Add content checksums.
4. Make ingestion idempotent.
5. Replace chunks transactionally.
6. Track ingestion state.
7. Store parser and embedding versions.
8. Preserve reliable page and section metadata.
9. Add document-version records.

## Phase 3 — Improve Retrieval

1. Use hybrid search in production.
2. Add exact fault-code and part-number search.
3. Add language-aware text indexes.
4. Add metadata filtering.
5. Add reranking.
6. Add diversity selection.
7. Limit grouped context size.
8. Add document-version ranking.
9. Add source-authority ranking.
10. Add evaluation datasets.

## Phase 4 — Improve Answer Quality

1. Require source-backed answers.
2. Add citation verification.
3. Add electrical-domain response templates.
4. Ask for jurisdiction and code edition where relevant.
5. Add abstention for weak evidence.
6. Detect conflicting sources.
7. Add response-quality reviews.
8. Add tool and token budgets.

## Phase 5 — Reliability and Cost

1. Add request timeouts.
2. Add provider circuit breakers.
3. Add model and search usage telemetry.
4. Add usage quotas and budgets.
5. Add duplicate-query caching where appropriate.
6. Add background-job monitoring.
7. Add dead-letter handling.
8. Add health checks.
9. Add cost alerts.

## Phase 6 — Product Completion

1. Implement real multi-turn conversations.
2. Remove or implement image analysis.
3. Repair analytics.
4. Complete client reports.
5. Align interface and retrieval languages.
6. Register and test the PWA service worker.
7. Add accessibility testing.
8. Add onboarding and user guidance.
9. Document deployment and operations.

# Suggested Production Environment

```text
Next.js application
        │
        ├── Request controls
        ├── Structured logging
        └── Sentry/OpenTelemetry
                │
                ▼
        Supabase PostgreSQL
        and pgvector
                │
                ▼
        Queue-backed ingestion workers
                │
        ┌───────┼─────────┐
        ▼       ▼         ▼
Unstructured  OpenAI   Document validation
```

# Repository Hygiene Recommendations

- Remove obsolete schema references.
- Remove duplicate API-key modal components.
- Remove unused simulated assistant code.
- Remove unsupported image controls.
- Consolidate bucket names.
- Consolidate ingestion and chunking implementations.
- Consolidate scripts into the main dependency system.
- Add CI.
- Add linting and type checks to deployment.
- Add database migration verification.
- Add environment-variable documentation.
- Add missing architecture and web-search documents referenced by the README.

# README Accuracy Review

## Claims that need revision

### Roles

README:

```text
Admin
Manager
User
```

Source and schema:

```text
admin
user
client
electrician references
supervisor references
```

### Languages

README claims:

```text
English
French
Spanish
Arabic
```

Frontend message bundles support:

```text
English
French
```

### Model

README refers broadly to GPT-4.

Source uses:

```text
gpt-4o-mini
```

### Image Analysis

The assistant shows an image selector but does not process the image.

### PWA

PWA resources exist, but service-worker registration is not completed.

### Architecture Documents

The README links to documents absent from the archive.

# Project Maturity Assessment

| Area | Assessment |
|---|---|
| Frontend design | Strong prototype |
| Next.js structure | Good |
| Agentic tool loop | Good concept |
| Vector retrieval | Functional concept requiring ranking evaluation |
| PDF ingestion | Substantial but not fully idempotent |
| Web search | Multi-provider implementation |
| Database reproducibility | Needs consolidation |
| Role model | Inconsistent across source and schema |
| Client management | Substantial interface, incomplete schema path |
| Analytics | Uses stale queries |
| PWA | Partially configured |
| Internationalization | English and French interface support |
| Testing | Infrastructure smoke tests only |
| Electrical-domain answer quality | Requires formal evaluation |
| Production readiness | Prototype stage |

# Engineering Skills Demonstrated

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Storage
- PostgreSQL
- SQL migrations
- Row Level Security concepts
- `pgvector`
- OpenAI tool calling
- OpenAI embeddings
- Agentic RAG
- Semantic search
- Hybrid search design
- PDF splitting
- Document parsing
- Chunking
- Metadata extraction
- Web search integration
- Tavily
- SerpAPI
- Internationalization
- PWA configuration
- Client and equipment management
- Browser PDF generation
- Form validation
- SWR data hooks
- Administrative dashboards
- Technical-document workflows
- AI-safety architecture

# Resume-Ready Description

**Agentic RAG Technical Documentation Platform**

Developed a full-stack technical-documentation platform using Next.js, React, TypeScript, Supabase, PostgreSQL/pgvector, OpenAI, Unstructured, and Tailwind CSS. Built PDF ingestion with page splitting, structured-content extraction, overlapping chunk generation, and 1,536-dimensional embeddings; implemented an OpenAI tool-calling agent that combines internal vector retrieval with Tavily, SerpAPI, and DuckDuckGo web search; and created document publishing, field-solution review, user administration, client equipment, analytics, localization, and PWA interfaces.

# Compact Portfolio Description

Agentic electrical-documentation platform built with **Next.js, TypeScript, Supabase, PostgreSQL/pgvector, OpenAI, Unstructured, Tavily, and Tailwind CSS**. Supports PDF ingestion, semantic retrieval, tool-controlled web search, technical Q&A with sources, content review, clients, equipment, analytics, and multilingual interfaces.

# Accurate Portfolio Positioning

> Designed and implemented a feature-rich prototype for agentic technical-document retrieval using Next.js, Supabase, OpenAI embeddings, `pgvector`, external PDF parsing, and multi-provider web search. The project demonstrates document ingestion, semantic and hybrid retrieval, AI tool calling, content workflows, client equipment management, reporting, localization, and progressive-web-application concepts.

# Final Assessment

The repository demonstrates substantial application-development and AI-integration ability. Its strongest portfolio elements are the agentic retrieval loop, PDF-processing pipeline, vector-search schema, technical-document interfaces, client/equipment workflows, and administrative dashboard.

The most valuable next steps are to consolidate the database schema, make ingestion idempotent, improve retrieval evaluation and citation quality, complete analytics and reporting, and add comprehensive tests.

With those refinements, the platform can progress from a strong prototype toward a polished technical-knowledge product.
