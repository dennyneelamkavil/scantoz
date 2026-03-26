import { useEffect } from "react";

type ScrollToTopOptions = {
  behavior?: ScrollBehavior;
};

export function useScrollToTop(
  trigger: unknown,
  options: ScrollToTopOptions = { behavior: "smooth" }
) {
  useEffect(() => {
    if (!trigger) return;

    window.scrollTo({
      top: 0,
      behavior: options.behavior ?? "smooth",
    });
  }, [trigger, options.behavior]);
}
