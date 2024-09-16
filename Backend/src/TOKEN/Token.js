import jwt from 'jsonwebtoken';
import dotenv from "dotenv"


dotenv.config()
export function generateTokenResponse(student) {
    const token = jwt.sign(
        {
            id: student.id,
            name: student.name,
            email: student.email
        },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
    );

    return {
        token,
        user: {
            id: student.id,
            name: student.name,
            email: student.email
        },
    };
}