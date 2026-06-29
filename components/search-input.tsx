interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Controlled search field for filtering posts by user ID.
 *
 * Non-digit characters are stripped on input so the value stays a valid numeric
 * `userId`. The `<label>` is associated via `htmlFor`/`id` for accessibility.
 */
export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="userId-filter"
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        Filter by user ID
      </label>
      <input
        id="userId-filter"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        placeholder="e.g. 1 — leave empty to show all"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-zinc-700"
      />
    </div>
  );
}
