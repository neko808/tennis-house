import Medusa from "@medusajs/js-sdk";

/**
 * Medusa SDK client (server-side) — §2, §6.
 *
 * Phase 1: MEDUSA_BACKEND_URL is unset, so `medusa` is null and every helper
 * in lib/medusa/* answers from the clearly-labeled sample catalog instead.
 * Phase 2: set MEDUSA_BACKEND_URL (+ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) and
 * swap the helper internals to SDK calls — the function signatures and the
 * shapes in types/medusa.ts stay identical, so no page or component changes.
 *
 * Admin keys and DATABASE_URL never appear here or anywhere client-reachable.
 */
const backendUrl = process.env.MEDUSA_BACKEND_URL;

export const medusa = backendUrl
  ? new Medusa({
      baseUrl: backendUrl,
      publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    })
  : null;

export const isLiveBackend = Boolean(backendUrl);
