# Intelligent Job Application Assistant — Deep Project Analysis

**Repository referenced:** [yassernamez03/Intelligent-job-application-Assistant](https://github.com/yassernamez03/Intelligent-job-application-Assistant)  
**Archive analyzed:** `Intelligent-job-application-Assistant-main.zip`  
**Application type:** Multi-service AI career-assistance and job-application platform  
**Analysis basis:** Full uploaded source archive, including the Next.js frontend, eight Python services, PostgreSQL schema and migrations, Redis/Celery integrations, LangGraph workflows, MCP-style tools, resume and document generation, external job-source integrations, notification workers, analytics, Docker Compose, Nginx, Helm, Terraform, CI/CD workflows, and observability configuration.

> This is a static source-code and architecture review. The backend Python packages passed syntax compilation, but the complete distributed application was not executed against live PostgreSQL, Redis, Groq, ElevenLabs, OAuth providers, SMTP, Kubernetes, or AWS infrastructure.

# Executive Summary

The Intelligent Job Application Assistant is an ambitious full-stack platform designed to support job seekers throughout the application lifecycle.

The system combines:

- User authentication and OAuth
- Career-profile management
- Resume upload and parsing
- Skill extraction
- Job discovery and search
- Personalized job matching
- Human-in-the-loop resume tailoring
- Cover-letter generation
- ATS keyword analysis
- Company research
- Competitor job intelligence
- Referral discovery
- Text and audio interview preparation
- Application tracking
- Email reminders
- Analytics
- Real-time agent activity
- Multi-service deployment and observability

The product uses a microservice-oriented architecture with a Next.js frontend, a FastAPI API gateway, seven domain services, PostgreSQL, Redis, Celery, Groq-hosted language models, LangGraph, speech transcription, text-to-speech, document generation, and several job-search providers.

The strongest engineering areas are the structured human-in-the-loop CV workflow, multi-source job ingestion, deterministic and LLM-assisted skill extraction, specialized agents, audio interview feedback, broad frontend coverage, and extensive Docker, Helm, Terraform, CI/CD, and observability assets.

The primary remaining engineering work involves durable workflow execution, database-migration consolidation, notification deployment, document-template packaging, event replay, test coverage, and production configuration alignment.

The project is best positioned as a **sophisticated multi-service AI career-assistance prototype** with substantial product, agent, document-processing, speech, and infrastructure scope.

# Repository Scale

Approximate source composition:

| Area | Files | Approximate lines |
|---|---:|---:|
| Python | 161 | 17,702 |
| TSX | 124 | 18,405 |
| TypeScript | 29 | 3,722 |
| Helm YAML | 65 | 1,974 |
| Terraform | 7 | 653 |
| Dockerfiles | 9 | — |
| Shell scripts | 12 | — |
| Total repository files | 486 | — |
| Frontend text source | — | ~34,071 |
| Service text source | — | ~18,180 |

Automated tests are concentrated in the agent-orchestration service:

```text
services/agent-orchestration/tests/test_skills_extractor.py
services/agent-orchestration/tests/test_job_matching_agent.py
```

Approximately 21 test functions were identified.

No substantive frontend test script was found.

# Source Structure

```text
Intelligent-job-application-Assistant-main/
├── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── db/
│   └── schema.sql
├── docs/
│   └── observability.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   └── Dockerfile
├── services/
│   ├── api-gateway/
│   ├── user-service/
│   ├── agent-orchestration/
│   ├── mcp-server/
│   ├── document-service/
│   ├── job-search-service/
│   ├── notification-service/
│   └── analytics-service/
├── latex_templates/
├── nginx/
├── helm/
├── infra/
│   └── terraform/
├── terraform/
│   └── main.tf
├── grafana/
├── scripts/
└── .github/
    └── workflows/
```

# Service Inventory

| Service | Default port | Main responsibility |
|---|---:|---|
| API Gateway | 8000 | JWT verification, routing, metrics, WebSocket proxy |
| User Service | 8001 | Identity, OAuth, profiles, refresh tokens, account deletion |
| Agent Orchestration | 8002 | LangGraph workflows, CV tailoring, interview coaching, research agents |
| MCP Server | 8003 | Internal database, web, document, and file-generation tools |
| Document Service | 8004 | Resume upload, parsing, skills, tailored-document download |
| Job Search Service | 8005 | Job ingestion, search, applications, matching, status tracking |
| Notification Service | 8006 | Email reminders and status notifications |
| Analytics Service | 8007 | Dashboard metrics, views, activity, and reporting |

# Technology Stack

## Frontend

- Next.js 16.2
- React 19.2
- TypeScript 5.7
- Tailwind CSS 4
- shadcn/ui
- Radix UI
- TanStack Query
- React Hook Form
- Zod
- Recharts
- Three.js
- React Three Fiber
- 3D avatar assets
- Vercel Analytics

## Backend

- Python 3.11
- FastAPI
- Uvicorn
- SQLAlchemy async
- PostgreSQL 15
- Alembic
- Pydantic
- JWT
- bcrypt and Passlib
- OAuth 2.0
- Redis and Redis Stack
- Celery
- LangGraph
- LangChain-related integrations
- HTTPX

## AI and Speech

- Groq-hosted language models
- Llama-family model configuration
- Groq Whisper transcription
- ElevenLabs text-to-speech
- LLM-assisted extraction, ranking, writing, research, and evaluation

## Documents

- pdfplumber
- python-docx
- WeasyPrint
- LaTeX and `pdflatex`
- PDF-to-DOCX conversion
- PDF generation
- DOCX generation
- Resume parsing

## External Job Sources

- RemoteOK
- Arbeitnow
- Adzuna

## Infrastructure

- Docker Compose
- Nginx
- Helm
- Kubernetes
- Amazon EKS
- Amazon ECR
- Terraform
- GitHub Actions
- Prometheus
- Grafana
- Loki
- node-exporter

# High-Level Architecture

```text
Browser
   │
   ▼
Nginx
   │
   ├── Next.js frontend
   └── API Gateway
           │
           ├── User Service
           ├── Agent Orchestration
           ├── MCP Server
           ├── Document Service
           ├── Job Search Service
           ├── Notification Service
           └── Analytics Service
                   │
       ┌───────────┼──────────────────┐
       ▼           ▼                  ▼
 PostgreSQL      Redis              External services
 identity        pub/sub            Groq
 jobs            checkpoints        ElevenLabs
 resumes         Celery             OAuth providers
 applications    OAuth state        Job APIs
 analytics                          SMTP
```

# Main Product Features

# 1. Account and Identity Management

Implemented capabilities include:

- Email/password registration
- Login
- Short-lived access JWT
- Refresh JWT in an HttpOnly cookie
- Refresh-token identifier persistence
- Token rotation
- Logout and refresh-token revocation
- Password change
- Google OAuth
- LinkedIn OAuth
- OAuth-provider linking
- Account deletion
- Profile setup
- Avatar upload

## Intended Token Flow

```text
Login
   │
   ▼
Access token returned to frontend memory
   │
   ├── Used for API calls
   └── Short lifetime
   │
   ▼
Refresh token stored in HttpOnly cookie
   │
   ▼
Refresh endpoint rotates JTI
   │
   ▼
New access and refresh tokens
```

The design contains several positive choices, especially the HttpOnly refresh cookie and JTI persistence, but token-type validation is incomplete.

# 2. Career Profile

A profile can include:

- Skills
- Career goals
- Preferred role
- Salary range
- Location
- Remote-work preference
- Industry
- Professional summary
- Avatar
- Profile-completion state

The frontend uses a profile-completion guard to guide users through onboarding.

# 3. Resume Management

Users can:

- Upload PDF resumes
- Upload DOCX resumes
- Extract text
- Extract skills
- Avoid duplicate uploads through content hashing
- Download original resumes
- Download tailored PDF resumes
- Download tailored DOCX resumes
- Delete resumes

## Resume Flow

```text
Authenticated upload
        │
        ▼
Size and MIME checks
        │
        ▼
Generated stored filename
        │
        ▼
Content hash
        │
        ├── Existing hash for user → reuse/reject duplicate
        └── New document
                │
                ▼
        PDF/DOCX text extraction
                │
                ▼
        Skill extraction
                │
                ▼
        Resume metadata stored
```

# 4. Skill Extraction

The platform combines:

- Deterministic taxonomy matching
- Text normalization
- Resume parsing
- LLM-based augmentation

This hybrid approach is useful because it preserves stable recognized skills while allowing the model to identify less common technologies and role-specific terms.

# 5. Job Discovery

The system integrates:

- RemoteOK
- Arbeitnow
- Adzuna
- Pasted job descriptions
- Job URLs
- User-created job records

Job records support:

- Title
- Company
- Location
- Remote status
- Salary-related fields
- Description
- Requirements
- Source
- Source URL
- Publication information
- Search metadata

# 6. Job Search

The job service provides:

- Keyword search
- Filters
- Cursor pagination
- Job details
- Full-text-search migrations
- Personalized result concepts
- Match scores
- Job-view tracking
- Lazy AI-based markdown formatting

# 7. Personalized Job Matching

The matching pipeline considers:

- Resume skills
- Profile skills
- Job requirements
- Job description
- Career goals
- User preferences
- LLM evaluation

The application stores job-match scores separately from tailored-resume records.

# 8. Human-in-the-Loop CV Tailoring

This is one of the most notable project features.

## Workflow

```text
User selects job
        │
        ▼
User selects base resume
        │
        ▼
System extracts job requirements
        │
        ▼
Agent proposes section options
        │
        ▼
User reviews and selects options
        │
        ▼
Agent generates section content
        │
        ├── User accepts
        ├── User edits
        └── User regenerates individual section
                │
                ▼
        Final user approval
                │
                ▼
        Resume and cover letter compiled
                │
        ├── PDF
        └── DOCX
                │
                ▼
        ATS keyword and match analysis
```

Potential sections include:

- Professional summary
- Skills
- Experience
- Projects
- Education
- Achievements
- Cover letter

The workflow is preferable to fully automatic resume rewriting because it keeps the user in control.

# 9. ATS Analysis

The application calculates concepts such as:

- Keyword matches
- Missing keywords
- Skill overlap
- Job-resume match score
- Tailoring recommendations

These values should be presented as heuristics rather than guarantees of applicant-tracking-system performance.

# 10. Company Research

The company-research agent can assemble:

- Company overview
- Products and services
- Industry
- Culture indicators
- Interview-relevant facts
- Recent web information
- Potential discussion points

Web information is model-generated from search and fetched material and therefore requires source verification.

# 11. Competitor Job Intelligence

The competitor-intelligence workflow can compare:

- Similar roles
- Competing employers
- Skill demand
- Salary or location signals
- Job-description patterns
- Market positioning

# 12. Referral Discovery

The referral agent generates:

- Search links
- Potential employee names from public snippets
- Suggested outreach text
- Referral-search strategies

The source avoids directly returning private phone numbers, personal email addresses, and unverified profile URLs, which is a positive privacy decision.

Results still need explicit verification because search snippets and model extraction can be wrong.

# 13. Interview Preparation

The system can generate:

- Job-specific interview questions
- Technical questions
- Behavioral questions
- Suggested answer frameworks
- Written-answer evaluation
- Interview feedback
- Score-like summaries
- Question history

# 14. Audio Mock Interviews

Audio features include:

- Browser audio recording
- Upload to the agent service
- Groq Whisper transcription
- LLM-based feedback
- Score generation
- ElevenLabs speech output
- 3D avatar presentation
- Lip-synchronization concepts
- LangGraph checkpoint persistence in Redis

## Audio Flow

```text
Question generated
        │
        ▼
Question spoken by TTS/avatar
        │
        ▼
User records answer
        │
        ▼
Audio uploaded
        │
        ▼
Whisper transcription
        │
        ▼
LLM evaluation
        │
        ▼
Feedback, score, and next question
```

# 15. Application Tracking

Applications can move through a Kanban workflow:

```text
saved
  │
  ▼
applied
  │
  ▼
screening
  │
  ▼
interview
  │
  ▼
offer
```

Alternative terminal state:

```text
rejected
```

The application stores:

- Status
- Notes
- Job association
- Resume association
- Status timestamps
- Manual applications
- Notification triggers

# 16. Analytics

Analytics concepts include:

- Dashboard totals
- Job views
- Applications by status
- Match-score statistics
- Resume activity
- Agent activity
- Interview activity
- Recent events

# 17. Notifications

The notification service supports:

- Application-status emails
- Account-deletion confirmation
- Reminder emails
- User preferences
- Celery-based delivery
- Scheduled jobs

# 18. Real-Time Activity

The system uses:

- WebSocket
- Server-Sent Events
- Redis Pub/Sub
- Agent event channels
- Progress events
- LangGraph checkpointing

This provides frontend visibility into long-running agent workflows.

# Agent Architecture

Implemented agents include:

```text
JobDiscoveryAgent
JobMatchingAgent
CVAgent
CompanyResearchAgent
InterviewPrepAgent
CompetitorJobIntelAgent
ReferralFinderAgent
```

# Agent Event Flow

```text
HTTP trigger or internal event
        │
        ▼
Agent graph starts
        │
        ▼
Progress event published to Redis
        │
        ▼
Gateway or agent WebSocket/SSE listener
        │
        ▼
Frontend receives status update
        │
        ▼
Agent stores result in PostgreSQL
```

# MCP Tool Layer

The MCP-style service exposes tools such as:

```text
read_document
read_job
read_profile
generate_pdf
generate_docx
generate_latex_pdf
web_search
web_fetch
clean_html
```

The architectural goal is sensible: centralize privileged retrieval and generation capabilities behind a tool boundary.

# Database Model

The primary schema script contains or patches tables including:

```text
users
profiles
jobs
resumes
applications
company_briefings
interview_questions
agent_event_log
agent_task_log
job_views
interview_audio_sessions
cv_hitl_sessions
job_match_scores
competitor_job_intel
referral_suggestions
```

Other service-local initialization code adds or alters related structures.

# Selected Data Relationships

```text
User
├── Profile
├── Resumes
├── Applications
├── Job views
├── Interview sessions
├── CV HITL sessions
├── Job-match scores
├── Company briefings
├── Competitor intelligence
└── Referral suggestions

Job
├── Applications
├── Match scores
├── Tailored resumes
├── Interview questions
├── Company briefing
└── Competitor intelligence
```

# Positive Engineering Decisions

- Clear separation of major business domains into services
- Gateway removes client-supplied `X-User-ID` before injecting identity
- Access tokens are kept in frontend memory rather than persisted by default
- Refresh token uses an HttpOnly cookie
- Refresh-token records use JTI concepts
- Refresh flow rotates token identifiers
- OAuth state is stored in Redis and consumed atomically
- Passwords use bcrypt-based hashing
- Resume filenames are generated rather than directly trusting the original name
- Resume hash deduplication is scoped to the user
- Resume ownership is checked in several document operations
- Avatar images are validated and normalized
- Skill extraction combines deterministic and model-assisted methods
- CV generation uses explicit human review
- Individual CV sections can be regenerated
- ATS analysis is attached to the tailored-document workflow
- Agent result queries are generally user-scoped
- Referral outputs avoid private direct-contact information
- Python service source passes syntax compilation
- Infrastructure-as-code and observability received substantial attention
- GitHub OIDC is used in the newer AWS deployment path
- The repository attempts account-deletion and data-purge workflows

# Workflow and Data-Integrity Findings

## Manual Application Notification Defect

Manual applications can have no job ID.

The status-notification path serializes a missing value and sends it to a schema that expects a UUID.

The notification can fail for manual application status changes.

## Fire-and-Forget Agent Work

Several routes launch:

```python
asyncio.create_task(...)
```

inside the web process.

## Impact

- Work is lost on restart
- No durable retry
- No queue visibility
- No dead-letter handling
- No guaranteed completion
- Difficult deployment draining

LangGraph checkpoints preserve state, but no durable dispatcher guarantees that abandoned tasks resume.

Use Celery, Redis Streams, or another durable workflow scheduler.

## Pub/Sub Delivery Semantics

Redis Pub/Sub is at-most-once.

Events disappear when consumers are disconnected.

There is no:

- Acknowledgment
- Replay
- Retry
- Dead-letter queue
- Consumer offset

Use Redis Streams, Kafka, RabbitMQ, or Celery for durable business events.

## Agent Listener Failure

A fatal listener exception can end the listener while the HTTP service remains healthy.

Add:

- Supervision
- Restart loop
- Health state
- Readiness failure
- Metrics
- Alerting

## Job Discovery Uses the Wrong Join

The discovery agent checks for unscored jobs through tailored-resume records.

Pre-CV scores are stored in `job_match_scores`.

Users without tailored resumes may be rescored repeatedly despite an existing match-score row.

## Duplicate CV Sessions

The CV trigger checks for existing output and then creates a HITL session.

Without a unique active-session constraint, concurrent requests can produce duplicate:

- Sessions
- Agent work
- Model cost
- PDFs
- DOCX files
- Resume rows

Use an idempotency key and unique partial index.

# Resume Processing Review

## Positive Controls

- Generated stored filenames
- Per-user content hashing
- Size limit
- PDF and DOCX allowlist
- User-scoped duplicate handling
- Text extraction
- Skill extraction

## Remaining Processing Work

- Add document-signature validation.
- Add PDF structural validation.
- Add DOCX archive-size limits.
- Add page-count limits.
- Stream large uploads.
- Add parser timeouts.
- Return explicit malformed-document errors.
- Track extraction status and parser version.

# WebSocket Review

The platform uses WebSockets for long-running agent progress and interview interactions.

The current in-memory connection registry is process-local, which limits horizontal scaling. A multi-replica deployment should use a shared connection/event layer, bounded queues, heartbeat handling, idle timeouts, and connection metrics.

# Server-Sent Events Review

The SSE path uses Redis Pub/Sub to forward agent activity.

Each client can hold a dedicated Redis subscription, and the current queue model is unbounded. A production implementation should add queue limits, heartbeats, event coalescing, maximum connection duration, and a durable event option for reconnecting clients.

# Schema and Migration Review

# Fragmented Schema Authority

The repository uses all of the following:

```text
db/schema.sql
User-service Alembic
Job-service Alembic
Base.metadata.create_all()
Startup CREATE TABLE
Startup ALTER TABLE
Service-specific runtime patches
```

A comment says Alembic is authoritative, but the runtime implementation contradicts that claim.

## Impact

- Clean installation is unreliable
- Upgrade order is unclear
- Rollbacks are unsafe
- Different environments can have different schemas
- Constraints and indexes can be missing
- Service startup becomes a migration mechanism
- Schema changes are difficult to audit

## Required action

1. Select one migration authority.
2. Create a complete baseline.
3. Assign table ownership by service.
4. Remove runtime DDL.
5. Remove production `create_all()`.
6. Test an empty-database upgrade.
7. Test release-to-release upgrades.
8. Test downgrades where supported.
9. Add schema checks in CI.

# User-Service Migration Defect

The first user-service migration has no parent revision but alters an already existing user table.

It does not create the complete base identity schema.

Alembic alone cannot bootstrap the user service from an empty database.

# Invalid Migration Downgrade

One downgrade attempts to convert a UUID user identifier back to integer using an integer cast.

UUID values cannot generally be converted that way.

Downgrade testing would expose this defect.

# Deployment Review

# Local Docker Compose

The development stack publishes:

```text
Nginx: 80 / 443
Frontend: 3000
Services: 8000–8007
PostgreSQL: 5432
Redis: 6379
Prometheus: 9090
node-exporter: 9100
Loki: 3100
Grafana: 3001
```

# Production Compose and Nginx Conflict

The production Compose publishes only HTTP port 80.

The Nginx configuration redirects HTTP to HTTPS and listens on 443.

The Compose file does not provide the required certificate mount or publish 443.

Possible outcomes:

- Nginx startup failure
- Redirect to unreachable HTTPS
- Missing certificate errors
- Inaccessible deployment

# Missing Production Notification Workers

The production Compose does not include the notification Celery worker or scheduler.

Queued notification tasks cannot be delivered without another separately deployed worker.

# Missing CV Templates in Production Images

The MCP and agent Dockerfiles do not clearly copy the root `latex_templates` directory into their images.

The production Compose does not mount the templates.

PDF and cover-letter generation can fail in production even when it works in local Compose.

# Missing Prometheus Configuration

The top-level Compose references a root Prometheus configuration file that is absent from the inspected tree.

The Prometheus container may fail to start or use an invalid mount.

# Development Dockerfile Concerns

- Several images run as root.
- Python dependencies are mostly unpinned.
- Mutable `latest` tags are used.
- Development services use `--reload`.
- Frontend startup installs packages dynamically.
- Build reproducibility is weak.

# Kubernetes and Helm Review

The repository includes a substantial Helm structure with:

- Separate service deployments
- Configurable values
- EKS compatibility
- Observability charts
- Service-specific manifests

The main completion work is to standardize resource requests and limits, add autoscaling policies, define disruption budgets, verify all services, workers, templates, and health checks in one release process.

# Terraform Review

Two infrastructure approaches coexist.

## Newer AWS path

```text
infra/terraform/
```

Includes concepts for:

- EKS
- ECR
- GitHub OIDC
- Kubernetes deployment

This is the stronger architecture.

## Legacy EC2 Path

`terraform/main.tf` represents an older EC2-oriented deployment with a public instance, static AMI assumptions, learner-lab configuration, and an Elastic IP.

Keeping both the EC2 and EKS approaches creates deployment ambiguity. The repository should select one primary production path and archive the other as a historical example.

# CI/CD Review

## Positive elements

- Python linting
- Black formatting checks
- Frontend linting
- Bandit
- Trivy
- Pytest matrix
- Docker concepts
- GitHub OIDC
- ECR/EKS deployment design

## Weaknesses

- Trivy is configured not to fail the build.
- Services without tests are silently skipped.
- No coverage threshold.
- No substantive frontend tests.
- No mandatory frontend type check.
- No full frontend production build gate.
- No migration bootstrap test.
- No integration test across gateway and services.
- CI comments and names refer to OpenAI while source uses Groq.

# Frontend Review

# Positive Areas

- Broad feature coverage
- Responsive dashboard
- Rich CV-review interface
- Application Kanban
- Job search and filters
- Interview UI
- Audio recording
- Avatar integration
- Query caching
- Form validation
- User-specific cache cleanup
- Access token kept primarily in memory
- HttpOnly refresh-token design
- Reusable UI components

# Ignored TypeScript Errors

The Next.js configuration includes:

```ts
typescript: {
  ignoreBuildErrors: true
}
```

This allows deployment with broken type contracts.

Remove this setting and make `tsc --noEmit` and `next build` mandatory CI gates.

# AI Quality and Product-Claim Review

# Job Match Scores

A match score is a heuristic based on:

- Resume content
- Skills
- Profile
- Job text
- Model judgment

It should not be presented as:

- Recruiter probability
- Interview probability
- ATS acceptance probability
- Hiring likelihood

# ATS Analysis

The platform cannot know the configuration of an employer's ATS.

Use language such as:

```text
Keyword alignment estimate
Resume-job overlap
Potential missing terminology
```

# Interview Scores

Model-generated interview scores are not validated assessments of candidate competence.

The interface should provide:

- Rubric
- Evidence
- Uncertainty
- Improvement suggestions
- No hiring-outcome claim

# Company and Referral Intelligence

Web snippets can be:

- Outdated
- Incorrect
- Duplicated
- Generated
- Misattributed

People and affiliations should be labeled unverified until checked against an authoritative source.

# Reliability Review

# External Dependencies

The application depends on:

- PostgreSQL
- Redis
- Groq
- ElevenLabs
- Google OAuth
- LinkedIn OAuth
- SMTP
- RemoteOK
- Arbeitnow
- Adzuna
- Web search/fetch
- LaTeX
- WeasyPrint

# Missing Reliability Controls

- Circuit breakers
- Unified retry policy
- Idempotency on all agent triggers
- Dead-letter queues
- Durable event delivery
- Job reconciliation
- Provider health reporting
- Cost circuit breaker
- Distributed rate limiting
- Graceful degradation
- Full readiness checks
- Deployment-drain behavior

# Observability Review

The repository includes:

- Prometheus
- Grafana
- Loki
- node-exporter
- Metrics middleware in several services
- Agent event logs
- Task logs

Documentation drift exists.

The observability guide says FastAPI services do not expose metrics, while multiple services use Prometheus instrumentation.

It also references OpenAI-related metrics even though the implementation uses Groq.

# Recommended Target Architecture

```text
Browser
   │
   ▼
Nginx / ingress
   │
   ├── Request-size controls
   ├── Request IDs
   └── Static asset delivery
          │
          ▼
API Gateway
   │
   ├── Request routing
   ├── Streaming proxy
   └── Usage telemetry
          │
          ▼
Service network
   │
   ├── User service
   ├── Document service
   ├── Job service
   ├── Agent service
   ├── Notification service
   └── Analytics service
          │
          ▼
Durable job and event layer
          │
     ┌────┼────────┐
     ▼    ▼        ▼
  Celery Streams Workflow engine
          │
          ▼
Document and research workers
          │
     ┌────┼────────┐
     ▼    ▼        ▼
 PDF/DOCX LaTeX  Web retrieval
```

# Recommended Event Architecture

Use durable events with:

```text
Event ID
Event type
Version
User ID
Resource IDs
Producer
Timestamp
Idempotency key
Attempt count
Trace ID
```

Consumers should:

- Acknowledge events
- Retry failed work
- Validate schemas
- Deduplicate operations
- Record processing state
- Dead-letter repeatedly failing events

# Recommended Data Model Additions

Introduce:

```text
organizations
organization_members
oauth_accounts
processing_jobs
document_versions
job_sources
private_jobs
global_jobs
agent_runs
agent_run_steps
notification_deliveries
data_deletion_jobs
```

# Development Roadmap

## Phase 1 — Durable Workflows

1. Replace web-process `create_task` calls.
2. Use Celery, Redis Streams, or a workflow engine.
3. Add idempotency keys.
4. Add retries.
5. Add dead-letter queues.
6. Add run reconciliation.
7. Add listener supervision.
8. Add agent-run state.
9. Add deployment-drain handling.
10. Add user-visible retry and failure states.

## Phase 2 — Database and Data Integrity

1. Select one migration authority.
2. Create a complete baseline.
3. Remove runtime DDL.
4. Remove production `create_all()`.
5. Fix invalid downgrades.
6. Add migration tests.
7. Add active CV-session uniqueness.
8. Validate resume references during application creation.
9. Separate private and global jobs.
10. Preserve application history when jobs change.
11. Add optimistic locking where needed.

## Phase 3 — Document and Agent Quality

1. Package CV templates into production images.
2. Add parser-version tracking.
3. Add resume-processing status.
4. Add document-generation timeouts.
5. Add source-verification UI for company and referral research.
6. Rename ATS and interview scores as estimates.
7. Add per-user model and speech budgets.
8. Add model, prompt, and provider telemetry.

## Phase 4 — Notifications

1. Configure SMTP consistently for API, worker, and scheduler.
2. Deploy the worker and scheduler in production.
3. Add retry and dead-letter behavior.
4. Add delivery status.
5. Add bounce handling.
6. Add unsubscribe and user preferences.
7. Add template versioning.
8. Remove development test-mail behavior.

## Phase 5 — Production Infrastructure

1. Build immutable images.
2. Pin dependencies and image digests.
3. Configure resource limits.
4. Fix Nginx and certificate deployment.
5. Add production health checks.
6. Add autoscaling and disruption budgets.
7. Add backup and restore procedures.
8. Consolidate the Terraform deployment path.
9. Verify observability configuration.

## Phase 6 — CI and Testing

1. Make TypeScript errors fatal.
2. Run `next build`.
3. Add frontend component tests.
4. Add browser end-to-end tests.
5. Add service unit tests.
6. Add gateway integration tests.
7. Add migration bootstrap tests.
8. Add container smoke tests.
9. Add coverage thresholds.
10. Enforce dependency locks.

# Minimum Automated Test Suite

## Jobs and Applications

```text
job_sync_deduplicates_provider_records
private_pasted_job_not_visible_globally
application_resume_reference_valid
manual_application_notification
duplicate_cv_session_rejected
match_score_not_recomputed_unnecessarily
application_status_history_preserved
```

## Documents

```text
pdf_parser_success
docx_parser_success
large_document_rejected
page_limit
duplicate_hash_scoped_to_user
empty_extraction_marked_failed
tailored_pdf_generated
tailored_docx_generated
```

## Audio and AI

```text
audio_duration_limit
transcription_failure_state
tts_budget
company_research_sources_stored
referral_result_marked_unverified
ats_score_named_as_estimate
interview_feedback_rubric
```

## Events and Agents

```text
agent_event_schema
agent_event_idempotency
listener_restarts
event_replayed_after_disconnect
failed_agent_run_reconciled
duplicate_agent_trigger_deduplicated
deployment_drain_preserves_work
```

## Database and Deployment

```text
empty_database_migration
upgrade_from_previous_release
schema_matches_models
no_runtime_ddl
active_cv_session_unique
account_delete_transaction
production_nginx_starts
notification_worker_running
latex_templates_available
prometheus_configuration_present
```

# Repository Hygiene Recommendations

Remove or revise:

- Development reload commands
- Runtime package installation
- Duplicate Terraform approaches
- Missing or obsolete observability statements
- OpenAI references where Groq is used
- Missing Prometheus mounts
- Unused services
- `ignoreBuildErrors`
- Raw model-response logging
- Internal path fields in API schemas
- Runtime schema patches

Add:

- Dependency lock strategy
- Architecture decision records
- Data-flow diagram
- Service ownership map
- Migration ownership map
- Production runbook
- Backup and restore guide
- Operations and recovery guide

# Accurate Feature Summary

## Implemented in Source

- Email/password identity
- Google and LinkedIn OAuth
- JWT access and refresh tokens
- Refresh-token records
- Profile management
- Avatar upload
- Resume PDF/DOCX upload
- Resume parsing
- Skill extraction
- Job ingestion from multiple providers
- Job search and filtering
- Job matching
- Human-reviewed CV generation
- Cover-letter generation
- PDF and DOCX generation
- ATS keyword analysis
- Company research
- Competitor intelligence
- Referral discovery
- Interview-question generation
- Written answer feedback
- Audio transcription
- Text-to-speech
- 3D interview avatar
- Application Kanban
- Email notification concepts
- Analytics
- WebSocket/SSE progress
- Docker, Helm, Terraform, and observability assets

## Remaining Product and Deployment Work

- Durable agent workflows
- Reliable notification workers in production
- One authoritative schema-migration system
- Production Nginx and certificate configuration
- Complete Kubernetes release configuration
- Comprehensive testing
- Production-grade model and speech budgets
- Fully reliable account deletion

# Engineering Skills Demonstrated

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Form validation
- Python
- FastAPI
- Async SQLAlchemy
- PostgreSQL
- Alembic
- Redis
- Celery
- JWT
- OAuth
- Microservice architecture
- API gateway design
- LangGraph
- Agent orchestration
- Groq LLM integration
- Speech transcription
- Text-to-speech
- Resume parsing
- Skill extraction
- PDF generation
- DOCX generation
- LaTeX
- Job API integration
- Full-text search
- Human-in-the-loop workflows
- WebSockets
- Server-Sent Events
- Docker Compose
- Nginx
- Helm
- Kubernetes
- Terraform
- AWS EKS
- GitHub Actions
- Prometheus
- Grafana
- Loki

# Resume-Ready Description

**Intelligent Job Application Assistant**

Developed a multi-service AI career platform using Next.js, React, TypeScript, FastAPI, PostgreSQL, Redis, Celery, LangGraph, Groq, Docker, and Kubernetes. Implemented email and OAuth authentication, career profiles, PDF/DOCX resume parsing, hybrid skill extraction, multi-provider job ingestion, personalized job matching, human-in-the-loop CV and cover-letter tailoring, ATS keyword analysis, company research, competitor intelligence, referral discovery, written and audio interview coaching, application Kanban tracking, notifications, analytics, and real-time agent progress.

# Compact Portfolio Description

AI-powered job-application platform built with **Next.js, FastAPI, PostgreSQL, Redis, Celery, LangGraph, Groq, Docker, Helm, and Terraform**. Supports resume parsing, skill extraction, job discovery and matching, human-reviewed CV generation, ATS analysis, company and referral research, interview coaching, application tracking, notifications, and analytics.

# Accurate Portfolio Positioning

> Designed and implemented a feature-rich prototype for AI-assisted job searching and application preparation using a Next.js frontend and FastAPI microservices. The platform combines resume processing, multi-source job ingestion, agentic matching, human-in-the-loop document tailoring, interview coaching, application tracking, speech services, analytics, and cloud-deployment assets.

# Project Maturity Assessment

| Area | Assessment |
|---|---|
| Product breadth | Strong prototype |
| Frontend scope | Strong |
| Resume workflow | Substantial |
| Job ingestion | Substantial |
| Human-in-the-loop CV | Strong concept |
| Agent coverage | Broad |
| Audio interview workflow | Substantial |
| Event durability | Incomplete |
| Schema management | Fragmented |
| Notifications | Deployment incomplete |
| Docker development setup | Broad |
| Helm/Terraform | Substantial, needs consolidation |
| Observability | Broad, documentation drift |
| Automated testing | Insufficient |
| Production readiness | Prototype stage |

# Final Assessment

The repository demonstrates substantial full-stack, AI-integration, distributed-system, and infrastructure work.

Its strongest portfolio elements are the multi-service architecture, rich Next.js frontend, human-in-the-loop CV workflow, resume and skill processing, multi-source job ingestion, agent-based matching and research, audio interview coaching, and extensive Docker, Helm, Terraform, CI/CD, and observability assets.

The most valuable next steps are to make agent execution durable, consolidate migrations, complete notification deployment, package document templates consistently, strengthen event replay, and expand automated test coverage.

With those refinements, the project can evolve from a sophisticated prototype into a polished career-assistance platform.
