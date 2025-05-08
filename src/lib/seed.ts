import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function seedDb() {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    })

    await db.run('INSERT INTO anime (title, description, image_url) VALUES (?, ?, ?)', [
        'Naruto',
        'A young ninja who seeks recognition.',
        'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg'
    ])

    await db.run('INSERT INTO anime (title, description, image_url) VALUES (?, ?, ?)', [
        'Attack on Titan',
        'Humans fight for survival against giant monsters.',
        'https://th.bing.com/th/id/OIP.XckUA6OtZL3srH_M7XN36wHaKV?w=129&h=180&c=7&r=0&o=5&pid=1.7'
    ])

    await db.run('INSERT INTO anime (title, description, image_url) VALUES (?, ?, ?)', [
        'One Piece',
        'Pirates searching for a legendary treasure.',
        'https://images.justwatch.com/poster/301574476/s718/season-1.%7Bformat%7D.jpg'
    ])

    console.log('Database seeded!')
}

seedDb()
