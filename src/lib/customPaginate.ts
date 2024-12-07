import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { applyPagination, applySearchCriterias, applySelect, applySorting, PaginateOptions, QueryBuilder } from "./commonGrid";
import { and, or, sql } from "drizzle-orm";

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

    // Apply pagination, search, and sorting dynamically
    const { pageSize, offset } = applyPagination(page, limit);
    const whereConditions = applySearchCriterias(table, searchCriterias);
    const orderByConditions = applySorting(table, sortCriterias);
    const selectColumns = applySelect(select || [], table);

    // Build the base query
    let query: any = db.select().from(table);

    // Apply column selection if specified
    if (selectColumns) {
        query = query.select(selectColumns);
    }

    // Apply filters dynamically
    if (whereConditions.length > 0) {
        query = query.where(searchCriterias.some(sc => sc.isOrCondition) ? or(...whereConditions) : and(...whereConditions));
    }

    // Apply sorting dynamically
    if (orderByConditions.length > 0) {
        query = query.orderBy(...orderByConditions);
    }

    // Create count query
    const countQuery = db.select({ count: sql`count(*)` }).from(table);

    if (whereConditions.length > 0) {
        countQuery.where(
            searchCriterias.some(sc => sc.isOrCondition)
                ? or(...whereConditions)
                : and(...whereConditions)
        );
    }

    // Apply pagination
    query = query.limit(pageSize).offset(offset);

    // Return the query builder object
    return {
        query,
        countQuery,
        execute: async () => {
            let finalQuery: any;
            if (relations) {
                finalQuery = db.query[tableName].findMany({
                    limit: pageSize,
                    offset: offset,
                    with: relations,
                    where: searchCriterias.some(sc => sc.isOrCondition)
                        ? or(...whereConditions)
                        : and(...whereConditions),
                    orderBy: orderByConditions.length > 0 ? orderByConditions : undefined,
                });

            } else {
                finalQuery = query;
            }

            const [docs, countResult] = await Promise.all([finalQuery, countQuery]);
            const total = Number(countResult[0]?.count || 0);
            const totalPages = Math.ceil(total / pageSize);

            return {
                docs,
                pagination: {
                    total,
                    page,
                    limit: pageSize,
                    totalPages,
                },
            };
        }
    };
};

export { customPaginate };
