function PaginationControls({ page, totalPages, onPageChange, disabled = false }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          className="btn-secondary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          className="btn-primary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginationControls;
