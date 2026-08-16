import "i18next"

import en from "./locales/en"

/**
 * Makes `t("auth.login.title")` autocomplete and fail the build on typos.
 * `en.ts` is the source of truth for the key shape; `fr.ts` must mirror it.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation"
    resources: { translation: typeof en }
    returnNull: false
  }
}
