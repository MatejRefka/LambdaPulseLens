export const AppVersionLabel = () => (
  <footer aria-label="Application version" className="h-14 shrink-0 flex items-center justify-center px-4">
    <p className="text-center text-xs text-text-30">{import.meta.env.APP_VERSION_LABEL as string}</p>
  </footer>
);
