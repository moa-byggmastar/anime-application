import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

//GET: Hämta alla anime
export async function GET() {
    const conn = await db()
    const animes = await conn.all('SELECT * FROM anime')
    return NextResponse.json(animes)
}

//POST: Lägg till en ny anime
export async function POST(request: Request) {
    const conn = await db()
    const { title, description, image_url } = await request.json()

    const result = await conn.run(
        'INSERT INTO anime (title, description, image_url) VALUES (?, ?, ?)',
        [title, description, image_url]
    )

    return NextResponse.json({ id: result.lastID })
}

//PUT: Uppdatera en anime
export async function PUT(request: Request) {
    const conn = await db()
    const { id, title, description, image_url } = await request.json()

    const result = await conn.run(
        'UPDATE anime SET title = ?, description = ?, image_url = ? WHERE id = ?',
        [title, description, image_url, id]
    )

    if (result.changes === 0) {
        return NextResponse.json({ message: 'Anime not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Anime updated' })
}

//DELETE: Ta bort anime
export async function DELETE(request: Request) {
    const conn = await db()
    const { id } = await request.json()

    await conn.run('DELETE FROM anime WHERE id = ?', [id])

    return NextResponse.json({ message: 'Deleted' })

}
