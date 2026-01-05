import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { usersTable } from '../db/schema';

const router = express.Router();
express.json();

// Define a schema for input validation
const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
});

// POST /api/register - Register a new user
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const { name, email, password } = userSchema.parse(body);

        // Normalize email for consistent checking
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user with this email already exists
        const [existingUser] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.email, normalizedEmail))
            .limit(1);

        if (existingUser) {
            return res.status(409).json({
                error: 'User with this email already exists'
            });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert the new user into the database (use normalized email)
        const [newUser] = await db.insert(usersTable)
            .values({
                name,
                email: normalizedEmail,
                password: hashedPassword
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email
            });

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error('Error while registering user', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }

        // Handle database unique constraint violation (fallback)
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === '23505') { // PostgreSQL unique violation
                return res.status(409).json({
                    error: 'User with this email already exists'
                });
            }
        }

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

export default router;

