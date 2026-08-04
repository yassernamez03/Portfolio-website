# LangChain Technical Documentation Assistant — Project Overview

**Repository:** [yassernamez03/Langchain-technical-documentation-assistant](https://github.com/yassernamez03/Langchain-technical-documentation-assistant)

## Overview

This project implements an **agentic Retrieval-Augmented Generation (RAG) assistant** for querying technical PDF documentation through natural-language conversations.

The system ingests technical manuals, divides them into searchable text chunks, converts those chunks into vector embeddings, and stores them in a Supabase vector database. At query time, a LangChain tool-calling agent decides when to search the documentation and uses the retrieved passages to generate a grounded response with a Groq-hosted large language model.

The repository provides both:

- A command-line demonstration
- An interactive Streamlit chatbot

The included document collection contains technical manuals related to **VACON NXS/NXP industrial drives and equipment**.

## Problem Addressed

Large technical manuals are difficult to search efficiently because relevant information may be distributed across hundreds of pages and expressed using specialized terminology.

This project addresses that problem by allowing users to ask questions conversationally, while the assistant:

1. Interprets the question.
2. Decides whether document retrieval is required.
3. Searches semantically related manual passages.
4. Provides the retrieved context to the language model.
5. Generates a focused technical response.

## Main Features

### PDF Documentation Ingestion

The ingestion pipeline automatically loads every PDF stored in the `documents/` directory.

The repository currently includes three technical manuals:

- `nx_man_fra-1.pdf`
- `optci-vacon-nxp-air-cooled-manual.pdf`
- `vacon-nxs-nxp-manual.pdf`

This structure allows additional documentation to be added without changing the ingestion code.

### Recursive Text Chunking

Loaded documents are divided with LangChain's `RecursiveCharacterTextSplitter`.

Configured values:

```text
Chunk size: 1,000 characters
Chunk overlap: 100 characters
```

The overlap preserves context across adjacent chunks and reduces the chance that an important explanation is split at an arbitrary boundary.

### Local Hugging Face Embeddings

The project uses:

```text
sentence-transformers/all-MiniLM-L6-v2
```

This model generates **384-dimensional embeddings** locally.

Using a local embedding model provides several advantages:

- No paid embedding API is required
- Document text does not need to be sent to an embedding provider
- Embedding generation can run independently from the chat-model provider
- The retrieval layer remains portable

### Supabase Vector Storage

Document chunks and their embeddings are stored with `SupabaseVectorStore`.

The implementation expects:

- A Supabase table named `documents`
- A similarity-search RPC named `match_documents`
- A vector column compatible with 384-dimensional embeddings

Supabase provides persistent PostgreSQL storage and vector similarity search through `pgvector`.

### Semantic Similarity Search

The retrieval tool searches the vector database with the user's question and returns the two most relevant document chunks:

```text
Top-k retrieval: 2 chunks
```

Each retrieved result is serialized with:

- Document metadata
- Page content

The original LangChain document objects are also returned as tool artifacts.

### Agentic Retrieval

The project does not force retrieval for every message.

Instead, it creates a LangChain tool-calling agent with a dedicated `retrieve` tool. The language model can determine when the documentation should be searched before producing its answer.

This differs from a fixed RAG chain in which retrieval is executed unconditionally for every prompt.

### Groq-Hosted Language Models

The project migrated its generation layer from OpenAI to Groq.

Two configurations appear in the source code:

- **Console example:** `llama-3.3-70b-versatile`
- **Streamlit application:** `qwen/qwen3-32b`

Both are configured with:

```text
Temperature: 0
```

A zero-temperature configuration aims to make technical responses more deterministic and less creative.

### LangChain Tool-Calling Agent

The project uses:

- `create_tool_calling_agent`
- `AgentExecutor`
- A LangChain Hub tool-calling prompt
- A custom retrieval tool

The executor coordinates the model, the retrieval decision, tool execution, and final response generation.

### Interactive Streamlit Chatbot

The Streamlit interface provides:

- Chat-style user and assistant messages
- A natural-language input field
- Conversation-history display
- Session-state persistence across Streamlit reruns
- Automatic retrieval and response generation
- Local `.env` and deployed Streamlit Secrets support

### Conversation History

Messages are stored in `st.session_state` as LangChain message objects:

- `HumanMessage`
- `AIMessage`

The full session history is passed back to the agent with each new question, allowing follow-up questions to use previous conversational context.

### Local and Cloud Configuration

Configuration values can be loaded from:

1. Streamlit Secrets when deployed
2. Environment variables from a local `.env` file

Required values include:

- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

### Vector-Dimension Migration Guidance

The repository documents how to migrate a Supabase schema previously configured for OpenAI's 1,536-dimensional embeddings to the 384-dimensional Hugging Face model.

It includes SQL guidance for:

- Replacing the embedding column with `vector(384)`
- Updating the `match_documents` function
- Re-ingesting documents after the schema change

## Agentic RAG Workflow

```text
Technical PDF Manuals
        │
        ▼
PyPDFDirectoryLoader
        │
        ▼
Recursive Text Splitting
1,000 characters / 100 overlap
        │
        ▼
Hugging Face Embeddings
all-MiniLM-L6-v2
        │
        ▼
Supabase PostgreSQL + pgvector
documents table
        │
        ▼
User Question
        │
        ▼
LangChain Tool-Calling Agent
        │
        ├── Answer directly when retrieval is unnecessary
        │
        └── Call the retrieve tool when documentation is needed
                    │
                    ▼
          Top-2 Similarity Search
                    │
                    ▼
         Retrieved Manual Passages
                    │
                    ▼
            Groq Language Model
                    │
                    ▼
        Contextual Technical Answer
```

## Source-Code Architecture

```text
Langchain-technical-documentation-assistant/
├── agentic_rag.py
├── agentic_rag_streamlit.py
├── ingest_in_db.py
├── requirements.txt
├── .env.example
├── .streamlit/
│   └── config.toml
└── documents/
    ├── nx_man_fra-1.pdf
    ├── optci-vacon-nxp-air-cooled-manual.pdf
    └── vacon-nxs-nxp-manual.pdf
```

### `ingest_in_db.py`

Implements the document-indexing pipeline.

Responsibilities include:

- Loading environment variables
- Connecting to Supabase
- Initializing the Hugging Face embedding model
- Loading PDFs from the documentation directory
- Splitting documents into overlapping chunks
- Generating vector embeddings
- Uploading chunks and vectors to Supabase

### `agentic_rag.py`

Provides a command-line example of the RAG agent.

Responsibilities include:

- Connecting to Supabase
- Initializing the embedding model and vector store
- Initializing the Groq chat model
- Defining the retrieval tool
- Creating the tool-calling agent
- Running the agent executor
- Printing the generated response

The example invokes the agent with a predefined question.

### `agentic_rag_streamlit.py`

Implements the browser-based documentation assistant.

Responsibilities include:

- Reading local or deployed secrets
- Initializing Supabase, embeddings, and the vector store
- Configuring the Groq language model
- Defining the retrieval tool
- Building the LangChain agent and executor
- Rendering the Streamlit chat interface
- Maintaining conversation history
- Passing chat history to the agent
- Displaying generated answers

### `.streamlit/config.toml`

Configures Streamlit runtime behavior.

The repository disables the default file watcher to avoid local issues involving PyTorch classes and enables faster application reruns.

### `.env.example`

Documents the required Groq and Supabase configuration variables without including actual credentials.

## Technology Stack

### Language and Application

- Python 3.11+
- Streamlit
- python-dotenv

### AI Orchestration

- LangChain
- LangChain agents
- LangChain tools
- LangChain Hub prompts
- AgentExecutor

### Language Model

- Groq API
- Qwen 3 32B in the Streamlit implementation
- Llama 3.3 70B configuration in the console example

### Embeddings

- Hugging Face Embeddings
- Sentence Transformers
- `all-MiniLM-L6-v2`

### Document Processing

- PyPDF
- `PyPDFDirectoryLoader`
- `RecursiveCharacterTextSplitter`

### Database and Retrieval

- Supabase
- PostgreSQL
- pgvector
- Supabase RPC similarity search

## Engineering Highlights

- Separates document ingestion from query-time inference
- Uses a persistent vector database rather than an in-memory index
- Implements tool-controlled retrieval instead of a fixed retrieval chain
- Uses local embeddings while keeping generation on a hosted LLM
- Supports both command-line and web interfaces
- Preserves multi-turn conversation history
- Returns retrieved documents as structured tool artifacts
- Supports local development and Streamlit deployment configuration
- Includes database migration guidance for embedding-model changes
- Allows the document collection to be extended by adding PDFs to one directory

## Agentic RAG vs. Basic RAG

### Basic RAG

A conventional RAG pipeline generally performs retrieval before every response:

```text
Question → Retrieve documents → Generate answer
```

### Agentic RAG

This project exposes retrieval as a tool:

```text
Question → Agent decision → Optional retrieval → Generate answer
```

The agentic approach can:

- Avoid unnecessary database searches
- Reformulate its retrieval behavior through the language model
- Combine conversational context with document lookup
- Support additional tools in future versions

The current implementation contains one external tool—the Supabase document retriever—but its architecture can be extended with tools for web search, calculations, databases, or equipment APIs.

## Current Implementation Notes

### Different Models Between Interfaces

The console and Streamlit scripts currently specify different Groq models. This does not prevent the system from working, but responses may differ between the two interfaces.

### Limited Retrieval Depth

The retriever currently returns only two chunks. This keeps prompts compact but may be insufficient for questions whose answer spans multiple sections or manuals.

### Source Presentation

Retrieved metadata is supplied to the agent, but the Streamlit interface displays only the final generated text. Explicit source cards, page references, or clickable citations are not separately rendered.

### Ingestion Scope

The ingestion script processes PDFs only, despite importing `TextLoader`. Text-file ingestion is not connected to the current pipeline.

### No User Authentication

The Streamlit application is a shared documentation chatbot and does not implement accounts, roles, or per-user document collections.

### No Automated Re-Indexing

Documents must be ingested manually by running `ingest_in_db.py` after adding or changing files.

## Skills Demonstrated

- Retrieval-Augmented Generation
- Agentic AI workflows
- LangChain agents and tools
- Prompt-based tool calling
- Large language model integration
- Semantic search
- Vector embeddings
- Sentence Transformers
- Supabase and PostgreSQL
- pgvector similarity search
- PDF document processing
- Text chunking
- Streamlit application development
- Environment and secrets management
- Multi-turn chat history
- Modular AI application architecture

## Resume-Ready Description

**LangChain Technical Documentation Assistant**

Developed an agentic RAG assistant for querying industrial technical manuals using Python, LangChain, Groq, Hugging Face embeddings, Supabase, and Streamlit. Built a PDF ingestion pipeline with recursive text chunking and local `all-MiniLM-L6-v2` embeddings, stored 384-dimensional vectors in Supabase/pgvector, and exposed semantic retrieval as a LangChain tool used by a tool-calling agent. Implemented a multi-turn Streamlit chatbot with session-based conversation history and support for both local environment variables and deployed Streamlit Secrets.

## Compact Portfolio Description

Agentic technical-documentation assistant built with **LangChain, Groq, Hugging Face Sentence Transformers, Supabase/pgvector, and Streamlit**. Ingests PDF manuals, creates local embeddings, performs semantic retrieval, and uses a tool-calling agent to answer contextual questions from technical documentation.
