---
name: project-commit-convention
description: Generate commit messages that follow the project's existing commit conventions. Use when creating, suggesting, or reviewing Git commit messages.
---

# Project Commit Convention

## Objective
Follow the existing commit message style used in this project.

## Format
Use the following format:

`type: short description`

## Allowed Types
- `feat`: Add new functionality.
- `fix`: Fix a bug.
- `refactor`: Change code structure without changing intended behavior.
- `test`: Add or update tests.
- `docs`: Update documentation.
- `style`: Change formatting or visual styles without changing application logic.
- `chore`: Perform maintenance tasks or configuration changes.

Use the type that best describes the primary purpose of the changes.

## Language and Writing Style
- Write commit messages in English.
- Use lowercase type prefixes followed by a colon and one space.
- Write a concise description of the changes.
- Prefer imperative wording when natural, such as `add`, `update`, `remove`, and `fix`.
- Do not capitalize the first word of the description unless required by a proper noun.
- Do not add a period at the end.
- Do not add scopes, emojis, issue numbers, or additional prefixes unless the project already requires them.
- Keep the message focused on the main purpose of the commit.

## Before Generating a Commit Message
- Inspect the actual changes using `git diff` and, when relevant, `git status`.
- Consider staged changes separately from unstaged changes.
- Identify the main purpose of the changes before selecting a type.
- Never infer changes that are not supported by the diff.
- If the changes contain unrelated tasks, suggest separating them into multiple commits when appropriate.
- If the changes are unclear, ask for clarification instead of inventing details.

## Examples

- `feat: add appointment cancellation`
- `fix: handle appointment scheduling errors`
- `refactor: simplify appointment creation logic`
- `test: add unit tests for doctor registration`
- `docs: update README project instructions`
- `style: improve responsive layout`
- `chore: update project dependencies`

## Final Validation
Before returning a commit message, verify that:
- The type accurately represents the changes.
- The description matches the actual diff.
- The message is in English.
- The format is `type: description`.
- The message is concise and has no trailing period.

Return only the commit message unless the user explicitly requests an explanation or multiple alternatives.