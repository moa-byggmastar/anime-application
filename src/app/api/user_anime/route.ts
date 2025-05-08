import { NextResponse } from "next/server"
import { db } from '@/lib/db'

//GET: Hämta alla anime för en specifik användare
export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const conn = await db()
    const userAnimes = await conn.all(`
        SELECT anime.* FROM anime
        INNER JOIN user_anime ON anime.id = user_anime.anime_id
        WHERE user_anime.user_id = ?`,
        [params.userId]
    )

    return NextResponse.json(userAnimes)
}

//POST: Lägg till en anime för en användare
export async function POST(request: Request) {
    const conn = await db()
    const { userId, animeId } = await request.json()

    const result = await conn.run(
        'INSERT INTO user_anime (user_id, anime_id) VALUES (?, ?)',
        [userId, animeId]
    )

    return NextResponse.json({ message: 'Anime added to user list', id: result.lastID })
}

//DELETE: Ta bort en anime från användarens lista
export async function DELETE(request: Request) {
    const conn = await db()
    const { userId, animeId } = await request.json()

    await conn.run(
        'DELETE FROM user_anime WHERE user_id = ? AND anime_id = ?',
        [userId, animeId]
    )

    return NextResponse.json({ message: 'Anime removed from user list' })
}
