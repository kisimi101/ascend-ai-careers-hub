export type Density = "compact" | "standard" | "spacious";

/**
 * Density wrapper styles applied via CSS custom properties + transform.
 * Compact = ~92% scale (fits more on a page).
 * Standard = unchanged.
 * Spacious = ~108% scale + extra block spacing.
 */
export const densityWrapperStyle = (density: Density = "standard"): React.CSSProperties => {
  switch (density) {
    case "compact":
      return {
        fontSize: "92%",
        letterSpacing: "-0.005em",
      };
    case "spacious":
      return {
        fontSize: "108%",
        letterSpacing: "0.005em",
      };
    default:
      return {};
  }
};

export const densityClassName = (density: Density = "standard"): string => {
  switch (density) {
    case "compact":
      return "[&_p]:!leading-snug [&_li]:!leading-snug [&>div]:!p-6";
    case "spacious":
      return "[&_p]:!leading-loose [&_li]:!leading-loose [&>div]:!p-10";
    default:
      return "";
  }
};