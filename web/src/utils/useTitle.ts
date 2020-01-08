import { useEffect } from "react";

const defaultTitle = "Shinywaffle";

/**
 * Set document title.
 * Use `null` to keep current title while loading.
 * Use `undefined` to reset to the default title.
 *
 * @param title new page title
 */
const useTitle = (title?: string | null) => {
  useEffect(() => {
    if (title !== null) {
      document.title =
        title === undefined ? defaultTitle : `${title} - ${defaultTitle}`;
    }
  }, [title]);
};

export default useTitle;
