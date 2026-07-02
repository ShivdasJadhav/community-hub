# Backend Architecture

Welcome to the Community Hub backend!

This project follows a **Feature-First Modular Monolith** architecture. The goal is to keep the codebase easy to understand for new contributors while remaining scalable enough for production use.

Rather than organizing code by technical layers (such as one large `models/`, `services/`, or `routers/` directory), each feature owns everything related to itself.

For example, the **Events** feature contains its own API, business logic, database models, validation, permissions, and background tasks.

---

# Project Structure

```text
backend/
│
├── app/
│   │
│   ├── main.py
│   │
│   ├── core/
│   ├── shared/
│   │
│   ├── auth/
│   ├── users/
│   ├── communities/
│   ├── memberships/
│   ├── announcements/
│   ├── events/
│   ├── bookings/
│   ├── facilities/
│   ├── complaints/
│   ├── polls/
│   ├── notifications/
│   ├── reports/
│   └── admin/
│
├── migrations/
├── tests/
├── scripts/
└── pyproject.toml
```

---

# Core Principles

Our backend follows a few simple principles:

* **Feature First** – Every feature owns its implementation.
* **Single Responsibility** – Every file has one clear purpose.
* **Separation of Concerns** – HTTP, business logic, and persistence remain independent.
* **Scalable by Default** – Features can evolve independently without affecting unrelated modules.
* **Contributor Friendly** – New contributors should be able to locate the correct file within minutes.

---

# Request Lifecycle

Every request follows the same flow.

```text
Client
    │
    ▼
API Router
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

The response then travels back through the same layers.

Keeping these responsibilities separate makes the code easier to test, maintain, and extend.

---

# Feature Structure

Each feature follows the same layout.

```text
events/
├── api/
│   ├── router.py
│   └── dependencies.py
│
├── domain/
│   ├── models.py
│   ├── schemas.py
│   ├── service.py
│   ├── repository.py
│   └── validators.py
│
├── tasks.py
├── permissions.py
└── constants.py
```

Every feature in the project should follow this structure whenever possible.

---

# Folder Responsibilities

## api/

Responsible for the HTTP layer.

Contains everything related to FastAPI routing and request handling.

Typical responsibilities:

* Route definitions
* Request/response handling
* HTTP status codes
* Dependency injection
* Calling services

Should **not** contain:

* SQL queries
* Business rules
* Complex validation

Example:

```python
@router.post("/")
async def create_event(...):
    return await service.create_event(...)
```

---

## api/dependencies.py

Contains dependencies that are specific to this feature.

Examples:

* Permission dependencies
* Resource loading
* Ownership checks

Example:

```python
get_current_event()

require_event_admin()
```

Dependencies shared across the entire application belong in `core/`.

---

## domain/

Contains the business domain of the feature.

This folder answers:

> How does this feature work?

It should remain independent of HTTP whenever possible.

---

## domain/models.py

Contains SQLAlchemy models.

Responsibilities:

* Database tables
* Relationships
* ORM configuration

Should not contain:

* API schemas
* Business logic
* HTTP logic

---

## domain/schemas.py

Contains Pydantic models.

Examples:

* Create request
* Update request
* Response objects

These define the API contract.

Example:

```python
EventCreate
EventUpdate
EventResponse
```

---

## domain/service.py

Contains business logic.

This is the heart of every feature.

Responsibilities include:

* Business rules
* Orchestrating repositories
* Calling other services
* Triggering notifications
* Publishing domain events

Services should not know anything about HTTP requests or responses.

Example:

```text
Validate request
      ↓
Create event
      ↓
Notify members
      ↓
Return result
```

---

## domain/repository.py

Responsible only for database access.

Repositories:

* Read data
* Insert data
* Update data
* Delete data

Repositories should not contain business decisions.

Good:

```text
Find upcoming events
```

Bad:

```text
Only admins can publish events
```

Authorization belongs in the service layer.

---

## domain/validators.py

Contains feature-specific validation.

Examples:

* Start date before end date
* Booking capacity
* Registration deadline
* Duplicate checks

Keeping validation separate makes services easier to read.

---

## permissions.py

Contains authorization logic for this feature.

Examples:

* Can edit event?
* Can cancel booking?
* Can archive announcement?

Permissions should be reusable throughout the feature.

---

## constants.py

Contains constants used only by this feature.

Examples:

```python
EVENT_STATUS

BOOKING_STATUS

DEFAULT_CAPACITY
```

Avoid hardcoded strings throughout the codebase.

---

## tasks.py

Contains asynchronous or background tasks.

Initially these may use FastAPI's `BackgroundTasks`.

In the future they may be migrated to Celery without changing the rest of the feature.

Examples:

* Send emails
* Push notifications
* Generate reports
* Schedule reminders

---

# Shared Directories

## core/

Contains application infrastructure.

Examples:

* Configuration
* Database setup
* Security
* Logging
* Lifespan events
* Global dependencies

Think:

> "How does the application run?"

Not:

> "How does the business work?"

---

## shared/

Contains reusable code shared across multiple features.

Examples:

* Pagination
* Common response models
* Shared permissions
* Constants
* Utility classes

Do **not** place feature-specific business logic here.

---

# Design Rules

## Routers

Routers should remain thin.

Their only responsibility is translating HTTP requests into service calls.

---

## Services

Services contain business decisions.

Whenever you ask:

> "Should the application allow this?"

The answer belongs in a service.

---

## Repositories

Repositories interact with the database.

Whenever you ask:

> "How do we fetch or persist data?"

The answer belongs in a repository.

---

## Models

Models represent the database.

They should never contain HTTP or business logic.

---

## Schemas

Schemas represent the public API.

Never expose SQLAlchemy models directly.

---

# Testing Strategy

Tests mirror the application structure.

```text
tests/

events/

users/

communities/

bookings/
```

Each feature should contain tests for:

* API endpoints
* Services
* Repositories
* Permissions
* Validation

---

# Adding a New Feature

When creating a new feature:

1. Create a new feature directory.
2. Follow the standard feature structure.
3. Register the router.
4. Write tests.
5. Update documentation if needed.

Keeping every feature consistent makes the project much easier to navigate for new contributors.

---

# Philosophy

This project values **clarity over cleverness**.

We intentionally avoid unnecessary abstractions and premature optimization.

When adding new code, ask yourself:

* Does this belong to one feature?
* Can another contributor find it easily?
* Does this file have a single responsibility?
* Does this follow the existing feature structure?

If the answer to all four is **yes**, you're probably placing the code in the right location.

Consistency is more valuable than perfection.
