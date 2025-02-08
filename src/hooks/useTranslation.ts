import { useParams } from "next/navigation";
import en from "../../locales/en/common.json";
import tr from "../../locales/tr/common.json";

/**
 * Map of translation JSON files keyed by locale.
 */
const translations = { en, tr };

/**
 * Helper function to lookup a translation key using dot-notation,
 * for example: "login.signInTitle".
 */
function dotLookup(obj: any, key: string): string | undefined {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Custom hook for translation using Next.js i18n routing.
 *
 * This hook leverages Next.js's built-in locale detection (via useLocale)
 * so it correctly returns the translation based on the current locale.
 */
export function useTranslation() {
  const params = useParams();
  const detectedLocale =
    typeof params?.locale === "string" ? params.locale : null;
  const activeLocale = ["en", "tr"].includes(detectedLocale as string)
    ? detectedLocale
    : "tr";

  const t = (key: string): string => {
    const translation = dotLookup(
      translations[activeLocale as keyof typeof translations],
      key
    );
    return translation || key;
  };

  return { t, locale: activeLocale };
}
