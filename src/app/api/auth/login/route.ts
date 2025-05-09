import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'

//POST: Logga in användare
export async function POST(request: Request) {
    const { email, password } = await request.json()
    const conn = await db()

    const user = await conn.get('SELECT * FROM user WHERE email = ?', [email])

    if (!user) {
        return NextResponse.json({ message: 'User not found ' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return NextResponse.json({ message: 'Invalid credentails' }, { status: 401 })
    }

    const response = NextResponse.json({ message: 'Login successful', userId: user.id }, { status: 200 })

    const token = signToken(user)

    response.cookies.set('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 //7 days
    })

    return response
}
