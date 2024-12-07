import { SQL, SQLWrapper, and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';

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
    execute: () => Promise<PaginationResult<T>>;
}

// Helper Methods for Search, Sort, and Pagination
const applySearchCriterias = (table: any, searchCriterias: SearchCriteria[]): SQLWrapper[] => {
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

const applySorting = (table: any, sortCriterias: SortCriteria[]): SQLWrapper[] => {
    return sortCriterias.map(({ columnName, columnOrder }) => {
        if (!table[columnName]) {
            throw new Error(`Invalid column name: ${columnName}`);
        }
        return columnOrder === 'desc' ? desc(table[columnName]) : asc(table[columnName]);
    });
};

const applyPagination = (page: number, limit: number) => {
    const pageSize = parseInt(limit.toString(), 10);
    const pageNumber = parseInt(page.toString(), 10);
    const offset = (pageNumber - 1) * pageSize;

    return { pageSize, offset };
};

const applySelect = (select: string[], table: any) => {
    return select && select.length > 0
        ? select.reduce((acc, col) => ({ ...acc, [col]: table[col] }), {})
        : undefined;
};

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
        select: selectColumns,
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

export { customPaginate, applySearchCriterias, applySorting, applyPagination, applySelect };
