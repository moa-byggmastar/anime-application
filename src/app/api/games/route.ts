import Database from 'better-sqlite3'
import { NextRequest } from 'next/server'

const db = new Database('./games.db')

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    console.log(searchParams)
    if (searchParams.has('publisher')) {
        const publisher = searchParams.get('publisher')
        const game = db.prepare('SELECT * FROM games WHERE publisher = ?').all(publisher)
        return Response.json(game)
    }

    if (searchParams.has('genre')) {
        const genre = searchParams.get('genre')
        const game = db.prepare('SELECT * FROM games WHERE genre = ?').all(genre)
        return Response.json(game)
    }
    const games = db.prepare('SELECT * FROM games').all()
    return Response.json(games)
}