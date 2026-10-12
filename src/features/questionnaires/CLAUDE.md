# Questionnaires (M21 · SD04)

> Spec: `docs/revamp/modules/M21-questionnaires.md` · Status: Draft · Wave: 2 · Backend: `CSR_BE/src/modules/questionnaires`

## Purpose

Buyers create and send supplier questionnaires (SAQ) and review scored responses; linked suppliers answer requests in-app and reuse earlier answers; off-platform suppliers answer through a token link in the public minimal shell. Everything here is planned; nothing is built yet.

## Owns

- Buyer routes (app shell): `/questionnaires`, `/questionnaires/new`, `/questionnaires/:id` (tabs `overview` · `recipients` · `settings`, URL-synced `?tab=`), `/questionnaires/responses/:rid`, child route `/suppliers/:sid/questionnaires`.
- Supplier routes (app shell): `/questionnaire-requests`, `/questionnaire-requests/:id`, `/my-questionnaires/:responseId`.
- Public route (public entry `src/public/`, planned): `/q/:token` on `survey.resilisense.org`.
- Nav (`src/app/shell/nav.ts`, Due diligence group, after Suppliers): "Questionnaires" (`permission: 'questionnaire:read'`, `module: 'due_diligence'`, locked-module panel when not entitled); "Questionnaire requests" (`permission: 'questionnaire:answer'`, no module).
- Namespaces `questionnaires` (app) and `public-questionnaire` (public entry). Query keys: generated orval keys only.

## Public surface (`index.ts`)

| Export (planned)                                      | Used by                                                                                                                                                                                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `questionnairesRoutes`, `supplierQuestionnaireRoutes` | `src/app/router.tsx`                                                                                                                                                                                                                                    |
| `publicQuestionnaireRoutes`                           | public entry router                                                                                                                                                                                                                                     |
| `QuestionnaireRenderer`                               | renders a `FormDefinition` (answer + read-only modes); later M08 surveys, M18                                                                                                                                                                           |
| `supplierQuestionnairesTabRoute`                      | `router.tsx` → M19 `supplierDetailRoute(extraTabs)`: tab "Questionnaires" at `/suppliers/:sid/questionnaires` (`handle.tab = { labelKey, order, permission: 'questionnaire:read', module: 'due_diligence' }`; latest accepted scores, open assignments) |

## Depends on

Generated hooks for `/v1/questionnaire-*`, `/v1/my-questionnaire-responses*`, `/v1/public/questionnaires/*`, `/v1/suppliers/:sid/questionnaire-summary`, plus `/v1/suppliers` (supplier picker data) and `/v1/files/uploads` (evidence). `src/components/ui` (`DataTable`, `Stepper`, `StatTile`, `FileDropzone`, `RankOrder`, `LikertScale`, `YesNoNA`, `EmptyState`, `ErrorState`, `Skeleton`), `src/components/charts` (`ResiliChart`, `BarChart`), `src/lib/format.ts`. Linking to supplier pages by path only.

## Events

No domain events in the browser. After mutations invalidate the generated keys: campaign create/edit/send/remind/close → campaign list, detail, stats and recipients; review/accept/return → the response, the campaign stats and `suppliers/:sid/questionnaire-summary`; supplier answer/submit/reuse/decline → `my-questionnaire-responses` and `questionnaire-requests`. The backend emits `questionnaire.sent|submitted|reviewed|overdue|shared` (M21 §10) and turns monitoring's `reassessment.due` into draft campaigns (source "Monitoring" badge in the list).

## Components & behaviour

Pages (each: skeleton on load, empty state that explains + CTA, `ErrorState` with retry):

- `campaigns-page` — list pattern (02 §5): title, template, sent, completion (inline neutral meter + number), due date, status pill; filters status/template/year in the URL. Empty: "Send your first supplier questionnaire" → `/questionnaires/new`.
- `new-campaign-page` — `Stepper` wizard (Template → Suppliers → Message → Schedule → Review); each step validates with Zod (`schemas.ts`); draft saved server-side; supplier picker shows why a supplier is not eligible; test email; send disabled while pending, Idempotency-Key per attempt.
- `campaign-page` — 4 `StatTile`s (sent, in progress, submitted, accepted) with `--motion-count`; `BarChart` "Completion by status" (fixed status order) and "Score distribution" (buckets from the API), both in `ResiliChart` cards with takeaway + "View as table"; recipients `DataTable` (status chip icon + label, score, critical flags count, reminders, row actions remind/extend/cancel with `ConfirmDialog` naming the supplier).
- `response-review-page` — assessment workspace pattern (02 §5): `SectionNavigator` (section score + progress), `AnswerCard` (answer, evidence list with preview, `earned / max` points, critical flag badge), `ReviewControls` (Accept / Clarify, override points + reason, errors via `aria-describedby`), context panel Comments · History; sticky bar Accept / Return. Shared response copies show "Shared by the supplier on …"; hidden answers (share revoked) show an explanation, not an empty card.
- `requests-page`, `request-page` — supplier inbox; Start, Reuse (consent `Dialog` naming the customer and what becomes visible) or Decline (reason required).
- `answer-page` (in-app) and `public-answer-page` (`/q/:token`) — both mount `QuestionnaireRenderer`: one section per screen on mobile, navigator on desktop, autosave debounced 800 ms with "Saved · 2 s ago" (`aria-live="polite"`), `J/K` next/prev, N/A where allowed, evidence `FileDropzone`, review page listing missing required answers as links, declaration + signatory, thank-you page. Invalid token → `invalid-link-page` (reveals nothing, US-21-3).
- `QuestionnaireRenderer` — maps each question type to a `ui/` input; evaluates `showIf` only to hide/show (the server re-checks); never computes points. Every input labelled; errors linked; 24 px targets; works at 360 px, RTL, 200 % zoom.

Motion (Calm Ledger 02 §9.2): one entrance per view — `--motion-enter` for tiles and the first 12 rows, `--motion-grow` for bars, `--motion-count` for tile numbers; refetch and autosave update in place; `prefers-reduced-motion` renders final values; public pages use only `--motion-hover`.

## Invariants

- No score, flag, eligibility or deadline is computed here; the API returns them.
- Token kept only in the URL path and memory; never written to storage or logs; public entry ships no app-shell code.
- Tooltips and answer text rendered as text, never HTML.

## Tests

- MSW: `src/features/questionnaires/mocks.ts` (planned; contract-checked against `api/openapi.json`, errors via `problem()`).
- Page tests `__tests__/campaigns.test.tsx` (US-21-1, -9), `answer-public.test.tsx` (US-21-2, -3), `review.test.tsx` (US-21-5, -6), `requests-reuse.test.tsx` (US-21-7, -8); component tests for `QuestionnaireRenderer` (each question type, keyboard, screen-reader names).
- E2e: `e2e/questionnaires.spec.ts` — send questionnaire, answer by link, review + accept; axe on every page, 360 px and RTL for the public flow.
- Stories for any new `ui/` input added for a question type (light, dark, RTL).

## Not here

Supplier list and detail (`supplier-register`), sharing consent per customer/year (`supplier-portal`), risk display (`risk`), corrective actions (`corrective-actions`), template authoring of global templates (`reference-data` admin), materiality surveys (M08).
