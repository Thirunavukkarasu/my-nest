import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import express from 'express';
import { db } from '../db';
import { vehicleSchema, vehiclesTable } from '../db/schema';
import { customPaginate } from '../lib/customPaginate';

const router = express.Router();
express.json();

// Helper function to calculate age category from date of birth
function calculateAgeCategory(dateOfBirth: string | null | undefined): 'kid' | 'adult' | 'senior_citizen' | null {
    if (!dateOfBirth) return null;
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 18) return 'kid';
    if (age >= 60) return 'senior_citizen';
    return 'adult';
}

// GET /api/vehicles - List vehicles with pagination
router.post('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, searchCriterias = [], sortCriterias = [] } = req.body;

        const queryBuilder = customPaginate(db, 'vehiclesTable', vehiclesTable, {
            page,
            limit,
            searchCriterias,
            sortCriterias,
            with: {
                flat: true,
                resident: true
            }
        });
        const result = await queryBuilder.execute();

        res.status(200).json(result);
    } catch (error: any) {
        console.error('Error while getting vehicles: ', error);
        res.status(500).json({
            message: "Error while getting vehicles",
            error: error.message
        });
    }
});

// POST /api/vehicles/mutate - Create vehicle
router.post('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const validatedData = vehicleSchema.parse(body);

        const [newVehicle] = await db.insert(vehiclesTable)
            .values(validatedData as InferInsertModel<typeof vehiclesTable>)
            .returning();

        res.status(201).json({
            success: true,
            data: newVehicle
        });
    } catch (error: any) {
        console.error('Error while creating vehicle: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat ID or resident ID",
                error: "The specified flat or resident does not exist"
            });
        }

        res.status(500).json({
            message: "Error while creating vehicle",
            error: error.message
        });
    }
});

// PUT /api/vehicles/mutate - Update vehicle
router.put('/mutate', async (req, res) => {
    try {
        const body = req.body;
        const { vehicleId, ...updateFields } = body;

        if (!vehicleId) {
            return res.status(400).json({
                message: "Validation error",
                error: "vehicleId is required for update operation"
            });
        }

        const [existingVehicle] = await db.select()
            .from(vehiclesTable)
            .where(eq(vehiclesTable.vehicleId, vehicleId))
            .limit(1);

        if (!existingVehicle) {
            return res.status(404).json({
                message: "Not found",
                error: "Vehicle not found"
            });
        }

        const updateData = { ...updateFields, vehicleId, updatedAt: new Date() };
        const validatedData = vehicleSchema.parse(updateData);

        const [updatedVehicle] = await db.update(vehiclesTable)
            .set(validatedData as Partial<InferInsertModel<typeof vehiclesTable>>)
            .where(eq(vehiclesTable.vehicleId, vehicleId))
            .returning();

        res.status(200).json({
            success: true,
            data: updatedVehicle
        });
    } catch (error: any) {
        console.error('Error while updating vehicle: ', error);

        if (error.name === 'ZodError') {
            return res.status(400).json({
                message: "Validation error",
                error: error.errors
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message: "Invalid flat ID or resident ID",
                error: "The specified flat or resident does not exist"
            });
        }

        res.status(500).json({
            message: "Error while updating vehicle",
            error: error.message
        });
    }
});

// DELETE /api/vehicles/mutate/:id - Delete vehicle
router.delete('/mutate/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            return res.status(400).json({
                message: "Validation error",
                error: "Invalid id parameter"
            });
        }

        const [existingVehicle] = await db.select()
            .from(vehiclesTable)
            .where(eq(vehiclesTable.vehicleId, id))
            .limit(1);

        if (!existingVehicle) {
            return res.status(404).json({
                message: "Not found",
                error: "Vehicle not found"
            });
        }

        await db.delete(vehiclesTable)
            .where(eq(vehiclesTable.vehicleId, id));

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    } catch (error: any) {
        console.error('Error while deleting vehicle: ', error);
        res.status(500).json({
            message: "Error while deleting vehicle",
            error: error.message
        });
    }
});

export default router;
