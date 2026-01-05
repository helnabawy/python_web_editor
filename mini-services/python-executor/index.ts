import { Hono } from 'hono'

const app = new Hono()
const PORT = 3010

// Execute Python code using Bun's spawn
app.post('/api/execute', async (c) => {
  try {
    const { code } = await c.req.json()

    if (!code || typeof code !== 'string') {
      return c.json({ error: 'Invalid Python code' }, 400)
    }

    // Spawn Python process
    const python = Bun.spawn(['python3', '-c', code], {
      stdout: 'pipe',
      stderr: 'pipe',
      stdin: 'pipe',
    })

    // Wait for the process to complete
    const exited = await python.exited

    // Get output
    const stdout = await new Response(python.stdout).text()
    const stderr = await new Response(python.stderr).text()

    if (exited !== 0) {
      return c.json({
        success: false,
        output: stderr || stdout,
        error: stderr || 'Execution failed',
      })
    }

    return c.json({
      success: true,
      output: stdout,
    })
  } catch (error) {
    console.error('Python execution error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'python-executor' })
})

console.log(`Python Executor Service running on port ${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
