import { sql } from "drizzle-orm";
import { applyPagination, applySearchCriterias, applySelect, applySorting, PaginateOptions, QueryBuilder } from "./commonGrid";

// General Query Execution Function
const executeQuery = async <T>(
    db: any,
    tableName: string,
    queryOptions: any,
    relations?: Record<string, boolean | Record<string, any>>
) => {
    const { whereConditions, orderByConditions, selectColumns, limit, offset } = queryOptions;

    const query = db.query[tableName].findMany({
        where: whereConditions.length > 0 ? whereConditions : undefined,
        orderBy: orderByConditions.length > 0 ? orderByConditions : undefined,
        limit,
        offset,
        select: selectColumns || [],
        with: relations
    });

    const countQuery = db.query[tableName].findMany({
        where: whereConditions.length > 0 ? whereConditions : undefined,
        select: { count: sql`count(*)` }
    });

    const docs = await query;
    const total = (await countQuery).count;
    const totalPages = Math.ceil(total / limit);

    return {
        docs,
        pagination: {
            total,
            page: Math.floor(offset / limit) + 1,
            limit,
            totalPages
        }
    };
};

// Main Paginate Function
const customPaginate = <T>(
    db: any,
    tableName: string,
    table: any,
    options: PaginateOptions = {}
): QueryBuilder<T> => {
    const {
        page = 1,
        limit = 10,
        searchCriterias = [],
        sortCriterias = [],
        select,
        with: relations
    } = options;

    // Apply pagination, search, and sorting
    const { pageSize, offset } = applyPagination(page, limit);
    const whereConditions = applySearchCriterias(table, searchCriterias);
    const orderByConditions = applySorting(table, sortCriterias);
    const selectColumns = applySelect(select || [], table);

    // Prepare query options for reuse
    const queryOptions = {
        whereConditions,
        orderByConditions,
        selectColumns,
        limit: pageSize,
        offset
    };

    return {
        query: executeQuery(db, tableName, queryOptions, relations),
        countQuery: null,
        execute: async () => {
            return await executeQuery(db, tableName, queryOptions, relations);
        }
    };
};

export { customPaginate };
