/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 */
/**
 * Query for documents with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const paginate = function (options) {
  let sort = '';
  const DEFAULT_SORT = {
    createdAt: 'desc',
  };
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push(JSON.parse(`${key}: ${order}`));
    });
  } else {
    sort = DEFAULT_SORT;
  }

  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  //   if (options.populate) {
  //     options.populate.split(',').forEach((populateOption) => {
  //       docsPromise = docsPromise.populate(
  //         populateOption
  //           .split('.')
  //           .reverse()
  //           .reduce((a, b) => ({ path: b, populate: a }))
  //       );
  //     });
  //   }

  return {
    skip,
    limit,
    page,
    sort,
  };
};

module.exports = paginate;
