'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/lib/useUser'
import { useRouter } from 'next/navigation'

type Anime = {
  id: number
  title: string
  description: string
  image_url: string
}

export default function HomePage() {
  const { user, loading } = useUser()
  const router = useRouter()

  const [animes, setAnimes] = useState<Anime[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')
  const [editModeId, setEditModeId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImageUrl, setEditImageurl] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user])

  useEffect(() => {
    fetchAnimes()
  }, [])

  const fetchAnimes = async () => {
    try {
      const res = await fetch('/api/anime')
      if (!res.ok) throw new Error('Failed to fetch animes')
      const data = await res.json()
      setAnimes(data)
    } catch (err) {
      setError('Could not get anime list')
    }
  }

  const handleAddAnime = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || !imageUrl) {
      setError('Title and image URL needed')
      return
    }

    try {
      const res = await fetch('/api/anime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image_url: imageUrl }),
      })

      if (!res.ok) throw new Error('Failed to add anime')

      setTitle('')
      setDescription('')
      setImageUrl('')
      setShowForm(false)
      fetchAnimes()
    } catch (err) {
      setError('Something went wrong')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/anime', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error('Failed to delete anime')

      fetchAnimes()
    } catch (err) {
      console.error(err)
      setError('Could not delete anime')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/login')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  const startEdit = (anime: Anime) => {
    setEditModeId(anime.id)
    setEditTitle(anime.title)
    setEditDescription(anime.description)
    setEditImageurl(anime.image_url)
  }

  const handleUpdateAnime = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/anime', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editModeId,
          title: editTitle,
          description: editDescription,
          image_url: editImageUrl,
        }),
      })

      if (!res.ok) throw new Error('Failed to update anime')

      setEditModeId(null)
      fetchAnimes()
    } catch (err) {
      setError('Could not update anime')
    }
  }

  if (loading) return <p>Loading...</p>


  return (
    <div className='container'>
      <header className='header'>
        <h1 className='title'>Anime Watch/Recommendation List</h1>

        {error && <p>{error}</p>}

        <div className='buttons'>
          <button onClick={() => setShowForm(!showForm)} className='btn add'>
            {showForm ? 'Close form' : 'Add new anime'}
          </button>

          <button onClick={handleLogout} className='btn logout'>Log out</button>
        </div>
      </header>

      {showForm && (
        <form onSubmit={handleAddAnime}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button className='btn save' type="submit">Save</button>
        </form>
      )}

      <section className='grid'>
        {animes.length === 0 ? (
          <p>No anime found.</p>
        ) : (
          animes.map(anime => (
            <div key={anime.id} className='card' >
              <img src={anime.image_url} alt={anime.title} className='image' />
              <div className='info'>
                <strong>{anime.title}</strong>
                <p>{anime.description}</p>
              </div>
              <div className='actions'>
                <button onClick={() => handleDelete(anime.id)} className='btn delete' >Delete</button>
                <button onClick={() => startEdit(anime)} className='btn edit'>Edit</button>
              </div>

              {editModeId === anime.id && (
                <form onSubmit={handleUpdateAnime}>
                  <input type="text" placeholder='Title' value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
                  <input type="text" placeholder='Image URL' value={editImageUrl} onChange={e => setEditImageurl(e.target.value)} required />
                  <textarea placeholder='Desription' value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                  <div>
                    <button className='update' type='submit' >Update</button>
                    <button className='cancel' type='button' onClick={() => setEditModeId(null)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  )
}
