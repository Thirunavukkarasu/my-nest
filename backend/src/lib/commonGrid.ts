import { SQL, SQLWrapper, asc, desc, eq, gte, ilike, lte } from 'drizzle-orm';

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
    data: T[];
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

// Helper function to convert snake_case to camelCase
const snakeToCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper function to find column in table (handles both camelCase and snake_case)
const findColumn = (table: any, columnName: string): any => {
    // First try the column name as-is (camelCase)
    if (table[columnName]) {
        return table[columnName];
    }

    // If not found, try converting snake_case to camelCase
    const camelCaseName = snakeToCamel(columnName);
    if (table[camelCaseName]) {
        return table[camelCaseName];
    }

    // If still not found, try the original snake_case (in case Drizzle uses it directly)
    // This shouldn't happen with Drizzle, but just in case
    throw new Error(`Invalid column name: ${columnName} (tried: ${columnName}, ${camelCaseName})`);
};

// Helper Methods for Search, Sort, and Pagination
const applySearchCriterias = (table: any, searchCriterias: SearchCriteria[]): SQLWrapper[] => {
    return searchCriterias?.map(({ columnName, columnOperator, columnValue }) => {
        const columnRef = findColumn(table, columnName);
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
        const columnRef = findColumn(table, columnName);
        return columnOrder === 'desc' ? desc(columnRef) : asc(columnRef);
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
        ? select.reduce((acc, col) => {
            const columnRef = findColumn(table, col);
            return { ...acc, [col]: columnRef };
        }, {})
        : undefined;
};

export {
    applyPagination, applySearchCriterias, applySelect, applySorting
};

