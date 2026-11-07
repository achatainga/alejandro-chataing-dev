interface AdminSocialsTabProps {
  socials: Record<string, string>
  secret: string
  isEs: boolean
  onSuccess: (msg: string) => void
}

export function AdminSocialsTab({ socials, secret, isEs, onSuccess }: AdminSocialsTabProps) {
  const handleSaveSocial = async (platform: string, url: string, label: string) => {
    try {
      const res = await fetch('/api/videos/socials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ platform, url, label }),
      })
      const data = await res.json()
      if (data.success) {
        onSuccess(isEs ? `Guardado: ${label}` : `Saved: ${label}`)
      }
    } catch {
      alert(isEs ? 'Error al guardar enlace' : 'Failed to save social link')
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-cyber-muted mb-2">
        {isEs
          ? 'Conecta tus perfiles de redes sociales y canales de difusión:'
          : 'Configure your connected social platforms and distribution channels:'}
      </div>
      {Object.entries(socials).map(([platform, url]) => (
        <div key={platform} className="p-3 rounded-xl bg-cyber-card border border-cyber-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase font-bold text-cyber-primary w-28">{platform}</span>
          <input
            type="text"
            defaultValue={url}
            id={`social-${platform}`}
            className="flex-1 px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-xs text-white"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById(`social-${platform}`) as HTMLInputElement
              if (input) handleSaveSocial(platform, input.value, platform.toUpperCase())
            }}
            className="px-3 py-1.5 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-primary text-xs font-semibold text-cyber-text transition-colors"
          >
            {isEs ? 'Guardar' : 'Save'}
          </button>
        </div>
      ))}
    </div>
  )
}
