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

class CustomPaginate<T> {
    private db: any;
    private table: PgTableWithColumns<any>;
    private options: PaginateOptions;

    constructor(db: any, table: PgTableWithColumns<any>, options: PaginateOptions = {}) {
        this.db = db;
        this.table = table;
        this.options = {
            page: 1,
            limit: 10,
            searchCriterias: [],
            sortCriterias: [],
            ...options
        };
    }

    private applySearchCriteria(query: any): any {
        const { searchCriterias } = this.options;
        if (!searchCriterias || searchCriterias.length === 0) return query;

        const conditions: SQLWrapper[] = searchCriterias.map(({ columnName, columnOperator, columnValue, isOrCondition }) => {
            if (!this.table[columnName]) {
                throw new Error(`Invalid column name: ${columnName}`);
            }
            let condition: SQL;
            switch (columnOperator.toLowerCase()) {
                case 'contains':
                    condition = ilike(this.table[columnName], `%${columnValue}%`);
                    break;
                case 'equals':
                    condition = eq(this.table[columnName], columnValue);
                    break;
                case 'startswith':
                    condition = ilike(this.table[columnName], `${columnValue}%`);
                    break;
                case 'endswith':
                    condition = ilike(this.table[columnName], `%${columnValue}`);
                    break;
                case 'gte':
                    condition = gte(this.table[columnName], columnValue);
                    break;
                case 'lte':
                    condition = lte(this.table[columnName], columnValue);
                    break;
                default:
                    throw new Error(`Unsupported operator: ${columnOperator}`);
            }
            return condition;
        });

        if (conditions.length > 1) {
            return query.where(searchCriterias.some(sc => sc.isOrCondition) ? or(...conditions) : and(...conditions));
        } else {
            return query.where(conditions[0]);
        }
    }

    private applySortCriteria(query: any): any {
        const { sortCriterias } = this.options;
        if (!sortCriterias || sortCriterias.length === 0) return query;

        return query.orderBy(
            ...sortCriterias.map(({ columnName, columnOrder }) => {
                if (!this.table[columnName]) {
                    throw new Error(`Invalid column name: ${columnName}`);
                }
                return columnOrder === 'desc' ? desc(this.table[columnName]) : asc(this.table[columnName]);
            })
        );
    }

    private applySelection(query: any): any {
        const { select } = this.options;
        if (!select || select.length === 0) return query;

        return query.select(select.map(col => this.table[col]));
    }

    public getQuery(): any {
        let query = this.db.select().from(this.table);
        query = this.applySelection(query);
        query = this.applySearchCriteria(query);
        query = this.applySortCriteria(query);

        const { page = 1, limit = 10 } = this.options;
        const pageNumber = parseInt(page.toString(), 10);
        const pageSize = parseInt(limit.toString(), 10);
        const offset = (pageNumber - 1) * pageSize;

        return query.limit(pageSize).offset(offset);
    }

    public getCountQuery(): any {
        let query = this.db.select({ count: sql`count(*)` }).from(this.table);
        return this.applySearchCriteria(query);
    }

    public async execute(): Promise<PaginationResult<T>> {
        const { page = 1, limit = 10, with: relations } = this.options;
        const pageNumber = parseInt(page.toString(), 10);
        const pageSize = parseInt(limit.toString(), 10);

        let docs;
        if (relations) {
            const relationalQuery = this.db.query[this.table.name].findMany({
                limit: pageSize,
                offset: (pageNumber - 1) * pageSize,
                with: relations,
            });

            docs = await relationalQuery.execute((qb: any) => {
                qb.where(this.getQuery().getWhereCondition());
                qb.orderBy(this.getQuery().getOrderByCondition());
            });
        } else {
            docs = await this.getQuery();
        }

        const [{ count }] = await this.getCountQuery();
        const total = Number(count);
        const totalPages = Math.ceil(total / pageSize);

        return {
            docs,
            pagination: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages,
            },
        };
    }
}

export { CustomPaginate };

