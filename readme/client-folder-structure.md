
---

# </> Client Folder Structure

```text
src/
├── api/
├── assets/
├── components/
├── features/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── utils/
├── App.jsx
└── main.jsx
```
The philosophy behind this structure is:

* **Features own business logic.**
* **Shared code lives in common places.**
* **Avoid "miscellaneous" folders that become dumping grounds.**
* **A new contributor should know where to add a file without asking.**


Let's go through each one.

---

# main.jsx

## Responsibility

Application entry point.

It should do only application bootstrapping.

Example:

```jsx
createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <QueryClientProvider>
            <App />
        </QueryClientProvider>
    </BrowserRouter>
)
```

It **should never** contain business logic.

---

# App.jsx

Think of this as the shell.

Responsibilities:

* Theme Provider
* Toast Provider
* Global Modals
* Route rendering

Example:

```jsx
<AppProviders>
    <AppRoutes />
</AppProviders>
```

Nothing more.

---

# api/

Responsible for communicating with the backend.

Example

```
api/

    client.js
    auth.js
    community.js
    events.js
```

`client.js`

```javascript
axios.create(...)
```

Every API file imports this client.

Never write

```javascript
axios.get(...)
```

inside components.

Instead

```javascript
api/events.js

↓

export function getEvents()
```

---

# services/

This confuses many people.

Think:

API returns raw data.

Service prepares it for the UI.

Example

Backend returns

```json
{
    "first_name":"John",
    "last_name":"Doe"
}
```

Service

```javascript
getMemberName(member)

↓

John Doe
```

Another example

```
calculateOccupancy()

formatCurrency()

buildBreadcrumb()

permission checks
```

Services contain frontend business logic.

---

# features/

This is the heart of the application.

Every business module owns its code.

Example

```
features/

    auth/

    communities/

    events/

    bookings/

    complaints/

    members/

    notifications/
```

Inside

```
events/

    components/

    hooks/

    pages/

    api.js

    validations.js

    constants.js
```

Notice

Events own everything about Events.

Another feature never imports internal event components.

---

# pages/

These represent actual URLs.

Example

```
pages/

    Login.jsx

    Dashboard.jsx

    NotFound.jsx
```

Usually they compose feature components.

Example

```
Dashboard

↓

Upcoming Events Widget

↓

Announcements Widget

↓

Statistics Widget
```

Pages shouldn't implement complicated logic.

---

# routes/

Responsible only for routing.

Example

```
routes/

    index.jsx

    ProtectedRoute.jsx

    AdminRoute.jsx
```

Example

```jsx
<Route
    path="/events"
    element={<EventsPage/>}
/>
```

Authorization wrappers also live here.

---

# layouts/

Defines page layouts.

Example

```
layouts/

    DashboardLayout.jsx

    AuthLayout.jsx

    AdminLayout.jsx
```

Dashboard Layout

```
Sidebar

Navbar

Content

Footer
```

Authentication pages

```
Centered Card

Background

Logo
```

---

# components/

Reusable UI.

Not business-specific.

Example

```
components/

    ui/

    common/

    layout/
```

---

## ui/

Small UI building blocks.

```
Button

Input

Card

Dialog

Badge

Avatar

Table
```

Mostly from shadcn.

---

## common/

Shared higher-level components.

Example

```
LoadingSpinner

ErrorState

ConfirmDialog

EmptyState

SearchBar

Pagination
```

Used everywhere.

---

## layout/

Pieces shared across layouts.

Example

```
Sidebar

Navbar

Footer

Breadcrumbs
```

---

# hooks/

Reusable custom React hooks.

Not feature-specific.

Example

```
useDebounce()

useLocalStorage()

useDarkMode()

useWindowSize()

usePagination()
```

If only Events uses a hook

```
features/events/hooks/
```

If everyone uses it

```
hooks/
```

---

# lib/

External library configuration.

Example

```
lib/

    axios.js

    queryClient.js

    dayjs.js

    socket.js
```

Think

"configuration"

not

"business logic"

---

# utils/

Pure helper functions.

No React.

No API.

No components.

Examples

```
formatDate()

formatCurrency()

slugify()

capitalize()

downloadFile()

sleep()
```

Given same input

Always same output.

---

# assets/

Everything static.

```
assets/

    images/

    icons/

    fonts/

    logos/
```

No logic.

---

# Public Folder

```
public/

favicon.ico

robots.txt

manifest.json
```

Served directly.

---

# Example: Create Event Feature

Suppose you're implementing Events.

```
features/

    events/

        api.js

        validations.js

        hooks/

            useEvents.js

        components/

            EventCard.jsx

            EventTable.jsx

            EventFilters.jsx

        pages/

            EventsPage.jsx

            CreateEventPage.jsx
```

Flow

```
CreateEventPage

↓

EventForm

↓

React Hook Form

↓

api.js

↓

FastAPI

↓

Response

↓

TanStack Query Cache

↓

UI updates
```

Everything stays inside the Events feature unless it's genuinely reusable.

---

# How to Decide Where Code Belongs

Ask yourself these questions in order:

### 1. Is it tied to one feature?

Yes →

```
features/events/
```

---

### 2. Is it reusable across features?

Yes →

```
components/
```

or

```
hooks/
```

---

### 3. Is it just formatting?

Yes →

```
utils/
```

---

### 4. Does it communicate with the backend?

Yes →

```
api/
```

---

### 5. Is it configuring a library?

Yes →

```
lib/
```

---

### 6. Is it a page?

Yes →

```
pages/
```

---

# The Guiding Principle

A useful rule that keeps projects maintainable is:

> **Keep code as close as possible to where it's used, and only move it to a shared location when at least two features genuinely need it.**

Following this principle keeps the codebase intuitive for contributors and prevents shared directories from becoming cluttered over time.
 