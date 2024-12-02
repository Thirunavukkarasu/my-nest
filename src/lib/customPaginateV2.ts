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

interface JoinOptions {
    table: any;
    on: SQL;
    type?: 'inner' | 'left' | 'right' | 'full';
    select?: string[];
}

interface PaginateOptions {
    page?: number;
    limit?: number;
    searchCriterias?: SearchCriteria[];
    sortCriterias?: SortCriteria[];
    select?: string[];
    joins?: JoinOptions[];
    populate?: '*' | string[];
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

const customPaginateV2 = async <T>(
    db: any,
    table: any,
    options: PaginateOptions = {}
): Promise<PaginationResult<T>> => {
    const {
        page = 1,
        limit = 10,
        searchCriterias = [],
        sortCriterias = [],
        select,
        joins = [],
        populate,
    } = options;

    // Parse pagination params
    const pageNumber = parseInt(page.toString(), 10);
    const pageSize = parseInt(limit.toString(), 10);
    const offset = (pageNumber - 1) * pageSize;

    // Build the base query
    let query: any = db.select();

    const autoJoins: JoinOptions[] = [];
    if (populate === '*' || (Array.isArray(populate) && populate.length > 0)) {
        const relations = table.relations;
        for (const [relationName, relation] of Object.entries(relations)) {
            if (populate === '*' || populate.includes(relationName)) {
                autoJoins.push({
                    table: (relation as any).table,
                    on: eq(table[(relation as any).fields[0]], (relation as any).table[(relation as any).references[0]]),
                    type: 'left',
                    select: Object.keys((relation as any).table.columns),
                });
            }
        }
    }

    const allJoins = [...joins, ...autoJoins];

    allJoins.forEach(join => {
        const joinMethod = join.type ? `${join.type}Join` : 'innerJoin';
        query = query[joinMethod](join.table, join.on);
    });

    query = query.from(table);

    // Apply column selection if specified
    if (select && select.length > 0) {
        const selectColumns = select.map(col => table[col]);
        allJoins.forEach(join => {
            if (join.select) {
                selectColumns.push(...join.select.map(col => join.table[col]));
            }
        });
        query = query.select(selectColumns);
    } else {
        const selectColumns = Object.keys(table.columns).map(col => table[col]);
        allJoins.forEach(join => {
            if (join.select) {
                selectColumns.push(...join.select.map(col => join.table[col]));
            }
        });
        query = query.select(selectColumns);
    }

    // Apply filters dynamically
    if (searchCriterias.length > 0) {
        const conditions: SQLWrapper[] = searchCriterias.map(({ columnName, columnOperator, columnValue, isOrCondition }) => {
            // Ensure the columnName exists on the table dynamically
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

        if (conditions.length > 1) {
            query = query.where(searchCriterias.some(sc => sc.isOrCondition) ? or(...conditions) : and(...conditions));
        } else {
            query = query.where(conditions[0]);
        }
    }

    // Apply sorting dynamically
    if (sortCriterias.length > 0) {
        query = query.orderBy(
            ...sortCriterias.map(({ columnName, columnOrder }) => {
                // Ensure the columnName exists on the table dynamically
                if (!table[columnName]) {
                    throw new Error(`Invalid column name: ${columnName}`);
                }

                // Return the correct sort direction
                return columnOrder === 'desc'
                    ? desc(table[columnName])
                    : asc(table[columnName]);
            })
        );
    }

    // Clone query for total count before applying pagination
    const countQuery = db.select({ count: sql`count(*)` }).from(table);

    allJoins.forEach(join => {
        const joinMethod = join.type ? `${join.type}Join` : 'innerJoin';
        countQuery[joinMethod](join.table, join.on);
    });

    // Apply pagination
    query = query.limit(pageSize).offset(offset);

    // Execute both queries
    const [docs, [countResult]] = await Promise.all([
        query,
        countQuery
    ]);

    // Calculate metadata
    const total = Number(countResult.count);
    const totalPages = Math.ceil(total / pageSize);

    // Return data and pagination metadata
    return {
        docs,
        pagination: {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages,
        },
    };
};

export { customPaginateV2 };