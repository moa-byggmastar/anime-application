import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'my-secret'

export function signToken(payload: object) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET)
    } catch {
        return null
    }
}
