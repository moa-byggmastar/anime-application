'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Anime = {
    id: number
    title: string
    description: string
    image_url: string
}

export default function AnimeDetailPage() {
    const params = useParams()
    const [anime, setAnime] = useState<Anime | null>(null)

    useEffect(() => {
        fetch(`/api/anime/${params.id}`)
            .then(res => res.json())
            .then(data => setAnime(data))
    }, [params.id])

    if (!anime) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{anime.title}</h1>
            <img src={anime.image_url} alt={anime.title} />
            <p>{anime.description}</p>
        </div>
    )
}
