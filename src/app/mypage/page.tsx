'use client'

import React, { useState } from 'react'

export const dynamic = 'force-dynamic'
import { useAuth } from '@/contexts/AuthContext'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { User, Edit2, LogOut, Check, X, Shield, Award } from 'lucide-react'

export default function MyPage() {
    const { user, dbUser, signOut, updateProfile } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        handicap: '',
        bio: ''
    })

    if (!user) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>마이페이지</h1>
                <Card style={{ padding: '30px', marginTop: 20 }}>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>로그인이 필요한 서비스입니다.</p>
                </Card>
            </div>
        )
    }

    const handleEditClick = () => {
        setFormData({
            name: dbUser?.name || user.email?.split('@')[0] || '',
            handicap: String(dbUser?.handicap || ''),
            bio: dbUser?.bio || ''
        })
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleSave = async () => {
        await updateProfile({
            name: formData.name,
            handicap: formData.handicap ? Number(formData.handicap) : undefined,
            bio: formData.bio
        })
        setIsEditing(false)
    }

    return (
        <div style={{ paddingBottom: '80px' }}>
            <h1 style={{ marginBottom: 0, fontSize: 'var(--h2-size)' }}>마이페이지</h1>

            {/* Profile Card */}
            <Card style={{ marginBottom: '20px', overflow: 'hidden', marginTop: '20px' }}>
                {/* Header / Cover */}
                <div style={{
                    height: '100px',
                    background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
                    margin: '-16px -16px 40px -16px',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        bottom: '-40px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <User size={40} color="var(--color-primary)" />
                    </div>
                </div>

                {isEditing ? (
                    /* Edit Form */
                    <div style={{ padding: '0 10px 10px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>닉네임</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%', padding: '10px',
                                    border: '1px solid var(--color-border)', borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>핸디캡</label>
                            <input
                                type="number"
                                value={formData.handicap}
                                onChange={(e) => setFormData({ ...formData, handicap: e.target.value })}
                                style={{
                                    width: '100%', padding: '10px',
                                    border: '1px solid var(--color-border)', borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>자기소개</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%', padding: '10px',
                                    border: '1px solid var(--color-border)', borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    resize: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button variant="outline" onClick={handleCancel} style={{ flex: 1, justifyContent: 'center' }}>
                                <X size={18} /> 취소
                            </Button>
                            <Button variant="primary" onClick={handleSave} style={{ flex: 1, justifyContent: 'center' }}>
                                <Check size={18} /> 저장
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* View Mode */
                    <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-main)' }}>
                            {dbUser?.name || user.email?.split('@')[0]}
                        </h2>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '4px 12px', background: 'var(--color-bg-light)',
                            borderRadius: '20px', fontSize: '0.9rem', color: 'var(--color-text-muted)',
                            marginBottom: '16px'
                        }}>
                            <Award size={14} /> Handicap: {dbUser?.handicap || '-'}
                        </div>

                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                            {dbUser?.bio || '자기소개를 입력해주세요.'}
                        </p>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <Button variant="outline" onClick={handleEditClick} style={{ padding: '8px 20px' }}>
                                <Edit2 size={16} /> 프로필 편집
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Account Actions */}
            {!isEditing && (
                <Card style={{ padding: '0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button
                            style={{
                                padding: '16px 20px',
                                background: 'none', border: 'none',
                                borderBottom: '1px solid var(--color-border)',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                fontSize: '1rem', color: 'var(--color-text-main)',
                                cursor: 'pointer', textAlign: 'left', width: '100%'
                            }}
                        >
                            <Shield size={20} color="var(--color-text-muted)" />
                            계정 보안
                        </button>
                        <button
                            onClick={signOut}
                            style={{
                                padding: '16px 20px',
                                background: 'none', border: 'none',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                fontSize: '1rem', color: 'var(--color-danger)',
                                cursor: 'pointer', textAlign: 'left', width: '100%'
                            }}
                        >
                            <LogOut size={20} />
                            로그아웃
                        </button>
                    </div>
                </Card>
            )}
        </div>
    )
}
