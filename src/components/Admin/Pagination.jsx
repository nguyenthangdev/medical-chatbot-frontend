import { PiGreaterThan, PiLessThan } from 'react-icons/pi';

const Pagination = ({ pagination, handlePagination, handlePaginationPrevious, handlePaginationNext, items }) => {
  const getPages = () => {
    if (pagination) {
      const pages = [];

      pages.push(1);

      if (pagination.currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, pagination.currentPage - 1);
      const end = Math.min(pagination.totalPage - 1, pagination.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (pagination.currentPage < pagination.totalPage - 2) {
        pages.push('...');
      }

      if (pagination.totalPage > 1) {
        pages.push(pagination.totalPage);
      }
      return pages;
    }
    return [];
  };

  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.limitItems : 0;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.limitItems, pagination.totalItems) : 0;

  return (
    <>
      {items && items.length > 0 && pagination && (
        <nav className='mt-4 flex flex-col gap-3 border-t border-slate-100 px-1 pt-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className="text-sm font-medium text-slate-500">
            Hiển thị {startIndex + 1} - {endIndex} trong tổng số {pagination.totalItems} bản ghi
          </div>
          <ul className='flex items-center justify-start gap-2 sm:justify-center'>
            <li>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePaginationPrevious(pagination.currentPage)}
              >
                <PiLessThan />
              </button>
            </li>
            {getPages().map((page, index) =>
              typeof page === 'number' ? (
                <li key={index}>
                    <button
                    onClick={() => handlePagination(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition ${
                        page === pagination.currentPage ? 'border-sky-600 bg-sky-600 text-white shadow-sm' : 'border-slate-300 text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'}`
                    }
                    >
                    {page}
                    </button>
                </li>
              ) : (
                <li key={index}>
                    <span className="px-2 text-gray-500">{page}</span>
                </li>
              )
            )}
            <li>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={pagination.currentPage === pagination.totalPage}
                onClick={() => handlePaginationNext(pagination.currentPage)}
              >
                <PiGreaterThan />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Pagination;
