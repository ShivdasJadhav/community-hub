# Pull Request Instructions

Thank you for contributing to this project! 🎉

To help reviewers understand your changes quickly and maintain a high-quality codebase, please complete every applicable section below before submitting your Pull Request.

> **Pull Requests with incomplete information may be returned for additional details before review.**

---

# Before Opening a Pull Request

Please ensure that:

- [ ] The latest changes from the target branch have been pulled.
- [ ] The project builds successfully.
- [ ] All existing tests pass.
- [ ] New tests have been added where appropriate.
- [ ] Documentation has been updated (if required).
- [ ] The change has been manually verified.
- [ ] The Pull Request addresses only one feature, enhancement, or bug.

---

# Issue Reference

Link the Pull Request to the related issue.

Examples:

```
Closes #42

Fixes #18

Related to #75
```

If there is no existing issue, explain why.

---

# Pull Request Summary

Provide a short summary of your contribution.

Example:

> Added the ability for community administrators to archive announcements without permanently deleting them.

---

# Type of Change

Select all that apply.

- [ ] New Feature
- [ ] Bug Fix
- [ ] Enhancement
- [ ] Performance Improvement
- [ ] Refactoring
- [ ] UI Improvement
- [ ] Documentation
- [ ] Test Improvements
- [ ] Security Fix
- [ ] Dependency Update
- [ ] Build / DevOps

---

# Problem Statement

Describe the problem being solved.

Questions to answer:

- What problem existed?
- Who was affected?
- Why was this change needed?

---

# Solution

Describe your implementation.

Include:

- Design decisions
- Business logic
- Validation changes
- API changes
- UI updates
- Database changes

---

# Functional Changes

List the user-visible changes.

Example:

- Users can now archive notices.
- Archived notices no longer appear on the dashboard.
- Archived notices remain searchable by administrators.

---

# Technical Changes

Describe the technical work completed.

Examples:

- Added new API endpoint
- Updated service layer
- Added repository methods
- Added database migration
- Updated React components
- Added validation
- Improved query performance

---

# Frontend Changes

Complete if frontend code was modified.

## Pages Updated

-

## Components Added

-

## Components Modified

-

## State Management

-

## API Integrations

-

## Form Validation

-

## Responsive Design

-

## Accessibility Improvements

-

## UI Screenshots

Include screenshots or screen recordings whenever possible.

---

# Backend Changes

Complete if backend code was modified.

## Modules Updated

-

## API Endpoints

List all affected endpoints.

Example:

```
POST /communities

GET /communities/{id}

PATCH /communities/{id}
```

---

## Database Changes

- New Tables
- Updated Tables
- New Columns
- Removed Columns
- Index Changes

---

## Business Logic

Describe:

- Validation
- Authorization
- Service logic
- Repository updates

---

## Background Tasks

Describe any new scheduled jobs, queues, or asynchronous processes.

---

## Configuration Changes

Mention any changes to:

- Environment Variables
- Docker
- Application Configuration
- Secrets
- External Services

---

# API Contract Changes

If API responses changed, describe them.

Include:

- Request body changes
- Response body changes
- Status code changes
- Validation changes

---

# Database Migration

- [ ] Migration Required
- [ ] No Migration Required

If required:

Explain the migration.

---

# Breaking Changes

Does this Pull Request introduce breaking changes?

- [ ] Yes
- [ ] No

If yes:

Describe:

- What breaks
- Why
- Migration steps

---

# Testing

Describe how this change was tested.

Examples:

- Manual Testing
- Unit Tests
- Integration Tests
- End-to-End Tests

Include steps if reviewers need to verify manually.

---

# Performance Impact

Does this change affect performance?

- Database Queries
- API Response Time
- Frontend Rendering
- Memory Usage

If applicable, explain.

---

# Security Impact

Does this change affect authentication, authorization, permissions, or sensitive data?

If yes, describe the impact.

---

# Documentation Updates

Check all that apply.

- [ ] README Updated
- [ ] API Documentation Updated
- [ ] Feature Documentation Updated
- [ ] Database Documentation Updated
- [ ] No Documentation Required

---

# Checklist

## General

- [ ] Code follows project conventions.
- [ ] No unnecessary files included.
- [ ] No commented-out code.
- [ ] No debugging statements.
- [ ] Error handling implemented.
- [ ] Logging added where appropriate.

---

## Frontend Checklist

- [ ] UI matches project design.
- [ ] Responsive layout verified.
- [ ] Loading states implemented.
- [ ] Error states implemented.
- [ ] Empty states implemented.
- [ ] Form validation completed.
- [ ] API integration verified.

---

## Backend Checklist

- [ ] Business logic implemented.
- [ ] Validation completed.
- [ ] Authorization checked.
- [ ] API documented.
- [ ] Database migration tested.
- [ ] Repository and service layers updated.
- [ ] Error responses handled.

---

# Reviewer Notes

Mention anything reviewers should pay special attention to.

Examples:

- Complex query logic
- Permission checks
- Database migration
- UI responsiveness
- Performance optimization

---

# Additional Notes

Provide any additional context that may help reviewers understand this Pull Request.

Examples:

- Known limitations
- Future improvements
- Related Pull Requests
- Follow-up tasks

---

Thank you for contributing! ❤️

Providing complete Pull Request information helps reviewers understand your work faster, reduces review cycles, and keeps the project maintainable for everyone.
