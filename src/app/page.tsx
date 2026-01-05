'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Play, Terminal, Loader2, X, Maximize2, Minimize2, Lightbulb, Search, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CODE_SNIPPETS, CATEGORIES, CodeSnippet } from '@/lib/snippets'

export default function CodeEditor() {
  const [code, setCode] = useState(`# Welcome to Python Code Editor
# Write your Python code here and run it!
# Note: For security, certain operations are blocked by Pydantic validation

def greet(name):
    return f"Hello, {name}!"

# Example usage
print(greet("World"))

# Try some calculations
for i in range(1, 6):
    print(f"Square of {i} is {i**2}")

# Working with lists and dictionaries
numbers = [1, 2, 3, 4, 5]
squared = [x ** 2 for x in numbers]
print(f"Squared list: {squared}")
`)

  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false)
  const [serviceReady, setServiceReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  // Prevent hydration mismatch by only running effects after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if service is ready
  useEffect(() => {
    if (!mounted) return

    const checkService = async () => {
      try {
        const response = await fetch('/api/health?XTransformPort=3010')
        if (response.ok) {
          setServiceReady(true)
        }
      } catch (err) {
        console.error('Service not ready:', err)
        setServiceReady(false)
      }
    }

    checkService()
    // Check every 5 seconds
    const interval = setInterval(checkService, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  // Scroll to bottom of output when new output is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const runCode = async () => {
    if (!code.trim()) return

    setIsRunning(true)
    setOutput([])
    setError(null)

    try {
      const response = await fetch('/api/execute?XTransformPort=3010', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      // Handle HTTP status errors (e.g., Pydantic validation errors)
      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.detail
          ? Array.isArray(errorData.detail)
            ? errorData.detail.map((d: any) => d.msg).join(', ')
            : errorData.detail
          : `HTTP ${response.status}: ${response.statusText}`

        setError(`Validation Error: ${errorMessage}`)
        setIsRunning(false)
        return
      }

      const result = await response.json()

      if (result.success) {
        if (result.output) {
          const lines = result.output.split('\n').filter(line => line.trim())
          setOutput(lines)
        } else {
          setOutput(['Code executed successfully (no output)'])
        }
      } else {
        setError(result.error || result.output || 'Execution failed')
        if (result.output) {
          const lines = result.output.split('\n').filter(line => line.trim())
          setOutput(lines)
        }
      }
    } catch (err) {
      setError('Failed to connect to Python execution service. Please try again.')
      console.error('Execution error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  const clearOutput = () => {
    setOutput([])
    setError(null)
  }

  const insertSnippet = (snippet: CodeSnippet) => {
    const newCode = code + '\n\n' + snippet.code + '\n'
    setCode(newCode)
    setShowSuggestions(false)
  }

  const filteredSnippets = CODE_SNIPPETS.filter(snippet => {
    const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory
    const matchesSearch = snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    return matchesCategory && matchesSearch
  })

  const defaultPythonCode = `# Python Code Editor
# Start coding here!

print("Hello, World!")`

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-6 h-6 text-green-400" />
            <h1 className="text-xl font-bold text-white">Python Code Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 text-white gap-2 font-medium"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Code Editor Panel */}
        <div
          className={`flex flex-col bg-gray-900 ${
            isEditorFullscreen ? 'w-full' : showSuggestions ? 'w-1/3' : 'w-1/2'
          } transition-all duration-300 ease-in-out border-r border-gray-800`}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
            <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Code Editor
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className={`text-gray-400 hover:text-white gap-1 ${showSuggestions ? 'bg-gray-800' : ''}`}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Snippets</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditorFullscreen(!isEditorFullscreen)}
                className="text-gray-400 hover:text-white"
              >
                {isEditorFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {mounted ? (
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || defaultPythonCode)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  insertSpaces: true,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                  fontLigatures: true,
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                  renderWhitespace: 'selection',
                  bracketPairColorization: { enabled: true },
                  guides: {
                    bracketPairs: true,
                    indentation: true
                  },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true
                  }
                }}
                loading={
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Suggestions Panel */}
        {showSuggestions && !isEditorFullscreen && (
          <div className="flex flex-col w-1/3 bg-gray-900 border-r border-gray-800">
            {/* Suggestions Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Code Snippets
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="px-4 py-2 border-b border-gray-800">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Snippets List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredSnippets.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No snippets found</p>
                  <p className="text-xs mt-1">Try a different search or category</p>
                </div>
              ) : (
                filteredSnippets.map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => insertSnippet(snippet)}
                    className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-gray-600 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                            {snippet.name}
                          </h3>
                          <span className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                            {snippet.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {snippet.description}
                        </p>
                        {snippet.tags && snippet.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {snippet.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors mt-1 flex-shrink-0" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Snippets Footer */}
            <div className="px-4 py-2 border-t border-gray-800 bg-gray-900 text-xs text-gray-500">
              {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''} available
            </div>
          </div>
        )}

        {/* Output Panel */}
        {!isEditorFullscreen && (
          <div className={`flex flex-col bg-gray-950 ${showSuggestions ? 'w-1/3' : 'w-1/2'}`}>
            {/* Output Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Output
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearOutput}
                disabled={output.length === 0}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Output Content */}
            <div className="flex-1 overflow-auto p-4 font-mono text-sm" ref={outputRef}>
              {error ? (
                <div className="space-y-2">
                  <div className="text-red-400 font-semibold mb-2">Error:</div>
                  <div className="text-red-300 whitespace-pre-wrap">
                    {error}
                  </div>
                  {output.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <div className="text-gray-400 text-xs mb-2">Output:</div>
                      {output.map((line, index) => (
                        <div key={index} className="text-green-400 whitespace-pre-wrap">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : output.length === 0 ? (
                <div className="text-gray-500 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Output will appear here</p>
                    <p className="text-xs mt-1">Click "Run Code" to execute your Python code</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {output.map((line, index) => (
                    <div
                      key={index}
                      className="text-green-400 whitespace-pre-wrap"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Output Footer */}
            <div className="px-4 py-2 border-t border-gray-800 bg-gray-900">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {output.length} line{output.length !== 1 ? 's' : ''} of output
                </span>
                {isRunning && (
                  <span className="flex items-center gap-1 text-green-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Executing...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer suppressHydrationWarning className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm py-3">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs text-gray-500">
          <span>Python Code Editor with FastAPI + Pydantic validation</span>
          <div className="flex items-center gap-4">
            {mounted && (
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${serviceReady ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                {serviceReady ? 'Service ready' : 'Connecting...'}
              </span>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
