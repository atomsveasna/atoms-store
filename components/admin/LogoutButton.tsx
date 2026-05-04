'use client'

export default function LogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }
  return (
    <button onClick={logout} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">
      Logout
    </button>
  )
}
