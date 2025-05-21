'use client'
import React, { useEffect, useState } from 'react'

type Game = {
    id: number
    title: string
    thumbnail: string
    short_description: string
    game_url: string
    genre: string
    platform: string
    publisher: string
    release_date: string
    freetogame_profile_url: string
}

export default function Games() {
    const [genre, setGenre] = useState('')
    const [publisher, setPublisher] = useState('')
    const [games, setGames] = useState<Game[]>([])

    const fetchGames = async (genre?: string, publiisher?: string) => {
        let url = '/api/games'
        const params = new URLSearchParams()

        if (genre) params.append('genre', genre)
        if (publisher) params.append('publisher', publisher)

        if (params.toString()) {
            url += '?' + params.toString()
        }

        const res = await fetch(url)
        const data = await res.json()
        setGames(data)
    }
    useEffect(() => {
        fetchGames()
    }, [])

    useEffect(() => {
        if (!genre && !publisher) {
            fetchGames()
        } else {
            fetchGames(genre || undefined, publisher || undefined)
        }
    }, [genre, publisher])

    return (
        <div>
            <h1>Games</h1>
            <div>
                <label>
                    Genre:{' '}
                    <input
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="Example: RPG"
                    />
                </label>
                <label>
                    Publisher:{' '}
                    <input
                        type="text"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        placeholder="Example: Phoenix Labs"
                    />
                </label>
            </div>
            <div>
                {games.length === 0 && <p>Inga spel att visa</p>}
                {games.map((game) => (
                    <div key={game.id}>
                        <h3>{game.title}</h3>
                        <img src={game.thumbnail} alt={game.title} width={150} />
                        <p>{game.short_description}</p>
                        <p>
                            <strong>Genre: </strong> {game.genre} <br />
                            <strong>Publsiher: </strong> {game.publisher} <br />
                        </p>
                        <a href={game.game_url} target='_blank' rel='noopener noreferrer'>Spela här</a>
                    </div>
                ))}
            </div>
        </div>
    )
}
