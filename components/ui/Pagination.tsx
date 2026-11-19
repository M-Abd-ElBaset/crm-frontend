interface Props {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, lastPage, onChange }: Props) {
  if (lastPage <= 1) return null;

  const btn = "rounded border border-gray-700 px-3 py-1 text-sm text-gray-200 hover:bg-gray-800 disabled:opacity-40";

  return (
    <div className="flex items-center justify-end gap-3 p-3 text-sm text-gray-400">
      <button className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {lastPage}
      </span>
      <button className={btn} disabled={page >= lastPage} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}