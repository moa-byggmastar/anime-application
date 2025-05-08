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
      router.replace('/login')
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

  if (loading) return <p className="text-white">Loading...</p>


  return (
    <main className="min-h-screen bg-[#10052D] text-white p-6">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">Anime Watch/Recommendation List</h1>

      {error && <p className="text-red-400 mb-2">{error}</p>}

      <div className="flex gap-4 mb-6">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close form' : 'Add new anime'}
        </button>

        <button onClick={handleLogout} className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700">Log out</button>
      </div>

      {showForm && (
        <form onSubmit={handleAddAnime} className="space-y-2 mb-6 max-w-md">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-black text-white placejolder-gray-400"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            required
            className="w-full p-2 rounded bg-black text-white placejolder-gray-400"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-black text-white placejolder-gray-400"
          />
          <button type="submit" className="bg-pink-600 px-4 py-2 rounded text-white hover:bg-pink-700">Save</button>
        </form>
      )}

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {animes.length === 0 ? (
          <p>No anime found.</p>
        ) : (
          animes.map(anime => (
            <div key={anime.id} className="bg-[#1A103D] p-2 rounded-lg text-center" >
              <img src={anime.image_url} alt={anime.title} className="w-full h-40 object-cover rounded" />
              <h2 className="text-lg font-bold mt-2">{anime.title}</h2>
              <p className="text-sm mb-2">{anime.description}</p>
              <div className="flex justify-center gap-2">
                <button onClick={() => handleDelete(anime.id)} className="bg-pink-600 text-white px-2 py-1 rounded text-sm hover:bg-pink-700">Delete</button>
                <button onClick={() => startEdit(anime)} className="bg-pink-600 text-white px-2 py-1 rounded text-sm hover:bg-pink-700">Edit</button>
              </div>

              {editModeId === anime.id && (
                <form onSubmit={handleUpdateAnime}>
                  <input type="text" placeholder='Title' value={editTitle} onChange={e => setEditTitle(e.target.value)} required className="w-full p-1 rounded bg-black text-white placeholder-gray-400" />
                  <input type="text" placeholder='Image URL' value={editImageUrl} onChange={e => setEditImageurl(e.target.value)} required className="w-full p-1 rounded bg-black text-white placeholder-gray-400" />
                  <textarea placeholder='Desription' value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full p-1 rounded bg-black text-white placeholder-gray-400" />
                  <div className="flex gap-2 justify-center">
                    <button type='submit' className="bg-pink-600 px-3 py-1 text-sm rounded hover:bg-pink-700">Update</button>
                    <button type='button' onClick={() => setEditModeId(null)} className="bg-gray-600 px-3 py-1 text-sm rounded hover:bg-gray-700">Cancel</button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  )
}
