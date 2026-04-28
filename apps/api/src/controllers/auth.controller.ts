import { Request, Response } from "express";
import { prisma } from "@repo/prisma";
import { registerSchema } from "../schema/auth.types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

export const register = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.message,
            });
        }

        const { name, email, password } = parsed.data;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "credentials are required",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if(existingUser) {
            return res.status(409).json({error: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email, 
                password:hashedPassword
            },
        });

        const token = jwt.sign({ id: newUser.id, email: newUser.email}, process.env.JWT_SECRET!, { expiresIn: "1h"});

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 60 * 60 * 1000
        })

        res.json({
            message: "user created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }
        })

        
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const login = async (req: Request, res: Response) => {

};

export const logout = async (req: Request, res: Response) => {

};