import { SQL, SQLWrapper, and, asc, desc, eq, gte, ilike, lte, or, sql } from 'drizzle-orm';

export interface SearchCriteria {
    columnName: string;
    columnOperator: string;
    columnValue: string | number;
    isOrCondition?: boolean;
}

export interface SortCriteria {
    columnName: string;
    columnOrder?: 'asc' | 'desc';
}

export interface PaginateOptions {
    page?: number;
    limit?: number;
    searchCriterias?: SearchCriteria[];
    sortCriterias?: SortCriteria[];
    select?: string[];
    with?: Record<string, boolean | Record<string, any>>;
}

export interface PaginationResult<T> {
    docs: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface QueryBuilder<T> {
    query: any;
    countQuery: any;
    execute: () => Promise<PaginationResult<T>>;
}

// Helper Methods for Search, Sort, and Pagination
const applySearchCriterias = (table: any, searchCriterias: SearchCriteria[]): SQLWrapper[] => {
    return searchCriterias?.map(({ columnName, columnOperator, columnValue }) => {
        if (!table[columnName]) {
            throw new Error(`Invalid column name: ${columnName}`);
        }
        const columnRef = table[columnName];
        let condition: SQL;
        switch (columnOperator.toLowerCase()) {
            case 'contains':
                condition = ilike(columnRef, `%${columnValue}%`);
                break;
            case 'equals':
                condition = eq(columnRef, columnValue);
                break;
            case 'startswith':
                condition = ilike(columnRef, `${columnValue}%`);
                break;
            case 'endswith':
                condition = ilike(columnRef, `%${columnValue}`);
                break;
            case 'gte':
                condition = gte(columnRef, columnValue);
                break;
            case 'lte':
                condition = lte(columnRef, columnValue);
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

export {
    applySearchCriterias,
    applySorting,
    applyPagination,
    applySelect
}