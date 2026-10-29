const PAGE_SIZE = 6;

export function Pager({
  page,
  totalPages,
  total,
  onPage
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1 && total <= PAGE_SIZE) return null;
  return (
    <div className="pager">
      <button className="secondary-button compact" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages} - {total} records
      </span>
      <button className="secondary-button compact" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
}
