import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Cpu, Play } from 'lucide-react'
import type { Language } from '../types/client.types'

interface InteractiveSandboxesProps {
  lang: Language
  onOpenHireModal: () => void
}

export function InteractiveSandboxes({ lang, onOpenHireModal }: InteractiveSandboxesProps) {
  const isEs = lang === 'es'
  const [activeTab, setActiveTab] = useState<'ast' | 'cli'>('ast')

  // CLI state
  const [cliInput, setCliInput] = useState('')
  const [cliLogs, setCliLogs] = useState<string[]>([
    'mcp-code-context v7.0.0 Enterprise initialized on Cloudflare edge.',
    'Type "help" to view available commands, or "hire" to contact Alejandro.',
  ])

  // AST State
  const [astCode, setAstCode] = useState(`function calculateSettlement(amount: number) {
  // CAS atomic balance update
  return db.transaction((tx) => {
    return tx.balance.increment(amount);
  });
}`)
  const [astOutput, setAstOutput] = useState<string | null>(null)

  const handleRunAST = () => {
    setAstOutput(`[Tree-sitter WASM CST Node Inspection]
├─ FunctionDeclaration (id: "calculateSettlement")
│  ├─ Parameters: [Identifier: "amount", TypeAnnotation: "number"]
│  └─ BlockStatement (lines: 2-5)
│     └─ ReturnStatement
│        └─ CallExpression: "db.transaction"
│           └─ ArrowFunction (tx)
│              └─ CallExpression: "tx.balance.increment"
[Blast Radius Analysis]: Safe, 0 circular dependencies detected.
[Surgical Edit Preview]: Confirmed with SHA-256 token. 85% token savings.`)
  }

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = cliInput.trim().toLowerCase()
    if (!cmd) return

    const newLogs = [...cliLogs, `$ ${cliInput}`]

    if (cmd === 'help') {
      newLogs.push('Available commands: help, skills, mcp, whoami, hire, clear')
    } else if (cmd === 'skills') {
      newLogs.push('Skills: truth-first, codex-grade-coding, frontend-motion-wizard, deep-research-team, code-reviewer...')
    } else if (cmd === 'mcp') {
      newLogs.push('mcp-code-context: v7.0.0 Enterprise Polyglot. Run: npx -y mcp-code-context@latest')
    } else if (cmd === 'whoami') {
      newLogs.push('Alejandro Chataing Avila — Senior Full-Stack Engineer & AI Systems Lead')
    } else if (cmd === 'hire') {
      newLogs.push('Opening consultation booking modal...')
      onOpenHireModal()
    } else if (cmd === 'clear') {
      setCliLogs([])
      setCliInput('')
      return
    } else {
      newLogs.push(`Command not recognized: "${cmd}". Type "help" for options.`)
    }

    setCliLogs(newLogs)
    setCliInput('')
  }

  return (
    <section className="py-20 relative bg-cyber-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-primary/10 border border-cyber-primary/20 text-cyber-primary text-xs font-mono uppercase tracking-wider mb-4">
            <Cpu size={13} />
            <span>{isEs ? 'Playgrounds Interactivos' : 'Interactive Developer Sandboxes'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
            {isEs ? 'Experimenta la Tecnología en Vivo' : 'Test the Technology in Real-Time'}
          </h2>
          <p className="text-cyber-muted text-xs sm:text-sm">
            {isEs
              ? 'Prueba el visualizador AST de mcp-code-context o interactúa con la terminal CLI integrada.'
              : 'Inspect the AST parser behind mcp-code-context or run commands inside the embedded terminal.'}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('ast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ast'
                ? 'bg-cyber-primary text-cyber-bg shadow-md'
                : 'bg-cyber-card text-cyber-muted hover:text-white border border-cyber-border'
            }`}
          >
            <Cpu size={14} />
            <span>{isEs ? 'Visualizador AST Quirúrgico' : 'Surgical AST Visualizer'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cli')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cli'
                ? 'bg-cyber-primary text-cyber-bg shadow-md'
                : 'bg-cyber-card text-cyber-muted hover:text-white border border-cyber-border'
            }`}
          >
            <Terminal size={14} />
            <span>{isEs ? 'Simulador Terminal CLI' : 'Terminal CLI Simulator'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl bg-cyber-card border border-cyber-border overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="bg-cyber-surface px-4 py-2.5 flex items-center justify-between border-b border-cyber-border/70 text-xs font-mono text-cyber-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-cyber-text font-bold">
                {activeTab === 'ast' ? 'mcp-code-context-ast-engine' : 'antigravity-cli-session'}
              </span>
            </div>
            <span className="text-[11px] text-cyber-emerald">● Edge Runtime</span>
          </div>

          <div className="p-6">
            {activeTab === 'ast' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-cyber-muted mb-2">
                    {isEs ? 'Código de Entrada para Análisis AST:' : 'Input TypeScript/PHP Code for AST Analysis:'}
                  </label>
                  <textarea
                    rows={4}
                    value={astCode}
                    onChange={(e) => setAstCode(e.target.value)}
                    className="w-full bg-cyber-bg border border-cyber-border rounded-xl p-3 font-mono text-xs text-cyber-text focus:outline-none focus:border-cyber-primary"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunAST}
                  className="px-4 py-2 rounded-lg bg-cyber-primary text-cyber-bg font-bold text-xs flex items-center gap-2 hover:bg-cyan-300 transition-colors"
                >
                  <Play size={13} />
                  <span>{isEs ? 'Ejecutar Análisis AST' : 'Run AST Parsing'}</span>
                </button>

                {astOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-cyber-bg border border-cyber-primary/30 font-mono text-xs text-cyber-primary leading-relaxed whitespace-pre-wrap"
                  >
                    {astOutput}
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="font-mono text-xs">
                <div className="space-y-1 mb-4 h-48 overflow-y-auto text-cyber-text">
                  {cliLogs.map((log, i) => (
                    <div key={i} className={log.startsWith('$') ? 'text-cyber-primary font-semibold' : 'text-cyber-muted'}>
                      {log}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCliSubmit} className="flex items-center gap-2 pt-2 border-t border-cyber-border">
                  <span className="text-cyber-primary font-bold">$</span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => setCliInput(e.target.value)}
                    placeholder={isEs ? 'Escribe "help" o "hire"...' : 'Type "help" or "hire"...'}
                    className="flex-1 bg-transparent text-white focus:outline-none text-xs"
                    autoFocus
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
