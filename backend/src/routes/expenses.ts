import express from 'express';
import { db } from '../db';
import { expensesTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

// GET /api/expenses - List expenses with pagination
router.post('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            searchCriterias = [],
            sortCriterias = [],
        } = req.body;

        const queryBuilder = customPaginate(
            db,
            'expensesTable',
            expensesTable,
            {
                page,
                limit,
                searchCriterias,
                sortCriterias,
            }
        );
        const result = await queryBuilder.execute();

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error while getting data: ', error);
        res.status(500).json({
            message: 'Error while getting data',
            error: error.message,
        });
    }
});

export default router;

