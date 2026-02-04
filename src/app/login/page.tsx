'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function LoginPage() {
    const router = useRouter()
    const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMessage(null)
        setLoading(true)

        try {
            if (isLogin) {
                await signInWithEmail(email, password)
            } else {
                await signUpWithEmail(email, password, name)
                setMessage('회원가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요!')
                setIsLogin(true) // Switch to login view or keep showing success message
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || '로그인/회원가입 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.5rem', fontWeight: 700 }}>
                {isLogin ? '로그인' : '회원가입'}
            </h1>

            <Card>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '16px' }}>
                            <Input
                                label="이름 (닉네임)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="사용하실 이름을 입력하세요"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <Input
                            label="이메일"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Input
                            label="비밀번호"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6자 이상 입력하세요"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ padding: '10px', background: '#FFEBEE', color: '#D32F2F', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{ padding: '10px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                            {message}
                        </div>
                    )}

                    <Button
                        variant="primary"
                        type="submit"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
                    </Button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                        {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                    </p>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError(null)
                            setMessage(null)
                        }}
                        style={{
                            background: 'none', border: 'none',
                            color: 'var(--color-primary)', fontWeight: 600,
                            cursor: 'pointer', fontSize: '0.95rem'
                        }}
                    >
                        {isLogin ? '회원가입하기' : '로그인하기'}
                    </button>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>또는</span>
                </div>

                <Button
                    variant="outline"
                    onClick={signInWithGoogle}
                    type="button"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '15px' }}
                >
                    Google로 계속하기
                </Button>
            </Card>
        </div>
    )
}
