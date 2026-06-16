export default function App() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      background: '#0a0a0a',
      fontFamily: "'Courier New', monospace",
    }}>
      <h1 style={{
        color: '#f0f0f0',
        fontSize: 'clamp(2rem, 6vw, 5rem)',
        fontWeight: 400,
        letterSpacing: '0.05em',
        margin: 0,
      }}>
        Hello World
      </h1>
    </div>
  )
}
