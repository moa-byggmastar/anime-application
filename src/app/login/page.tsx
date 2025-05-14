'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isRegister, setIsRegister] = useState<boolean>(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const url = isRegister ? '/api/auth/register' : '/api/auth/login'
        const body = isRegister ? { username, email, password } : { email, password }

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (res.ok) {
                router.push('/')
            } else {
                const data = await res.json()
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('Something went wrong')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <header className='loginHeader'>
                    <h1>{isRegister ? 'Register' : 'Login'}</h1>
                    {error && <p>{error}</p>}
                </header>
                <div className='loginForm'>
                    {isRegister && (
                        <input className='loginInput' type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} required />
                    )}
                    <input className='loginInput' type="email" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} required />
                    <input className='loginInput' type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} required />

                    <button className='loginBtn' type='submit'>{isRegister ? 'Register' : 'Login'}</button>
                    <p className='link' onClick={() => setIsRegister(!isRegister)}>{isRegister ? 'Already have an account? Login' : 'No account? Register'}</p>
                </div>
            </form>
        </div>
    )
}
