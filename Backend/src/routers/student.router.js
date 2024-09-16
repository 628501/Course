import { Router } from "express";
import handler from "express-async-handler";
import { connection } from "../server.js";
import bcrypt from "bcryptjs";
import { generateTokenResponse } from "../TOKEN/Token.js";

const router = Router();

router.post("/register", handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        let user = await findUserByEmail(email);

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(name, email, hashedPassword, address);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Server error" });
    }
}));

router.post("/login", handler(async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await findUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const tokenResponse = generateTokenResponse(user);

        if (!tokenResponse || !tokenResponse.token) {
            throw new Error("Token generation failed");
        }

        res.cookie("token", tokenResponse.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            id: user.id,
            name: user.name,
            address: user.address,
            email: user.email // Changed to match property name
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Server error" });
    }
}));

router.post("/logout", handler((req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}));

router.get("/:email", handler(async (req, res) => {
    const { email } = req.params;

    try {
        const [rows] = await connection.promise().query("SELECT * FROM students WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Email not found" });
        }

        res.json(rows[0]); // Changed to return only one student object
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(500).json({ error: "Server error" });
    }
}));

async function createUser(name, email, password, address) {
    return new Promise((resolve, reject) => {
        connection.query(
            "INSERT INTO students (name, email, password, address) VALUES (?, ?, ?, ?)",
            [name, email, password, address],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}

async function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM students WHERE email = ?",
            [email],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]); // Handle no result found scenario
                }
            }
        );
    });
}

export default router;