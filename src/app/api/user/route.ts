import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

//GET: Hämta en användare via ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const conn = await db()
    const user = await conn.get('SELECT * FROM user WHERE id = ?', [params.id])

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
}

//PUT: Uppdatera en användares information
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const conn = await db()
    const { username, email, password } = await request.json()

    const result = await conn.run(
        'UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?',
        [username, email, password, params.id]
    )

    if (result.changes === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User updated' })
}
