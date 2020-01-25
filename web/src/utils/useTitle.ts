import { useEffect } from "react";
import { APP_TITLE } from "./constants";

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
        title === undefined ? APP_TITLE : `${title} - ${APP_TITLE}`;
    }
  }, [title]);
};

export default useTitle;
