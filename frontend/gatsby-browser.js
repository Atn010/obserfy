/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import "./src/global.css"

import ReactDOM from "react-dom"

if (!Intl.PluralRules) {
  import("./src/polyfill/pluralRules")
}

if (!Intl.RelativeTimeFormat) {
  import("./src/polyfill/relativeTimeFormat")
}

// TODO: Enabling react's concurrent mode is experimental
//  precede with caution
export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.createRoot(container, {
      hydrate: true,
      hydrationOptions: { onHydrated: callback },
    }).render(element)
  }
}
//
