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
        <nav className='flex items-center justify-between p-[10px] mt-4 border-t'>
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1} - {endIndex} trong tổng số {pagination.totalItems} bản ghi
          </div>
          <ul className='flex items-center justify-center gap-[10px]'>
            <li>
              <button
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition"
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
                    className={`px-3 py-1 border rounded transition ${
                        page === pagination.currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`
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
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 transition"
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