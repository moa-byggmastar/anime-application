'use client'
import { useEffect, useState } from 'react'

export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/me')
            .then(res => res.json())
            .then(data => {
                setUser(data.user || null)
                setLoading(false)
            })
            .catch(() => {
                setUser(null)
                setLoading(false)
            })
    }, [])

    return { user, loading }
}
