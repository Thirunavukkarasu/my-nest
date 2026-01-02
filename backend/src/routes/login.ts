import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db';
import { usersTable } from '../db/schema';
import env from '../lib/env';

const router = express.Router();
express.json();

// Define a schema for input validation
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// POST /api/login - Login user
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const { email, password } = loginSchema.parse(body);

        // Find user by email
        const [user] = await db.select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Compare password
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            env.JWT_SECRET,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        // Return user data (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Error while logging in user', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }

        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }

        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});

export default router;

