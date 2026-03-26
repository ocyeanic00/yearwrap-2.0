import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import useUserStore from '../store/userStore'

export default function Login() {
  const navigate = useNavigate()
  const setUser = useUserStore(s => s.setUser)
  const setToken = useUserStore(s => s.setToken)

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(form)
      const data = res.data
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser({ _id: data._id, name: data.name, email: data.email })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; }
        .yw-input {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px 12px 40px;
          background: rgba(255,245,235,0.08) !important;
          border: 1px solid rgba(255,220,170,0.20);
          border-radius: 10px; outline: none;
          font-size: 14px; color: #f5ead8 !important;
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
        {/* bg */}
        <img src="/bg-lily.jpg" alt="" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
        <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg,rgba(59,35,20,0.78),rgba(107,66,38,0.62),rgba(139,94,60,0.52))', zIndex: 1 }} />
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at center, transparent 25%, rgba(15,5,1,0.68) 100%)', zIndex: 2 }} />

        {/* card */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: 'min(380px, calc(100vw - 32px))',
          background: 'rgba(22,9,3,0.58)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,215,160,0.18)',
          borderRadius: 20, padding: '32px 24px',
          boxShadow: '0 12px 56px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,230,190,0.10)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src="/logo.png" alt="YearWrap" style={{ width: 40, height: 40, objectFit: 'contain', display: 'block', margin: '0 auto 10px', filter: 'brightness(1.2)' }}
              onError={e => { e.target.style.display = 'none' }} />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f5ead8' }}>welcome back</h1>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(200,168,130,0.58)' }}>sign in to your yearwrap</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field icon="ri-mail-line">
              <input className="yw-input" name="email" type="email" placeholder="email address" value={form.email} onChange={handleChange} required />
            </Field>
            <Field icon="ri-lock-line" right={
              <i onClick={() => setShowPass(v => !v)} className={showPass ? 'ri-eye-off-line' : 'ri-eye-line'} style={eyeStyle} />
            }>
              <input className="yw-input" name="password" type={showPass ? 'text' : 'password'} placeholder="password"
                value={form.password} onChange={handleChange} required style={{ paddingRight: 40 }} />
            </Field>

            {error && <p style={{ margin: 0, fontSize: 12, color: '#e07070', textAlign: 'center', background: 'rgba(200,60,60,0.1)', border: '1px solid rgba(200,60,60,0.2)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              marginTop: 6, width: '100%', padding: '12px',
              background: loading ? 'rgba(200,168,130,0.2)' : '#c8a882',
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, color: '#3b2314', fontFamily: 'Georgia, serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.6 : 1, transition: 'all 0.15s',
              boxShadow: loading ? 'none' : '0 4px 18px rgba(200,168,130,0.28)',
            }}>
              {loading
                ? <><i className="ri-loader-4-line" style={{ fontSize: 15, animation: 'spin 1s linear infinite' }} /> signing in...</>
                : <><i className="ri-login-box-line" style={{ fontSize: 15 }} /> sign in</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(200,168,130,0.48)' }}>
            don't have an account?{' '}
            <Link to="/signup" style={{ color: '#c8a882', textDecoration: 'none', fontWeight: 600 }}>sign up</Link>
          </p>
        </div>
      </div>
    </>
  )
}

function Field({ icon, right, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <i className={icon} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(200,168,130,0.45)', pointerEvents: 'none', zIndex: 1 }} />
      {children}
      {right}
    </div>
  )
}

const eyeStyle = { position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(200,168,130,0.45)', cursor: 'pointer', zIndex: 1 }
