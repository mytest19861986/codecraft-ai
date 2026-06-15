# Workflow

This is the lightweight working agreement for CodeCraft AI while the MVP is small.

## Roles

- ChatGPT/GPT: commander and final decision maker.
- Codex: code changes only.
- Claude/Kiro: review and audit.
- Gemini: UI screenshot review.

## Task Flow

1. Define a small task with a clear expected diff.
2. Create a task branch for v0.3+ work or anything sensitive, especially Auth, schema, migration, or security changes.
3. Let Codex make the patch.
4. Run local validation.
5. Review the limited diff.
6. Merge, push, and deploy.
7. Smoke test production.

Direct commits to `master` are acceptable only for tiny documentation or hotfix tasks while the MVP is small. Use task branches for Auth, schema, migration, security, and larger feature work.

## Validation Checklist

Run from `apps/web` unless the root script is intentional:

```bash
npm run lint
npm run typecheck
npm run build
npx prisma validate
```

## Safety Rules

- Never run `npm audit fix --force` without a commander decision. It can change major versions and break the MVP in ways that are larger than the original advisory.
- Keep `master` deployable.
- Do not commit secrets, `.env` files, large media, or temporary diff files.
- Check `git status --short --untracked-files=all` before commits.
