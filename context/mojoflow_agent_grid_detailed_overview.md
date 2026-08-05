# MojoFlow Agent Grid — Detailed Project Overview

**Repository:** [yassernamez03/mojoflow-agent-grid](https://github.com/yassernamez03/mojoflow-agent-grid)  
**Project name:** MojoFlow Agent Grid  
**Project type:** Experimental, production-oriented, multi-tenant agent-execution backend  
**Primary language:** Mojo  
**Supporting runtime language:** Python  
**Primary infrastructure:** PostgreSQL 16, Valkey 8.1, HAProxy, OpenTelemetry, Prometheus, Tempo, Docker Compose  
**Current product stage described by the repository:** Authenticated single-host private API beta  
**Analysis basis:** Full uploaded source archive, including Mojo domain and runtime code, Python interoperability adapters, SQL migrations, API implementation, queue and worker daemons, agent runtime, OpenAI provider integration, recovery logic, telemetry modules, Docker/HAProxy configuration, probes, tests, architecture decision records, and project documentation.

> This document is a portfolio- and resume-oriented explanation of the project. It focuses on what the system is designed to do, how its architecture works, how Jobs move through the system, how agent execution is persisted and recovered, how OpenAI integration is controlled, and what engineering skills the repository demonstrates.

# Executive Summary

**MojoFlow Agent Grid** is a backend platform for executing AI-agent workloads as durable, multi-tenant background Jobs.

The project is not a chatbot frontend and it is not a single agent implementation. It is an execution infrastructure layer designed to receive agent Jobs through an authenticated API, persist them, queue them, run them through worker processes, record every important transition, expose durable progress events, apply resource and provider budgets, recover interrupted work, and provide operational telemetry.

At a high level, the system implements this workflow:

```text
Authenticated API request
        │
        ▼
Validate and canonicalize request
        │
        ▼
Create durable Job in PostgreSQL
        │
        ▼
Transactional outbox publication
        │
        ▼
Dispatcher publishes Job to Valkey Streams
        │
        ▼
Worker acquires a fenced lease
        │
        ▼
Agent runtime executes model/tool steps
        │
        ▼
Checkpoints and usage are persisted
        │
        ▼
Job reaches terminal state
        │
        ▼
Client retrieves result or follows SSE events
```

The platform combines several advanced backend concepts:

- Pure domain modeling in Mojo
- Optimistic concurrency
- Durable Job state transitions
- Idempotent submission
- Multi-tenant isolation
- HMAC API-key authentication
- PostgreSQL Row Level Security
- Transactional outbox
- At-least-once queue delivery
- Valkey Streams consumer groups
- Lease fencing
- Durable agent checkpoints
- Replay-safe tool execution
- OpenAI Responses API integration
- Provider token and monetary accounting
- Request and token rate controls
- Durable cancellation
- Server-Sent Events
- Deterministic recovery and reconciliation
- OpenTelemetry tracing and metrics
- Structured operational logging
- HAProxy process separation
- Dockerized daemon deployment
- Security and SBOM verification gates
- Unit, integration, load, compatibility, and recovery probes

The system is intentionally designed around one central principle:

> **PostgreSQL is the durable source of truth; queues, workers, providers, and network processes may fail and recover around it.**

This gives the project a strong distributed-systems focus.

# Repository Scale

The uploaded repository is substantial.

Approximate source composition:

| Area | Files | Approximate lines |
|---|---:|---:|
| Core `src/` implementation | 91 | 20,634 |
| Core Mojo source | — | 14,843 |
| Core Python interoperability code | — | 5,791 |
| Tests | 50 | 7,386 |
| Scripts and probes | 50 | 3,190 |
| SQL migrations | 11 | 2,149 |
| Project documentation | 27 | 1,531 |
| Vendored MojoFlow snapshot | 54 | ~11,776 |
| Total `.mojo` files including vendor/tests | 151 | ~29,666 lines |
| Total Python files | 56 | ~10,655 lines |

The project also includes:

- 11 immutable SQL migrations
- 14 architecture decision records
- More than 30 Make targets for development, verification, migration, provisioning, operations, and testing
- Docker Compose profiles for infrastructure, telemetry, operations, and the private-beta MVP
- A vendored and pinned MojoFlow source snapshot
- Unit, integration, provider, queue, recovery, streaming, observability, framework, and load probes

# Repository Structure

```text
mojoflow-agent-grid/
├── README.md
├── CONTEXT.md
├── SECURITY.md
├── Makefile
├── Dockerfile
├── docker-compose.yml
├── pixi.toml
├── pixi.lock
├── mojoproject.toml
├── infrastructure.mojoc
├── operations.mojoc
├── queueing.mojoc
│
├── src/
│   ├── api/
│   ├── application/
│   ├── authentication/
│   ├── domain/
│   ├── persistence/
│   ├── queueing/
│   ├── agent_runtime/
│   ├── provider_runtime/
│   ├── recovery/
│   ├── operations/
│   ├── streaming/
│   ├── infrastructure/
│   │   └── python_interop/
│   ├── dispatcher/
│   ├── worker/
│   ├── runtime_worker/
│   ├── reconciler/
│   └── load_actor/
│
├── migrations/
│   ├── 001_persistence_foundation.sql
│   ├── 002_phase3a_authentication_rls.sql
│   ├── 003_phase4a_queue_worker.sql
│   ├── 004_phase4a_queue_maintenance.sql
│   ├── 005_phase5a_agent_runtime.sql
│   ├── 006_phase7a_openai_provider.sql
│   ├── 007_phase7a_usage_catalog_version.sql
│   ├── 008_phase8a_recovery_reconciliation.sql
│   ├── 009_phase8a_recovery_claim_hardening.sql
│   ├── 010_phase9a_operational_telemetry.sql
│   └── 011_phase9b_private_api_runtime.sql
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── data-model.md
│   ├── state-machine.md
│   ├── agent-runtime.md
│   ├── openai-provider.md
│   ├── recovery.md
│   ├── operations.md
│   ├── streaming-cancellation.md
│   ├── framework-compatibility.md
│   ├── worker-pool-compatibility.md
│   └── decisions/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── python/
│   ├── framework/
│   └── load/
│
├── probes/
├── scripts/
├── deploy/
│   ├── haproxy/
│   ├── observability/
│   └── secrets/
│
├── examples/
└── vendor/
    └── mojoflow/
```

# Technology Stack

# Core Runtime

- **Mojo 1.0.0b2**
- Mojo packages and compiled binaries
- Modular Pixi environment
- Mojo/Python interoperability

# Python Interoperability

- Python 3.14.6
- Psycopg 3.3
- Redis Python client
- OpenAI Python SDK
- OpenTelemetry SDK
- RFC 8785 canonical JSON package

# Persistence

- PostgreSQL 16
- SQL migrations
- JSONB
- Row Level Security
- Advisory locking
- Transaction-scoped settings
- Database functions
- Optimistic version checks
- Durable append-only event records

# Queue and Coordination

- Valkey 8.1
- Redis Streams-compatible protocol
- Consumer groups
- `XAUTOCLAIM`
- Lua publication logic
- TTL worker heartbeats
- Distributed rate-control state

# API and Networking

- MojoFlow
- Compiled Mojo HTTP server
- Server-Sent Events
- HAProxy
- REST-style `/v1` API

# AI Provider

- OpenAI Responses API
- OpenAI Python SDK 2.46.0
- Structured response schema
- Token counting
- Model catalog
- Usage accounting
- Request/token/concurrency controls

# Observability

- OpenTelemetry
- OTLP/HTTP
- Prometheus
- Tempo
- Structured JSON logs
- W3C `traceparent`

# Packaging and Operations

- Docker
- Docker Compose
- Ubuntu 24.04
- Pixi
- Make
- Trivy
- CycloneDX SBOM

# Architectural Philosophy

The project is organized around several explicit design boundaries.

```text
Pure Mojo domain
        │
        ▼
Application services
        │
        ▼
Typed ports
        │
        ▼
Infrastructure adapters
        │
        ├── PostgreSQL
        ├── Valkey
        ├── OpenAI
        └── OpenTelemetry
```

The intention is to keep:

```text
Business rules
```

separate from:

```text
Database implementation
HTTP framework
Queue client
Provider SDK
Telemetry SDK
```

This resembles a ports-and-adapters / hexagonal architecture.

# Top-Level Process Architecture

The current private-beta topology uses several independent processes.

```text
                        Client
                          │
                          ▼
                       HAProxy
                 ┌────────┴─────────┐
                 ▼                  ▼
          Command API pool       SSE API pool
          2 processes            4 processes
                 │                  │
                 └────────┬─────────┘
                          ▼
                     PostgreSQL
                          ▲
                          │
                  durable Job state
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
    Dispatcher      Runtime workers       Reconciler
        │                 │                  │
        ▼                 │                  │
   Valkey Streams ────────┘                  │
        │                                    │
        └──────── delivery accelerator ──────┘
```

The private-beta Compose profile starts:

```text
2 command API processes
4 SSE API processes
2 runtime workers
1 dispatcher
1 reconciler
PostgreSQL
Valkey
HAProxy
```

Only HAProxy is exposed to the local host in the MVP profile.

# Core Domain: The Job

The central domain object is `Job`.

A Job represents one durable unit of agent execution.

It contains several groups of data.

# Identity and Admission Fields

```text
Job ID
Tenant ID
Agent name
Priority
Canonical input
Resolved limits
Idempotency key
Request hash
```

# Lifecycle Fields

```text
Status
Attempt number
Maximum attempts
Created timestamp
Updated timestamp
Queued timestamp
Started timestamp
Attempt-start timestamp
Finished timestamp
Next retry timestamp
Cancellation-request timestamp
Lifecycle deadline
```

# Worker Lease Fields

```text
Lease owner
Lease token
Lease expiry
```

# Outcome Fields

```text
Result reference
Failure information
```

# Concurrency Field

```text
Version
```

Every meaningful Job mutation advances the Job's version exactly once.

This supports compare-and-swap persistence.

# Why the Domain Is Pure Mojo

The domain package does not depend on:

- HTTP
- PostgreSQL
- Valkey
- Python
- OpenAI
- system clocks
- identifier generation
- configuration files

Instead, values such as:

```text
current timestamp
Job ID
tenant
limits
priority authorization
```

are prepared outside the domain and passed into it.

This makes domain transitions deterministic and testable.

# Job Lifecycle

The implemented Job state machine is:

```text
PENDING_ENQUEUE
      │
      ├──────────────► CANCELLED
      ├──────────────► TIMED_OUT
      │
      ▼
    QUEUED
      │
      ├──────────────► CANCELLED
      ├──────────────► TIMED_OUT
      │
      ▼
    LEASED
      │
      ├──────────────► QUEUED
      ├──────────────► CANCELLED
      ├──────────────► TIMED_OUT
      │
      ▼
    RUNNING
      │
      ├──────────────► COMPLETED
      ├──────────────► RETRY_SCHEDULED
      ├──────────────► FAILED
      ├──────────────► CANCELLED
      ├──────────────► TIMED_OUT
      ├──────────────► BUDGET_EXCEEDED
      └──────────────► DEAD_LETTERED

RETRY_SCHEDULED
      │
      ├──────────────► QUEUED
      ├──────────────► CANCELLED
      └──────────────► TIMED_OUT
```

Terminal states are:

```text
COMPLETED
FAILED
CANCELLED
TIMED_OUT
BUDGET_EXCEEDED
DEAD_LETTERED
```

# Meaning of the Main States

## `PENDING_ENQUEUE`

The Job has passed admission and is durably stored, but queue publication has not yet completed.

## `QUEUED`

The Job has been prepared for queue delivery and has an associated outbox publication.

## `LEASED`

A worker has successfully claimed the Job with a lease token.

## `RUNNING`

The worker has started an execution attempt.

## `RETRY_SCHEDULED`

A retryable failure occurred and the Job is waiting until `next_retry_at`.

## `COMPLETED`

The agent produced a successful result.

## `FAILED`

The execution ended with a permanent failure.

## `CANCELLED`

The user or system cancellation request was completed.

## `TIMED_OUT`

A lifecycle or attempt time deadline was reached.

## `BUDGET_EXCEEDED`

The run crossed one of the execution limits enforced by the agent runtime.

## `DEAD_LETTERED`

The Job exhausted recovery/retry options and is retained for operator inspection.

# Attempts and Leases

A worker does not immediately execute a queue message.

It first obtains a durable lease.

```text
Queue message
    │
    ▼
Load authoritative Job
    │
    ▼
Check status and version
    │
    ▼
Generate lease token
    │
    ▼
Persist LEASED Job
    │
    ▼
Start execution
```

The active lease contains:

```text
Worker identity
Opaque lease token
Expiry timestamp
```

The lease token is used as a fencing value.

That means an older worker that lost its lease cannot later overwrite a newer valid execution outcome.

# Attempt Counting

The attempt number increments only when:

```text
LEASED → RUNNING
```

An expired lease before execution begins can return to `QUEUED` without consuming an attempt.

This distinguishes:

```text
delivery/claim failure
```

from:

```text
actual execution failure
```

# Admission Pipeline

A Job is created only after the request passes a full admission pipeline.

Conceptually:

```text
HTTP request
    │
    ▼
API-key authentication
    │
    ▼
Strict JSON validation
    │
    ▼
Canonical request construction
    │
    ▼
Request hashing
    │
    ▼
Tenant policy
    │
    ▼
Priority authorization
    │
    ▼
Limit resolution
    │
    ▼
Queue-capacity check
    │
    ▼
Agent-definition resolution
    │
    ▼
Durable Job creation
```

Malformed or rejected submissions never become Job rows.

# Request Canonicalization

The project uses **RFC 8785 JSON Canonicalization Scheme** concepts.

The request is transformed into a stable canonical representation before hashing.

This makes these logically equivalent JSON objects share the same representation regardless of:

- whitespace
- property ordering

For example:

```json
{"task":"summarize","language":"en"}
```

and:

```json
{
  "language": "en",
  "task": "summarize"
}
```

can be normalized for deterministic request identity.

At the same time, the API deliberately preserves semantic differences such as:

```text
field omitted
```

versus:

```text
field explicitly supplied
```

when determining submission identity.

# Idempotent Job Submission

Clients may send:

```text
Idempotency-Key
```

with a Job submission.

The system stores a binding between:

```text
Tenant
Idempotency key
Request hash
Job ID
```

If the same tenant repeats the same key with the same request identity:

```text
original Job is returned
```

rather than creating a second Job.

If the key is reused with a different request:

```text
HTTP 409 conflict
```

is returned.

This is particularly important for clients that retry after:

- timeouts
- lost responses
- network interruptions

# Authentication Model

The API uses Bearer API keys.

Conceptually:

```text
Authorization: Bearer <API key>
```

The raw key is not used as a database lookup identifier.

The key model separates:

```text
public key prefix
secret component
HMAC verification
tenant identity
capabilities
```

Operator scripts can:

```text
provision API key
revoke API key
```

through Make targets and Python administration tools.

# Multi-Tenancy

Every Job belongs to a tenant.

Tenant isolation exists at multiple layers:

```text
Authentication context
Application query scope
PostgreSQL tenant key
Row Level Security
Tenant quotas
Tenant provider usage
```

A tenant record also stores platform limits such as:

- Queue capacity
- Request limits
- Concurrency limits
- Optional monthly token quota
- Maximum Job-level limits

# PostgreSQL Row Level Security

Application transactions set the current tenant context inside PostgreSQL.

RLS policies then restrict access to rows belonging to that tenant.

RLS applies to major tenant-scoped records such as:

```text
jobs
job_events
idempotency_records
api_keys
queue publications
agent definitions
agent bindings
agent steps
checkpoints
provider usage
recovery claims
```

# API Surface

The private-beta API exposes five main Job operations.

```text
POST /v1/jobs
GET  /v1/jobs
GET  /v1/jobs/{job_id}
POST /v1/jobs/{job_id}/cancel
GET  /v1/jobs/{job_id}/events
```

Health endpoints also exist:

```text
GET /livez
GET /readyz
```

# `POST /v1/jobs`

Creates a new agent Job.

Example:

```json
{
  "agent_name": "example-agent",
  "input": {
    "task": "Summarize the latest financial report"
  },
  "priority": "NORMAL",
  "deadline_seconds": 86400
}
```

The request supports:

- Agent name
- Object-valued input
- Priority
- Partial limit overrides
- Deadline
- Optional idempotency key

The endpoint returns:

```text
202 Accepted
```

for both:

```text
new Job
idempotent replay
```

with a disposition describing which occurred.

# `GET /v1/jobs/{job_id}`

Returns the full public view of one Job.

The public representation can include:

- Job identity
- Agent name
- Priority
- Canonical input
- Resolved limits
- Status
- Attempt information
- Timestamps
- Failure information
- Completed result

The implementation deliberately exposes a public projection rather than the complete persistence record.

# `GET /v1/jobs`

Lists Jobs for the authenticated tenant.

Supported concepts include:

- Status filter
- Limit
- Opaque cursor
- Descending creation ordering

The API supports up to:

```text
100 rows per page
```

Summaries omit full result content and internal execution metadata.

# Cursor Pagination

Pagination is based on:

```text
(created_at, Job ID)
```

The client receives an opaque signed cursor representing the exclusive position for the next page.

This avoids offset-based pagination for a changing Job table.

# `POST /v1/jobs/{job_id}/cancel`

Requests cancellation.

Behavior depends on Job state.

For non-running active Jobs:

```text
cancel immediately
```

For a running Job:

```text
record cancellation request
wait for token-owning worker acknowledgement
```

Repeated identical cancellation calls are idempotent.

# `GET /v1/jobs/{job_id}/events`

Streams durable Job events through Server-Sent Events.

Example event:

```text
id: 42
event: job.cancelled
data: {"status":"CANCELLED"}
```

The endpoint supports:

```text
Last-Event-ID
```

to resume from the last durable event seen by the client.

# SSE Heartbeats

The event stream emits unsequenced heartbeats approximately every 15 seconds.

Example:

```text
: heartbeat <unix_ms>
```

Heartbeats do not advance durable replay state.

# Durable Event Log

Every Job has an append-only event stream stored in PostgreSQL.

Examples of events include concepts such as:

```text
job.created
job.queued
job.leased
job.started
job.cancel_requested
job.cancelled
job.completed
```

The event sequence number is also used as the SSE event ID.

This means:

```text
database event order
=
client replay order
```

# Event Persistence Model

`job_events` uses a tenant-qualified Job identity and a monotonically increasing sequence number.

The event log stores:

```text
Event ID
Tenant
Job ID
Sequence
Event type
Timestamp
JSON payload
Trace ID
```

Event rows are append-only.

This gives the system a durable operational history for each Job.

# Public Error Contract

API errors use:

```text
application/problem+json
```

following RFC 9457-style problem documents.

The response includes standard fields such as:

```text
type
title
status
detail
instance
```

plus stable application information such as:

```text
code
request_id
optional field
```

This gives API clients a predictable machine-readable error format.

# Persistence Architecture

The persistence design has three conceptual layers.

```text
Pure Mojo persistence contracts
        │
        ▼
Mojo infrastructure adapter
        │
        ▼
Python Psycopg adapter
        │
        ▼
PostgreSQL
```

# Pure Persistence Contracts

`src/persistence` defines typed contracts for:

- Job stores
- Tenant stores
- Event records
- Result records
- Queue data
- Persistence errors

This package has no direct Psycopg import.

# Mojo/Python Boundary

`src/infrastructure/postgres.mojo` converts typed Mojo values into plain structures for Python.

Python performs the actual Psycopg operation.

The result is then decoded back into typed Mojo records.

Conceptually:

```text
Typed Mojo object
      │
      ▼
plain interop representation
      │
      ▼
Python Psycopg
      │
      ▼
PostgreSQL row
      │
      ▼
plain interop representation
      │
      ▼
typed Mojo object
```

# Database Migrations

The project has 11 ordered migrations.

# Migration 001 — Persistence Foundation

Creates:

```text
tenants
jobs
job_events
idempotency_records
```

This establishes the durable Job model.

# Migration 002 — Authentication and RLS

Adds:

```text
api_keys
tenant RLS policies
authentication lookup functions
active-tenant locking
```

# Migration 003 — Queue Worker

Adds:

```text
job_queue_publications
queue-candidate discovery
publication claiming
publication inspection
```

# Migration 004 — Queue Maintenance

Adds cleanup logic for consumed publications.

# Migration 005 — Agent Runtime

Adds:

```text
agent_definitions
job_agent_bindings
agent_steps
checkpoints
```

# Migration 006 — OpenAI Provider

Adds:

```text
provider_model_catalog
provider_usage_attempts
tenant_provider_usage_months
```

and related provider-validation logic.

# Migration 007 — Provider Catalog Versioning

Extends provider usage to bind accounting to catalog versions.

# Migration 008 — Recovery

Adds:

```text
job_recovery_claims
recovery discovery
dead-letter inspection
uncertain provider-usage claims
```

# Migration 009 — Recovery Claim Hardening

Refines recovery claim behavior.

# Migration 010 — Operational Telemetry

Adds database-level operational snapshot support and queue trace propagation updates.

# Migration 011 — Private API Runtime

Adds a public-result lookup for safely projecting completed agent-step output into the API.

# Migration Runner

`make migrate` executes migrations with:

- Advisory locking
- Immutable file expectations
- SHA-256 migration ledger verification

The migration system is intended to make schema history reproducible.

# Transactional Outbox

Queue publication is not performed directly during the original submit request.

Instead:

```text
Create/update Job in PostgreSQL
        │
        ▼
Create queue-publication record
        │
        ▼
Commit transaction
        │
        ▼
Dispatcher publishes to Valkey
```

This is the transactional outbox pattern.

The advantage is that PostgreSQL never needs to participate in a distributed transaction with Valkey.

If the broker is unavailable:

```text
the Job remains durable
the publication record remains repairable
```

# Queue Architecture

Valkey Streams acts as the delivery accelerator.

The queue design uses:

- Streams
- Consumer groups
- Authentication
- Bounded publication
- Consumer acknowledgement
- Reclaiming idle entries
- Worker heartbeat records

PostgreSQL still decides whether a delivered queue message is valid.

# Dispatcher

The dispatcher performs two main activities.

## 1. Promote Durable Work

For `PENDING_ENQUEUE` Jobs:

```text
load Job
    │
    ▼
mark QUEUED
    │
    ▼
append job.queued event
    │
    ▼
insert outbox publication
```

## 2. Publish Outbox Records

```text
claim publication rows
        │
        ▼
publish to Valkey Stream
        │
        ▼
record stream ID
```

It can also identify a publication whose broker entry disappeared and reset it for publication again.

# Queue Message Philosophy

The queue message is intentionally small.

It primarily carries identifiers such as:

```text
tenant
publication
Job
Job version
```

The worker does not trust the queue as the canonical Job state.

After receiving a message, the worker reloads the Job from PostgreSQL.

# At-Least-Once Delivery

Duplicate delivery is expected.

Correctness is maintained with:

- Job status
- Job version
- Lease token
- tenant concurrency checks
- durable event state

This means a duplicate broker message does not imply duplicate Job execution.

# One-Slot Worker Model

The current MVP uses independent one-slot worker processes.

Each worker processes one execution at a time.

Scaling is achieved through multiple processes rather than multiple concurrent Python-interoperability lanes inside one Mojo process.

The Compose MVP includes two runtime workers.

# Worker Flow

```text
Read Valkey delivery
       │
       ▼
Reload Job from PostgreSQL
       │
       ▼
Validate Job status/version
       │
       ▼
Acquire lease
       │
       ▼
Persist LEASED event
       │
       ▼
Transition to RUNNING
       │
       ▼
Execute agent runtime
       │
       ▼
Persist fenced outcome
       │
       ▼
Acknowledge queue delivery
```

# Worker Heartbeats

Workers register liveness information in Valkey.

A heartbeat includes concepts such as:

```text
Worker ID
Group
Capacity
Status
Start time
Heartbeat time
```

TTL-based records let operational tooling determine whether a worker is active.

# Agent Definition Model

Jobs do not depend on a mutable agent configuration.

Instead, the system maintains versioned **agent definitions**.

A definition includes concepts such as:

- Definition ID
- Agent name
- Version
- Tenant/global scope
- System prompt
- Provider policy
- Model output limit
- Active/disabled state

# Submission-Time Binding

When a new Job is accepted:

```text
agent_name
    │
    ▼
resolve active definition
    │
    ▼
lock immutable definition version
    │
    ▼
create Job-to-definition binding
```

The Job continues using the exact bound definition even if a newer version is later created.

This makes historical execution reproducible.

# Agent Runtime

The agent runtime is a durable execution engine.

It receives:

```text
RUNNING Job
Bound agent definition
Execution fence
Model gateway
Tool registry
Journal/checkpoint ports
```

The runtime can perform multiple model/tool steps while enforcing limits.

# Execution Fence

The execution fence contains:

```text
Tenant
Job
Attempt
Expected aggregate version
Live lease token
```

All important execution writes are tied to this fence.

If another worker has taken ownership, stale execution state cannot be committed.

# Runtime Step Model

The runtime is step-oriented.

A simplified loop is:

```text
Load latest checkpoint
       │
       ▼
Build model request
       │
       ▼
Persist MODEL_REQUESTED
       │
       ▼
Call model gateway
       │
       ▼
Receive structured action
       │
  ┌────┼─────────────┐
  ▼    ▼             ▼
RESPOND CALL_TOOL    FAIL
       │
       ▼
Persist tool intent
       │
       ▼
Execute tool
       │
       ▼
Persist result
       │
       ▼
Next model step
```

# Supported Agent Actions

The runtime understands action types including:

```text
RESPOND
CALL_TOOL
FAIL
WAIT
DELEGATE_TASK
```

The currently enabled execution path focuses on:

```text
RESPOND
CALL_TOOL
FAIL
```

`WAIT` and `DELEGATE_TASK` are recognized by the runtime contract but are not enabled as normal private-beta actions.

# `RESPOND`

The agent produces its final textual response.

The completed output is stored in an agent step.

The Job stores an opaque result reference such as:

```text
agent-step:<step_id>
```

The public API resolves the reference through a controlled result lookup.

# `CALL_TOOL`

The model requests one of the enabled deterministic tools.

The runtime records the tool intent before execution.

After execution, the tool result is persisted and included in the next checkpoint/context.

# `FAIL`

The agent deliberately ends with a structured failure.

The runtime converts the model's typed failure into a sanitized durable outcome.

# Built-In Tool: Calculator

The calculator tool evaluates a bounded integer expression language.

Supported concepts include:

```text
parentheses
whitespace
unary signs
+
-
*
/
%
```

The implementation includes:

- Checked signed 64-bit arithmetic
- Exact division rules
- Overflow detection
- Nesting-depth limits
- Parsing without evaluating arbitrary program code

Example agent flow:

```text
Model:
CALL_TOOL calculator "(25 * 4) + 10"

Tool:
110

Model:
RESPOND "The result is 110."
```

# Built-In Tool: JSON Transform

The JSON-transform tool supports bounded transformations such as:

```text
select
rename
filter
```

It works against validated I-JSON and emits canonical JSON.

The tool does not execute code or perform I/O.

Example conceptual use:

```text
Input JSON
    │
    ▼
select specific fields
    │
    ▼
rename key
    │
    ▼
filter records
    │
    ▼
canonical JSON output
```

# Replay-Safe Tools

The calculator and JSON-transform tools are treated as replay-safe because they:

- Have no network side effects
- Do not modify external resources
- Produce deterministic output from explicit input

This matters during crash recovery.

# Checkpoints

The agent runtime writes versioned checkpoints.

A checkpoint captures execution state such as:

```text
Cumulative usage
Next step number
Compacted context
Pending action
Pending tool call
Terminal outcome
```

This allows the runtime to restart without beginning from zero.

# Crash-Safe Agent Resume

Suppose the sequence is:

```text
model decides to call calculator
        │
        ▼
tool intent persisted
        │
        ▼
process crashes
```

On restart, the runtime can inspect the journal.

If the pending tool is replay-safe:

```text
resume tool execution
```

without repeating the previous model request.

This avoids unnecessary provider calls and preserves deterministic progress.

# Agent Steps

`agent_steps` stores step-level execution records.

Step records can represent:

- Model intents
- Model responses
- Tool intents
- Tool outputs
- Final responses
- Failure information
- Usage information

The database includes progression checks for step status changes.

# OpenAI Provider Integration

The repository contains a dedicated OpenAI Responses API adapter.

The provider is not called directly from the domain layer.

The path is:

```text
Agent runtime
      │
      ▼
Typed ModelRequest
      │
      ▼
Provider runtime contract
      │
      ▼
Mojo infrastructure adapter
      │
      ▼
Python OpenAI adapter
      │
      ▼
OpenAI Responses API
```

# OpenAI Request Contract

The runtime passes fields such as:

```text
Tenant
Job
Attempt
Step
Model policy
Compacted context
Output-token limit
Deadline
```

The adapter uses:

- Explicit deadline
- SDK retries disabled
- `store=false`
- No hosted provider tools
- Strict structured action response

# Structured Model Actions

Generation is requested as a strict JSON object representing one action.

The provider response must map into the runtime's action structure.

This avoids free-form parsing of tool decisions.

# Provider Token Counting

Before a generation request, the adapter performs an input-token count.

Conceptually:

```text
Model context
      │
      ▼
responses.input_tokens.count
      │
      ▼
Reserve capacity
      │
      ▼
responses.create
```

Token counting itself does not consume the agent's model-call budget, while a generation attempt does.

# Provider Model Catalog

OpenAI models are configured through a durable model catalog.

Catalog data includes concepts such as:

```text
Catalog ID
Catalog version
Provider
Model
Context window
Maximum output tokens
Input price
Cached input price
Output price
Requests-per-minute limit
Tokens-per-minute limit
Maximum concurrency
Active state
```

Model prices and capacity are explicitly operator configured.

# Immutable Usage Context

An agent definition references a specific provider catalog.

Usage records preserve the catalog version associated with the execution.

This lets historical cost calculations remain tied to the prices that were active for that run.

# Provider Usage Accounting

Every physical provider operation creates a durable usage attempt.

The system tracks concepts such as:

```text
Request start
Provider operation type
Reserved tokens
Actual input tokens
Cached input tokens
Output tokens
Measured cost
Uncertain capacity
Final accounting state
```

# Monthly Tenant Usage

`tenant_provider_usage_months` aggregates usage by:

```text
Tenant
Month
```

This supports:

- Monthly token budgets
- Capacity reservation
- Usage inspection
- Cost accounting

# Provider Rate Controls

Valkey coordinates distributed provider limits.

The provider control layer includes:

```text
RPM bucket
TPM bucket
Concurrency semaphore
Circuit breaker
```

# Requests Per Minute

Limits the number of provider requests in a time window.

# Tokens Per Minute

Limits reserved provider token capacity.

# Concurrency

Caps simultaneous provider operations.

# Circuit Breaker

Repeated transient provider failures can temporarily open a shared circuit.

The documented policy includes:

```text
5 transient failures within 60 seconds
        │
        ▼
Circuit opens for 30 seconds
        │
        ▼
One half-open probe
```

This prevents many worker processes from continuously hitting a failing provider.

# Provider Retry Policy

The adapter classifies failures into concepts such as:

```text
retryable
permanent
deadline-related
uncertain
```

Transient network, throttling, and server failures may be retried.

The retry policy uses bounded jitter and a limited number of physical attempts.

# Budget Enforcement

The agent runtime checks several categories of limits before and after work.

The repository describes checks for:

- Step count
- Model-call count
- Tool-call count
- Input tokens
- Output tokens
- Total tokens
- Estimated monetary cost
- Tool-output bytes
- Context size
- Lifecycle deadline
- Per-attempt timeout

If execution exceeds an enforced budget:

```text
BUDGET_EXCEEDED
```

is a first-class Job terminal state.

# Cancellation Model

Cancellation is durable.

A cancellation request is not merely an in-memory flag.

# Non-Running Job Cancellation

For Jobs such as:

```text
PENDING_ENQUEUE
QUEUED
LEASED
RETRY_SCHEDULED
```

the system can atomically transition directly to:

```text
CANCELLED
```

# Running Job Cancellation

For a running Job:

```text
client requests cancellation
        │
        ▼
job.cancel_requested event
        │
        ▼
Job remains RUNNING temporarily
        │
        ▼
active fenced worker observes request
        │
        ▼
worker acknowledges cancellation
        │
        ▼
CANCELLED
```

This prevents a control-plane request from pretending that execution stopped before the current worker has actually acknowledged it.

# Durable Event Replay

The event stream can be reconstructed from PostgreSQL.

A client that disconnects after event 42 reconnects with:

```text
Last-Event-ID: 42
```

The API asks PostgreSQL for:

```text
sequence_number > 42
```

and sends the remaining events in ascending order.

This is stronger than a purely in-memory event stream because disconnects do not lose historical state.

# Recovery and Reconciliation

A dedicated reconciler continuously repairs durable work that was interrupted.

The reconciler handles cases such as:

- Worker death
- Expired leases
- Due retries
- Dispatcher interruption
- Missing broker publication
- Stranded accepted Jobs
- Uncertain provider accounting
- Cancellation races
- Timeouts

# Recovery Cycle

A simplified recovery cycle is:

```text
Claim bounded recovery candidates
        │
        ▼
Lock and revalidate Job
        │
        ▼
Apply deterministic precedence rules
        │
        ├── timeout
        ├── cancellation
        ├── lease recovery
        ├── retry promotion
        └── stranded enqueue repair
        │
        ▼
Persist mutation + events
        │
        ▼
Repair publication state if needed
```

# Recovery Ordering

The documented recovery order is:

1. Lifecycle deadline or attempt timeout
2. Cancellation requested on expired running attempt
3. Expired lease recovery
4. Due retry promotion
5. Promotion of stranded `PENDING_ENQUEUE` work

This makes races deterministic.

# Retry Scheduling

Retry delay uses deterministic full jitter derived from:

```text
Job ID
Attempt
Recovery reason
```

The ceiling grows exponentially and is capped.

A retry that would occur after the Job's lifecycle deadline is converted directly into:

```text
TIMED_OUT
```

# Dead Letters

Jobs that cannot be safely retried may become:

```text
DEAD_LETTERED
```

Dead letters are intended for inspection.

A later attempt should be represented by a new Job rather than silently mutating the old terminal record.

# Recovery Claims

`job_recovery_claims` coordinates reconciler ownership.

The reconciler claims bounded sets of work for a limited period.

This prevents multiple reconcilers from processing the same recovery record simultaneously.

# Provider Uncertain Accounting

Some provider failures create ambiguity:

```text
request may have reached provider
response was not received
```

The system does not immediately assume the reserved capacity was unused.

Uncertain provider records can remain reserved until reconciliation.

After the documented uncertainty window, the reconciler can conservatively classify capacity as:

```text
ASSUMED_USED
```

This avoids undercounting provider consumption.

# Observability Architecture

Operational telemetry is represented as a typed module rather than arbitrary logging calls spread through domain code.

```text
Domain / daemon
      │
      ▼
Telemetry port
      │
      ▼
Mojo infrastructure adapter
      │
      ▼
Python OpenTelemetry SDK
      │
      ▼
OTLP Collector
      │
   ┌──┴────────┐
   ▼           ▼
Prometheus   Tempo
```

# Structured Logs

Daemon logs use structured JSON.

The operational layer uses a controlled event vocabulary and bounded scalar fields.

This makes logs easier to:

- Search
- Parse
- Aggregate
- Alert on
- Correlate with traces

# Metrics

Metrics are designed around bounded labels.

Examples of useful dimensions include:

- Service
- Operation
- Outcome
- Provider
- Status

High-cardinality identifiers such as individual Job IDs are kept out of metric labels.

# Tracing

The project uses W3C trace context.

An optional:

```text
traceparent
```

is persisted with the durable queue publication.

The worker can restore the trace context after queue delivery.

This creates correlation across:

```text
API
PostgreSQL outbox
Dispatcher
Valkey
Worker
Agent runtime
Provider
```

without treating the queue payload as the source of truth.

# OTLP Stack

The Compose telemetry profile includes:

```text
OpenTelemetry Collector
Prometheus
Tempo
```

All telemetry services bind to loopback in the local environment.

# Health Model

Daemons maintain heartbeat files under a runtime directory.

Operational checks distinguish:

```text
liveness
readiness
degraded operation
```

Examples:

- Dispatcher readiness depends on PostgreSQL and Valkey.
- Worker readiness depends on runtime dependencies and current migrations.
- Reconciler can remain functionally ready in some broker-degraded scenarios because PostgreSQL owns recovery correctness.

# API Process Pooling

HAProxy separates normal command traffic from event-stream traffic.

```text
Incoming HTTP
      │
      ▼
   HAProxy
      │
  ┌───┴────────────┐
  ▼                ▼
command backend    event backend
round-robin        least-connections
```

# Command Pool

The Compose MVP uses:

```text
2 command API processes
```

for requests such as:

- Submit
- Get
- List
- Cancel

# SSE Pool

The Compose MVP uses:

```text
4 event API processes
```

for long-lived event streams.

HAProxy selects the event backend for paths matching:

```text
/v1/jobs/{id}/events
```

This prevents long-lived SSE connections from consuming the entire command-serving process pool.

# SSE Session Duration

The current stream loop performs bounded polling and heartbeats rather than an unbounded in-process connection.

The client can reconnect using durable event IDs.

# Container Architecture

The project builds compiled Mojo binaries in a multi-stage Dockerfile.

# Build Stage

The builder:

- Uses Ubuntu 24.04
- Installs Pixi
- Installs the locked environment
- Compiles Mojo programs

Binaries include:

```text
api
dispatcher
worker
mock-worker
runtime-worker
reconciler
```

# Runtime Stage

The runtime image contains:

- Compiled Mojo executables
- Locked Python environment for interoperability
- Python interoperability modules
- Health-check helper

The service is configured to run as a dedicated non-root user.

# Compose Daemon Hardening

The private-beta daemon template includes:

```text
read-only root filesystem
non-root UID/GID 10001
all Linux capabilities dropped
no-new-privileges
tmpfs runtime directories
PID limit
CPU limit
memory limit
log rotation
graceful-stop window
Docker secret files
```

These are operational characteristics of the deployment architecture.

# Secrets Configuration

Daemon credentials can be supplied from mounted secret files.

Examples include:

```text
runtime database URL
application database URL
Valkey URL
API-key pepper configuration
cursor HMAC key
```

The runtime's secret-loading helper rejects configurations where both:

```text
direct environment value
and
file-backed value
```

are supplied for the same secret.

# PostgreSQL Roles

The project distinguishes:

```text
administrative migration role
application role
runtime role
```

Bootstrap scripts configure the non-owner roles used by the API and runtime processes.

This lets database privileges correspond to system responsibilities.

# Development and Operations Commands

The Makefile provides a large command surface.

# Environment Setup

```bash
make setup
```

Installs the locked Pixi environment.

# Framework Verification

```bash
make verify-framework
```

Runs compatibility probes for the maintained MojoFlow HTTP/SSE layer.

# Build

```bash
make build
```

Precompiles packages and compiles daemon binaries.

# Core Tests

```bash
make test-unit
make test-contract
make test-integration
make test
```

# Infrastructure

```bash
make db-up
make queue-up
make infra-up
make db-down
```

# Migrations

```bash
make migrate
```

# API-Key Administration

```bash
make provision-api-key
make revoke-api-key
```

# Agent Definitions

```bash
make provision-agent-definition
make enable-agent-definition
make disable-agent-definition
make list-agent-definitions
```

# Provider Catalog

```bash
make configure-provider-model
make enable-provider-model
make disable-provider-model
make inspect-provider-usage
```

# Runtime Daemons

```bash
make run-api
make run-dispatcher
make run-worker
make run-mock-worker
make run-reconciler
```

# MVP

```bash
make mvp-up
make mvp-down
```

# Backups

```bash
make backup-db
make verify-db-restore
```

# Telemetry

```bash
make telemetry-up
make telemetry-down
make check-health
```

# Security Supply-Chain Gates

```bash
make generate-sbom
make security-gate
```

# Framework Compatibility Work

A notable part of the repository is its handling of an evolving Mojo ecosystem.

The project vendors a specific MojoFlow source revision.

The vendored dependency is identified by:

```text
vendor/mojoflow.commit
```

and local maintained modifications are described in:

```text
vendor/mojoflow.local-patches.json
```

# Why the Framework Is Vendored

The project needs a stable HTTP/SSE layer against a pinned Mojo compiler.

Instead of letting an upstream framework version change silently, the repository records:

- Exact upstream commit
- Local patch rationale
- Maintained file hashes
- Compatibility probes

This makes framework compatibility part of the build evidence.

# Framework Verification

The compatibility gate checks concepts such as:

- Exact Mojo version
- Correct Mojo executable
- Pinned MojoFlow revision
- Dynamic request handler compilation
- HTTP binding
- Strict request parsing
- Incremental SSE
- Bounded shutdown
- Local patch checksums

# Worker-Pool Experiment

The repository also contains a compatibility experiment for a proposed four-lane worker architecture.

The intended design was:

```text
one process
    │
    ├── lane 1
    ├── lane 2
    ├── lane 3
    └── lane 4
```

with every Mojo lane owning Python-backed PostgreSQL and Valkey adapters.

The repository documents that the pinned runtime cannot currently support that exact concurrent Python-interop design reliably.

Therefore the current MVP intentionally uses:

```text
multiple independent one-slot worker processes
```

instead.

For portfolio purposes, this is useful systems-engineering evidence: the architecture was adapted to an observed runtime constraint rather than pretending the unsupported concurrency model worked.

# Testing Strategy

The repository has several testing layers.

```text
Pure Mojo unit tests
        │
        ▼
Python adapter tests
        │
        ▼
Database integration tests
        │
        ▼
Queue integration tests
        │
        ▼
Agent-runtime probes
        │
        ▼
Provider probes
        │
        ▼
HTTP integration
        │
        ▼
MVP end-to-end probe
        │
        ▼
Load and recovery evidence
```

# Pure Mojo Unit Tests

Coverage includes modules such as:

```text
Job domain
limits and status
authentication application logic
persistence contracts
queueing
agent runtime
provider runtime
recovery
streaming
operations
tool interoperability
```

# Python Adapter Tests

Python tests cover:

- Contract codecs
- Migrations
- PostgreSQL RLS behavior
- Adapter concurrency
- Agent tools
- OpenAI provider
- Provider controls
- Provider persistence
- Recovery persistence
- Operational telemetry
- Valkey adapter
- Runtime support

# Database Integration Tests

Disposable databases are created for integration testing.

Tests apply migrations and exercise the real persistence boundary.

# Queue Integration

Queue probes verify:

- Authenticated Valkey access
- Streams
- Consumer groups
- TTL records
- Publication
- Reclaiming stale messages
- Duplicate-safe execution

# Agent Runtime Probe

The agent-runtime probe demonstrates a full durable path:

```text
model
  │
  ▼
calculator
  │
  ▼
JSON transform
  │
  ▼
final response
```

It also simulates interruption and resume.

# Provider Probe

The OpenAI provider probe uses a loopback fake Responses server.

This allows deterministic tests without external credentials.

It verifies:

- Structured action parsing
- Tool execution
- Durable provider usage
- Job completion

# Optional Live OpenAI Probe

A live provider probe exists, but only runs when an API credential is explicitly available.

It is bounded and not required for normal test acceptance.

# HTTP Integration

The HTTP integration test exercises the compiled Mojo listener against disposable PostgreSQL and Valkey infrastructure.

# MVP End-to-End Probe

The full private-beta probe combines:

- API
- Dispatcher
- Runtime worker
- Database
- Valkey
- Streaming
- Recovery-related behavior

# Load Testing

The repository contains framework-neutral load actors.

A smoke workload includes approximately:

```text
200 submissions
1,000 get requests
50 cancellations
```

A larger baseline includes approximately:

```text
1,000 submissions
10,000 get operations
250 cancellations
```

Results capture:

- Revision
- Tool/runtime versions
- Workload
- Correctness counts
- Latency percentiles

The load actors focus on application/persistence behavior rather than claiming generalized internet-scale throughput.

# Backup and Restore

The project includes PostgreSQL backup automation.

```text
make backup-db
```

creates a PostgreSQL custom-format backup.

```text
make verify-db-restore
```

restores the backup into a temporary database and verifies expected migration state.

This makes restore verification part of operational development rather than relying only on backup creation.

# Supply-Chain and Image Verification

The repository includes:

- CycloneDX SBOM generation
- Trivy scanning
- Repository scan manifest
- Container-image scan
- Vulnerability exception metadata

These processes are integrated as Make targets rather than being external documentation only.

# Architecture Decision Records

The repository contains ADRs documenting major design choices.

Important decisions include:

```text
001 Framework isolation
002 PostgreSQL as source of truth
003 Mojo/Psycopg boundary
004 API-key HMAC
005 Tenant Row Level Security
006 JCS request identity
007 PostgreSQL/Valkey delivery
008 Durable agent runtime
009 Durable event replay and cancellation
010 OpenAI provider and durable usage
011 PostgreSQL-owned deterministic recovery
012 Typed operational telemetry
013 Maintained MojoFlow private-beta surface
014 Process-based private API concurrency
015 Runtime worker fencing
```

This shows the project's architecture was deliberately documented as a sequence of engineering decisions.

# Core Design Principle 1 — PostgreSQL Is Authoritative

The project does not treat the queue as durable business state.

```text
PostgreSQL:
    authoritative Job lifecycle
    event stream
    agent journal
    checkpoints
    provider usage
    recovery state

Valkey:
    accelerated delivery
    liveness
    distributed controls
```

If Valkey state is lost or duplicated, PostgreSQL can be used to repair the delivery process.

# Core Design Principle 2 — Explicit State Machines

The Job lifecycle is modeled as a closed transition matrix.

The agent-step lifecycle and provider usage also use controlled progression.

This avoids relying on arbitrary strings and ad-hoc updates.

# Core Design Principle 3 — Idempotency Everywhere

The design applies idempotency at several levels:

- API submissions
- Repeated cancellation
- Queue duplicate delivery
- Tool replay
- Recovery claims
- Provider usage records
- Checkpoint resume

# Core Design Principle 4 — Fencing

Worker and execution updates use leases/tokens.

This prevents:

```text
old worker
```

from overwriting:

```text
new worker
```

after ownership changes.

# Core Design Principle 5 — Durable Before External Side Effects

The runtime tries to persist intent before performing important external work.

Examples:

```text
MODEL_REQUESTED persisted
        │
        ▼
provider request

tool intent persisted
        │
        ▼
tool execution
```

This gives recovery code evidence about what was intended before an interruption.

# Core Design Principle 6 — Typed Boundaries

Mojo types are used to express:

- IDs
- timestamps
- states
- limits
- events
- outcomes
- errors
- authentication context
- model requests
- tool calls

Python is isolated to infrastructure interoperability where needed.

# Core Design Principle 7 — Bounded Work

Many subsystems use explicit limits.

Examples:

- Request body size
- Canonical input size
- List page size
- Event replay page size
- Tool-output size
- Token budgets
- Cost budget
- Recovery batch size
- Queue publication batch size
- Provider concurrency
- Container CPU/memory/PID limits

This gives the platform a resource-governance orientation.

# Example End-to-End Job

Consider a client submitting a calculation-oriented agent request.

```json
{
  "agent_name": "analysis-agent",
  "input": {
    "question": "Calculate (25 * 4) + 10 and return the result."
  }
}
```

The full path is:

```text
1. Client sends authenticated POST /v1/jobs
        │
2. API validates JSON and tenant
        │
3. Request is canonicalized and hashed
        │
4. Agent definition is resolved
        │
5. Job stored as PENDING_ENQUEUE
        │
6. Dispatcher marks Job QUEUED
        │
7. Outbox record published to Valkey
        │
8. Worker reads delivery
        │
9. Worker reloads Job from PostgreSQL
        │
10. Worker acquires lease
        │
11. Job becomes RUNNING
        │
12. Runtime persists MODEL_REQUESTED
        │
13. Model chooses CALL_TOOL calculator
        │
14. Tool intent is persisted
        │
15. Calculator returns 110
        │
16. Checkpoint records tool result
        │
17. Runtime performs next model call
        │
18. Model returns RESPOND
        │
19. Final agent step is stored
        │
20. Worker commits COMPLETED
        │
21. Client receives job.completed SSE event
        │
22. GET /v1/jobs/{id} returns public result
```

# Example Failure-and-Recovery Path

```text
Worker starts Job
      │
      ▼
Job becomes RUNNING
      │
      ▼
Worker process dies
      │
      ▼
Lease expires
      │
      ▼
Reconciler claims Job
      │
      ▼
Check deadline/cancellation
      │
      ▼
Schedule deterministic retry
      │
      ▼
RETRY_SCHEDULED
      │
      ▼
Retry becomes due
      │
      ▼
New publication
      │
      ▼
QUEUED
      │
      ▼
Another worker resumes
```

If the previous agent execution had a durable checkpoint, the agent runtime can use it to resume safely.

# Example Client Usage

## Submit

```bash
curl -X POST http://127.0.0.1:58080/v1/jobs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: req-12345" \
  -d '{
    "agent_name": "example-agent",
    "input": {
      "task": "Summarize the latest financial report"
    },
    "priority": "NORMAL",
    "deadline_seconds": 86400
  }'
```

## Get

```bash
curl http://127.0.0.1:58080/v1/jobs/JOB_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## List

```bash
curl "http://127.0.0.1:58080/v1/jobs?limit=25" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Events

```bash
curl http://127.0.0.1:58080/v1/jobs/JOB_ID/events \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: text/event-stream"
```

## Cancel

```bash
curl -X POST http://127.0.0.1:58080/v1/jobs/JOB_ID/cancel \
  -H "Authorization: Bearer YOUR_API_KEY"
```

# Current Scope

The repository describes itself as:

```text
experimental
production-oriented
not production-ready
single-host private API beta
```

The implemented private-beta architecture includes:

- Compiled Mojo API
- PostgreSQL persistence
- Authenticated API keys
- Tenant RLS
- Valkey delivery
- Dispatcher
- Independent one-slot runtime workers
- Agent runtime
- Mock provider
- OpenAI provider path
- Durable checkpoints
- Cancellation
- SSE
- Recovery
- Telemetry
- HAProxy
- Docker image
- Backup/restore verification

# Deliberately Deferred Scaling Areas

The repository documents some post-MVP areas separately.

These include concepts such as:

```text
four-lane in-process worker fairness
routed worker groups
multi-lane worker execution
broader deployment orchestration
```

The present scaling model is process-based:

```text
add independent worker processes
```

rather than:

```text
many Python-interoperability lanes inside one Mojo process
```

# What Makes This Project Technically Distinctive

# 1. Mojo as a Backend Systems Language

The project uses Mojo for:

- Domain logic
- Application services
- HTTP API
- Worker loops
- Queue coordination
- Agent runtime
- Recovery
- Telemetry contracts

Python is used only where mature libraries are needed, such as:

- Psycopg
- OpenAI SDK
- Redis client
- OpenTelemetry SDK

# 2. Durable Agent Execution

The agent is not an in-memory loop.

The design persists:

- Definition binding
- Step intent
- Tool intent
- Model usage
- Checkpoints
- Terminal output

This makes agent execution resumable.

# 3. Queue Correctness Without Trusting the Queue

Valkey is used for speed, but PostgreSQL remains authoritative.

This is a mature distributed-work pattern.

# 4. Provider Accounting as a First-Class Domain

Token reservation, actual token use, prices, uncertainty, monthly usage, and cost are modeled durably.

# 5. Deterministic Recovery

Recovery follows explicit precedence instead of letting each worker improvise recovery behavior.

# 6. SSE From Durable Events

The same PostgreSQL event sequence supports:

- history
- live streaming
- reconnection

# 7. Strong Compatibility Engineering

The repository does not assume the experimental Mojo ecosystem is stable.

It captures exact toolchain and framework versions and verifies them with probes.

# 8. Operator-Focused Tooling

The project includes scripts for:

- migrations
- database roles
- API keys
- agent definitions
- model catalog
- provider usage
- recovery claims
- dead letters
- backups
- load tests
- health checks
- SBOMs

# Engineering Skills Demonstrated

# Mojo

- Mojo package design
- Structs and value types
- Error handling
- Compiled binaries
- Native testing
- Python interop
- Modular project structure

# Python

- Psycopg
- PostgreSQL connection pooling
- Redis/Valkey
- OpenAI SDK
- OpenTelemetry
- Testing
- Operational scripts
- Protocol adapters

# Distributed Systems

- Job queues
- At-least-once delivery
- Transactional outbox
- Consumer groups
- Lease fencing
- Optimistic concurrency
- Idempotency
- Recovery
- Reconciliation
- Dead-letter handling
- Durable checkpoints
- Event replay

# Backend API Engineering

- REST API
- Bearer authentication
- Request IDs
- Pagination
- Problem Details errors
- SSE
- Health endpoints
- Idempotency keys

# PostgreSQL

- Schema design
- SQL migrations
- Row Level Security
- JSONB
- Advisory locks
- Database functions
- Indexes
- Constraints
- Transactions
- Durable event logs

# AI Infrastructure

- Agent runtimes
- Tool calling
- Agent definitions
- Model-provider adapters
- OpenAI Responses API
- Structured model actions
- Token accounting
- Cost accounting
- Rate limits
- Context limits
- Replay-safe tools

# Queue Infrastructure

- Valkey Streams
- Consumer groups
- Stream acknowledgements
- Message reclaiming
- Lua scripts
- Worker heartbeats

# Reliability Engineering

- Timeouts
- Retry schedules
- Circuit breaker
- Recovery claims
- Fencing
- Deadline handling
- Backoff
- Backup/restore verification
- Graceful shutdown

# Observability

- OpenTelemetry
- OTLP
- Prometheus
- Tempo
- Structured logging
- Trace propagation
- Health/readiness models

# DevOps

- Docker
- Docker Compose
- Multi-stage builds
- HAProxy
- Non-root containers
- Secrets files
- SBOM generation
- Trivy
- Make automation
- Pixi dependency locking

# Testing

- Native Mojo unit tests
- Python unit tests
- PostgreSQL integration tests
- Queue integration tests
- API contract tests
- HTTP tests
- Agent probes
- Provider probes
- Recovery tests
- Load actors
- Compatibility tests

# Resume-Ready Project Title Options

Suitable titles include:

1. **MojoFlow Agent Grid — Durable Multi-Tenant AI Agent Runtime**
2. **Distributed AI Agent Execution Platform**
3. **Durable Agent Orchestration Backend in Mojo**
4. **Mojo-Based Multi-Tenant Agent Execution Grid**
5. **High-Throughput AI Job and Agent Runtime Platform**

# Resume-Ready Description

**MojoFlow Agent Grid — Durable Multi-Tenant Agent Execution Backend**

Developed an experimental production-oriented AI agent execution backend using Mojo, Python, PostgreSQL, Valkey, MojoFlow, OpenAI, Docker, and OpenTelemetry. Implemented authenticated multi-tenant Job submission, RFC 8785 request canonicalization, idempotency, PostgreSQL Row Level Security, optimistic Job state transitions, a transactional outbox, Valkey Streams delivery, lease-fenced workers, durable agent definitions, step journals, replay-safe checkpoints, tool execution, OpenAI Responses integration, token and cost accounting, distributed provider controls, cancellation, Server-Sent Event replay, deterministic recovery, structured telemetry, HAProxy process pools, container hardening, backup/restore verification, and layered test/probe infrastructure.

# Resume Bullet Version

- Built a multi-tenant AI agent execution backend in **Mojo** with Python interoperability, PostgreSQL, Valkey Streams, MojoFlow, OpenAI, HAProxy, and Docker.
- Designed a durable Job state machine covering queued, leased, running, retry, completion, cancellation, timeout, budget-exceeded, and dead-letter states with optimistic versioning and lease fencing.
- Implemented authenticated `/v1` Job APIs with HMAC API keys, tenant-scoped PostgreSQL Row Level Security, RFC 8785 canonical request hashing, idempotency keys, signed cursor pagination, RFC 9457 problem responses, and durable SSE event replay.
- Built a PostgreSQL transactional-outbox and Valkey Streams pipeline with dispatcher, consumer groups, one-slot workers, duplicate-safe at-least-once delivery, queue repair, and worker heartbeats.
- Developed a durable agent runtime with immutable agent-definition binding, model/tool step journals, versioned checkpoints, replay-safe calculator and JSON-transform tools, execution budgets, and crash-safe resume.
- Integrated the **OpenAI Responses API** through a typed provider adapter with strict structured actions, token counting, durable usage attempts, monthly tenant quotas, configurable model pricing, RPM/TPM limits, concurrency controls, retry policy, and circuit breaking.
- Implemented deterministic reconciliation for expired leases, retries, timeouts, cancellation, stranded queue work, dead-letter outcomes, and uncertain provider accounting.
- Added OpenTelemetry tracing and metrics, Prometheus and Tempo integration, W3C trace propagation, structured logs, readiness/liveness checks, multi-stage Docker builds, SBOM generation, Trivy gates, and PostgreSQL backup/restore probes.
- Created layered Mojo/Python testing infrastructure covering unit, contract, PostgreSQL, Valkey, HTTP, agent-runtime, provider, streaming, recovery, compatibility, and load scenarios.

# Concise Resume Version

Built a durable multi-tenant AI agent execution backend using **Mojo, Python, PostgreSQL, Valkey, MojoFlow, OpenAI, Docker, HAProxy, and OpenTelemetry**, featuring idempotent Job APIs, transactional queue delivery, lease-fenced workers, durable agent checkpoints, tool calling, provider usage accounting, SSE replay, deterministic recovery, and production-oriented observability.

# Portfolio Description

MojoFlow Agent Grid is an experimental agent-infrastructure project that treats AI work as durable background Jobs rather than transient model calls. Authenticated tenants submit Jobs through a compiled Mojo API. PostgreSQL stores authoritative Job state, append-only events, idempotency records, immutable agent bindings, checkpoints, provider usage, and recovery claims. A dispatcher publishes durable outbox entries to Valkey Streams, independent workers acquire fenced leases and run an agent engine, and a reconciler repairs abandoned or uncertain work. The runtime supports structured model actions, replay-safe tools, OpenAI Responses integration, budget enforcement, durable usage accounting, cancellation, SSE progress replay, OpenTelemetry telemetry, Docker deployment, HAProxy process pools, and extensive automated probes.

# Compact Portfolio Description

Distributed AI-agent backend built with **Mojo, PostgreSQL, Valkey Streams, OpenAI, Docker, HAProxy, and OpenTelemetry**. Implements durable multi-tenant Job execution, idempotent APIs, transactional outbox delivery, fenced workers, agent checkpoints and tools, provider quotas/cost accounting, SSE event replay, deterministic recovery, observability, and extensive testing.

# LinkedIn Project Description

Developed MojoFlow Agent Grid, an experimental production-oriented backend for durable multi-tenant AI agent execution. The system uses Mojo for the domain, API, queueing, workers, agent runtime, recovery, and operational contracts, with Python interoperability for Psycopg, Valkey, OpenAI, and OpenTelemetry. Implemented authenticated Job APIs, PostgreSQL RLS and event persistence, idempotent submission, transactional outbox delivery, Valkey Streams workers, lease fencing, immutable agent definitions, crash-safe checkpoints, structured tool calling, OpenAI Responses integration, token/cost accounting, provider controls, durable cancellation and SSE replay, deterministic reconciliation, HAProxy process pools, containerized operations, and layered verification.

# Interview Talking Points

## What is MojoFlow Agent Grid?

It is an execution backend for AI agents. Instead of calling an LLM directly and holding all state in one request, the platform converts work into durable Jobs. Those Jobs are persisted, queued, leased to workers, executed by an agent runtime, checkpointed, and exposed through an authenticated API.

## Why use PostgreSQL as the source of truth?

A queue is good for delivery but is not ideal as the authoritative business state. PostgreSQL stores the actual Job lifecycle, event sequence, idempotency records, agent checkpoints, provider usage, and recovery information. Valkey can therefore be repaired or replayed from durable records.

## What is the transactional outbox?

When a Job needs to enter the queue, the Job state and queue-publication record are written in the same PostgreSQL transaction. A separate dispatcher later publishes the outbox record to Valkey. This avoids a failure window where a database commit succeeds but a broker publish is lost.

## How are duplicate queue messages handled?

Delivery is intentionally at least once. The worker reloads the Job from PostgreSQL and checks the Job status, version, and lease. A stale or duplicate message is acknowledged without starting a second execution.

## What is lease fencing?

A worker owns a Job only while it has the current lease token. Execution outcomes must carry that token. If the lease expires and another worker takes the Job, the stale worker's result can no longer update the authoritative Job.

## How does the durable agent runtime work?

The runtime stores model and tool execution steps in PostgreSQL. It writes intent before external work and periodically creates checkpoints containing usage, context, pending actions, and terminal information. This lets an interrupted process resume safely.

## What tools are available?

The built-in runtime includes a checked integer calculator and a bounded JSON transformation tool. Both are deterministic and replay-safe, making them useful for demonstrating crash recovery.

## How is OpenAI integrated?

The runtime constructs a typed model request and passes it through an OpenAI Responses adapter. The adapter counts input tokens, reserves provider capacity, performs a strict structured-output generation request, records actual usage, and returns a typed action such as `RESPOND`, `CALL_TOOL`, or `FAIL`.

## How are AI costs controlled?

The platform models model pricing in a durable provider catalog and records each provider attempt. Tenant/month usage can track tokens and monetary cost. Valkey also coordinates requests-per-minute, tokens-per-minute, concurrency, and a shared circuit breaker.

## How does SSE reconnect work?

Every Job event is first stored in PostgreSQL with a sequence number. That sequence becomes the SSE `id`. A reconnecting client sends `Last-Event-ID`, and the API replays only events after that sequence.

## How does recovery work?

The reconciler looks for expired leases, due retries, stranded Jobs, cancellation situations, timeouts, and uncertain provider usage. It claims a bounded batch, locks and revalidates each Job, applies deterministic precedence, and writes the resulting state and event changes.

## Why are command and SSE API processes separated?

SSE requests live much longer than standard submit/get/list/cancel calls. HAProxy sends command traffic to one process pool and event streams to another, so a large number of open event connections does not consume all command capacity.

## Why is Python still present in a Mojo project?

Mojo owns the application and domain layers, while Python provides mature ecosystem integrations such as Psycopg, Redis/Valkey, the OpenAI SDK, and OpenTelemetry. Typed adapters keep Python objects from leaking into the domain model.

## What is the current scaling model?

The private-beta runtime scales with multiple independent one-slot worker processes. The repository also explored a four-lane in-process worker, but the pinned Mojo/Python runtime could not support that exact architecture reliably, so multi-process execution is used for the MVP.

# Suggested Resume Technology Line

**Technologies:** Mojo, Python, MojoFlow, PostgreSQL 16, Psycopg, Valkey Streams, OpenAI Responses API, Docker, Docker Compose, HAProxy, OpenTelemetry, Prometheus, Tempo, Pixi, Trivy, CycloneDX.

# Suggested Portfolio Feature Line

**Key features:** Multi-tenant Job API, HMAC API keys, Row Level Security, RFC 8785 canonical request identity, idempotency, Job state machine, transactional outbox, Valkey Streams, worker lease fencing, durable agent steps/checkpoints, deterministic tools, OpenAI provider integration, token/cost quotas, SSE event replay, cancellation, retry/recovery reconciliation, telemetry, backup/restore testing, and containerized operations.

# Skills Keywords for CV and ATS

```text
Mojo
Python
PostgreSQL
Valkey
Redis Streams
Psycopg
MojoFlow
OpenAI API
OpenAI Responses API
AI Agents
Agent Orchestration
Distributed Systems
Job Queues
Transactional Outbox
Idempotency
Optimistic Concurrency
Lease Fencing
State Machines
Retry Logic
Circuit Breaker
Rate Limiting
Multi-Tenancy
Row Level Security
Server-Sent Events
Event Sourcing Concepts
Durable Workflows
Checkpointing
Crash Recovery
Reconciliation
REST APIs
RFC 8785
RFC 9457
HMAC
Docker
Docker Compose
HAProxy
OpenTelemetry
Prometheus
Tempo
Structured Logging
W3C Trace Context
SBOM
Trivy
Pixi
Integration Testing
Load Testing
Backup and Restore
```

# Accurate Project Positioning

A strong and accurate description is:

> **MojoFlow Agent Grid is an experimental, production-oriented backend for durable multi-tenant AI agent execution. It combines a compiled Mojo API, PostgreSQL-backed Job/event state, Valkey queue delivery, lease-fenced worker processes, durable agent checkpoints and tools, OpenAI provider accounting, cancellation and SSE replay, deterministic reconciliation, and production-style telemetry and container operations.**

The repository itself identifies the current milestone as:

```text
single-host authenticated private API beta
```

rather than a finished general-purpose production service.

# Project Summary for Technical Interviews

The system can be described through five layers:

```text
1. Control Plane
   Authenticated Job API
   Idempotency
   Tenant policy
   Cancellation
   SSE

2. Durable State
   PostgreSQL Jobs
   Events
   Bindings
   Steps
   Checkpoints
   Usage
   Recovery

3. Delivery Plane
   Transactional outbox
   Dispatcher
   Valkey Streams

4. Execution Plane
   Fenced workers
   Agent runtime
   Tools
   OpenAI adapter

5. Operational Plane
   Reconciler
   Telemetry
   Health
   HAProxy
   Docker
   Backups
```

That structure is the best way to explain the project in an interview because it shows that the repository is an infrastructure system, not merely an LLM API wrapper.

# Final Project Overview

MojoFlow Agent Grid demonstrates how an AI-agent backend can be designed around the same reliability principles used in distributed task-processing systems.

Its key technical progression is:

```text
Authenticated request
        │
        ▼
Canonical and idempotent admission
        │
        ▼
Durable PostgreSQL Job
        │
        ▼
Transactional outbox
        │
        ▼
Valkey delivery
        │
        ▼
Fenced runtime worker
        │
        ▼
Durable model/tool checkpoints
        │
        ▼
Provider usage accounting
        │
        ▼
Terminal Job result
        │
        ▼
Durable SSE replay
        │
        ▼
Recovery and telemetry
```

For portfolio purposes, the strongest themes are:

- **Mojo systems programming**
- **Distributed Job execution**
- **Durable AI-agent orchestration**
- **PostgreSQL transactional design**
- **Queue and worker engineering**
- **OpenAI provider integration**
- **Idempotency and recovery**
- **Multi-tenant backend architecture**
- **SSE and event replay**
- **Observability and operational engineering**
- **Compatibility engineering for an emerging language ecosystem**

This makes the project particularly relevant to roles involving:

```text
AI infrastructure
backend engineering
distributed systems
agent platforms
platform engineering
MLOps infrastructure
high-reliability API systems
```
