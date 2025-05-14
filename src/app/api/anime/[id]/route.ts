import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

//GET: Hämta en anime via ID
export async function GET(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const conn = await db()
    const anime = await conn.get('SELECT* FROM anime WHERE id = ?', [params.id])

    if (!anime) {
        return NextResponse.json({ message: 'Anime not found' }, { status: 404 })
    }

    return NextResponse.json(anime)
}