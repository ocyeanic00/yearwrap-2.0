import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import useUserStore from '../store/userStore'

export default function Signup() {
    const navigate = useNavigate()
    const setUser = useUserStore(s => s.setUser)
    const setToken = useUserStore(s => s.setToken)

    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirm) return setError('Passwords do not match.')
        if (form.password.length < 6) return setError('Min 6 characters.')
        setLoading(true)
        try {
            const res = await authService.register({ name: form.name, email: form.email, password: form.password })
            const d = res.data
            localStorage.setItem('token', d.token)
            setToken(d.token)
            setUser({ _id: d._id, name: d.name, email: d.email })
            navigate('/')
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    const strength = !form.password.length ? 0 : form.password.length < 4 ? 1 : form.password.length < 7 ? 2 : form.password.length < 10 ? 3 : 4
    const strengthColor = ['', '#e07070', '#e8c87a', '#a8d87a', '#7ec87a'][strength]
    const strengthLabel = ['', 'weak', 'fair', 'good', 'strong'][strength]

    return (
        <>
            <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; }
        .yw-input {
          width: 100%; box-sizing: border-box;
          padding: 10px 12px 10px 36px;
          background: rgba(255,245,235,0.08) !important;
          border: 1px solid rgba(255,220,170,0.20);
          border-radius: 10px; outline: none;
          font-size: 13px; color: #f5ead8 !important;
          font-family: Georgia, serif;
          -webkit-text-fill-color: #f5ead8 !important;
        }
        .yw-input::placeholder { color: rgba(200,168,130,0.4); }
        .yw-input:focus { border-color: rgba(200,168,130,0.55); }
        .yw-input:-webkit-autofill,
        .yw-input:-webkit-autofill:hover,
        .yw-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px rgba(35,14,4,0.98) inset !important;
          -webkit-text-fill-color: #f5ead8 !important;
          caret-color: #f5ead8;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

            <div style={{
                height: '100vh', width: '100vw', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', fontFamily: 'Georgia, serif',
            }}>
                <img src="/bg-lily.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(59,35,20,0.78),rgba(107,66,38,0.62),rgba(139,94,60,0.52))', zIndex: 1 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 25%, rgba(15,5,1,0.68) 100%)', zIndex: 2 }} />

                <div style={{
                    position: 'relative', zIndex: 10,
                    width: 'min(380px, calc(100vw - 32px))',
                    background: 'rgba(22,9,3,0.58)',
                    backdropFilter: 'blur(60px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(60px) saturate(200%)',
                    border: '1px solid rgba(255,215,160,0.18)',
                    borderRadius: 20, padding: '28px 24px',
                    boxShadow: '0 12px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,230,190,0.10)',
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <img src="/logo.png" alt="YearWrap" style={{ width: 38, height: 38, objectFit: 'contain', display: 'block', margin: '0 auto 10px', filter: 'brightness(1.2)' }}
                            onError={e => { e.target.style.display = 'none' }} />
                        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f5ead8' }}>create account</h1>
                        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(200,168,130,0.58)' }}>start wrapping your year</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Field icon="ri-user-line">
                            <input className="yw-input" name="name" type="text" placeholder="your name" value={form.name} onChange={handleChange} required />
                        </Field>
                        <Field icon="ri-mail-line">
                            <input className="yw-input" name="email" type="email" placeholder="email address" value={form.email} onChange={handleChange} required />
                        </Field>
                        <Field icon="ri-lock-line" right={<i onClick={() => setShowPass(v => !v)} className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'} style={eyeStyle} />}>
                            <input className="yw-input" name="password" type={showPass ? 'text' : 'password'} placeholder="password"
                                value={form.password} onChange={handleChange} required style={{ paddingRight: 36 }} />
                        </Field>
                        <Field icon="ri-lock-password-line">
                            <input className="yw-input" name="confirm" type={showPass ? 'text' : 'password'} placeholder="confirm password" value={form.confirm} onChange={handleChange} required />
                        </Field>

                        {form.password.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {[1, 2, 3, 4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : 'rgba(200,168,130,0.15)', transition: 'background 0.2s' }} />)}
                                <span style={{ fontSize: 9, color: strengthColor, marginLeft: 5, minWidth: 26 }}>{strengthLabel}</span>
                            </div>
                        )}

                        {error && <p style={{ margin: 0, fontSize: 11, color: '#e07070', textAlign: 'center', background: 'rgba(200,60,60,0.1)', border: '1px solid rgba(200,60,60,0.2)', borderRadius: 8, padding: '6px 10px' }}>{error}</p>}

                        <button type="submit" disabled={loading} style={{
                            marginTop: 4, width: '100%', padding: '11px',
                            background: loading ? 'rgba(200,168,130,0.2)' : '#c8a882',
                            border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: 13, fontWeight: 700, color: '#3b2314', fontFamily: 'Georgia, serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
                            boxShadow: loading ? 'none' : '0 4px 18px rgba(200,168,130,0.28)',
                        }}>
                            {loading
                                ? <><i className="ri-loader-4-line" style={{ fontSize: 14, animation: 'spin 1s linear infinite' }} /> creating...</>
                                : <><i className="ri-user-add-line" style={{ fontSize: 14 }} /> create account</>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'rgba(200,168,130,0.48)' }}>
                        already have an account?{' '}
                        <Link to="/login" style={{ color: '#c8a882', textDecoration: 'none', fontWeight: 600 }}>sign in</Link>
                    </p>
                </div>
            </div>
        </>
    )
}

function Field({ icon, right, children }) {
    return (
        <div style={{ position: 'relative' }}>
            <i className={icon} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(200,168,130,0.45)', pointerEvents: 'none', zIndex: 1 }} />
            {children}
            {right}
        </div>
    )
}

const eyeStyle = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(200,168,130,0.45)', cursor: 'pointer', zIndex: 1 }
