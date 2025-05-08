import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

//POST: Registrera ny användare
export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json()

        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Missing fields' }, { status: 400 })
        }

        const conn = await db()

        const existingUser = await conn.get('SELECT * FROM user WHERE email = ?', [email])
        if (existingUser) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await conn.run(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        )

        return NextResponse.json({ message: 'User registered ' }, { status: 201 })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
