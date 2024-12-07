import { SQL, SQLWrapper, and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

interface SearchCriteria {
    columnName: string;
    columnOperator: string;
    columnValue: string | number;
    isOrCondition?: boolean;
}

interface SortCriteria {
    columnName: string;
    columnOrder?: 'asc' | 'desc';
}

interface PaginateOptions {
    page?: number;
    limit?: number;
    searchCriterias?: SearchCriteria[];
    sortCriterias?: SortCriteria[];
    select?: string[];
    with?: Record<string, boolean | Record<string, any>>;
}

interface PaginationResult<T> {
    docs: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface QueryBuilder<T> {
    query: any;
    countQuery: any;
    execute: (table: any) => Promise<PaginationResult<T>>;
}


const applySearchCriterias = (table: PgTableWithColumns<any>, searchCriterias: SearchCriteria[]): SQLWrapper[] => {
    return searchCriterias.map(({ columnName, columnOperator, columnValue }) => {
        if (!table[columnName]) {
            throw new Error(`Invalid column name: ${columnName}`);
        }

        let condition: SQL;
        switch (columnOperator.toLowerCase()) {
            case 'contains':
                condition = ilike(table[columnName], `%${columnValue}%`);
                break;
            case 'equals':
                condition = eq(table[columnName], columnValue);
                break;
            case 'startswith':
                condition = ilike(table[columnName], `${columnValue}%`);
                break;
            case 'endswith':
                condition = ilike(table[columnName], `%${columnValue}`);
                break;
            case 'gte':
                condition = gte(table[columnName], columnValue);
                break;
            case 'lte':
                condition = lte(table[columnName], columnValue);
                break;
            default:
                throw new Error(`Unsupported operator: ${columnOperator}`);
        }
        return condition;
    });
};

const applySorting = (table: PgTableWithColumns<any>, sortCriterias: SortCriteria[]): SQLWrapper[] => {
    return sortCriterias.map(({ columnName, columnOrder }) => {
        if (!table[columnName]) {
            throw new Error(`Invalid column name: ${columnName}`);
        }

        return columnOrder === 'desc'
            ? desc(table[columnName])
            : asc(table[columnName]);
    });
};

// Helper Functions
const applyPagination = (page: number, limit: number) => {
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);
    const offset = (pageNumber - 1) * pageSize;

    return { pageSize, offset };
};

const applySelect = (select: string[], table: PgTableWithColumns<any>) => {
    return select && select.length > 0
        ? select.map(col => table[col])
        : undefined;
};

// Main Paginate Function
const customPaginate = <T>(
    db: any,
    table: PgTableWithColumns<any>,
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

    // Apply pagination
    query = query.limit(pageSize).offset(offset);

    // Return the query builder object
    return {
        query,
        countQuery,
        execute: async (table) => {
            let docs;
            if (relations) {
                const relationalQuery = db.query[table].findMany({
                    limit: pageSize,
                    offset: offset,
                    with: relations,
                });

                docs = await relationalQuery.execute((qb: any) => {
                    qb.where(query.getWhereCondition());
                    qb.orderBy(query.getOrderByCondition());
                });
            } else {
                docs = await query;
            }

            const total = Number(countQuery.count);
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

export { customPaginate, applyPagination, applySearchCriterias, applySorting, applySelect };
