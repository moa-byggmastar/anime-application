import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET() {
    const token = (await cookies()).get('token')?.value
    const decoded = token ? verifyToken(token) : null

    if (!decoded) {
        return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user: decoded })
}
