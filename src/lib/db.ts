import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

let instance: Database | null = null

export async function db(): Promise<Database> {
  if (instance) return instance

  instance = await open({
    filename: './database.db',
    driver: sqlite3.Database
  })

  // Skapa anime-tabellen
  await instance.exec(`
    CREATE TABLE IF NOT EXISTS anime (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT
    );
  `)

  //Skapa user-tabellen
  await instance.exec(`
    CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    )
    `)

  //Skapa user-anime tabellen
  await instance.exec(`
        CREATE TABLE IF NOT EXISTS user_anime (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        anime_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES user(id),
        FOREIGN KEY (anime_id) REFERENCES anime(id)
        )
        `)

  console.log('Database initialized')
  return instance
}
