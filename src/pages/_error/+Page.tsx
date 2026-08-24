import { usePageContext } from 'vike-react/usePageContext'

export default function Page() {
  const pageContext = usePageContext()
  const is404 = pageContext.is404

  return (
    <div className="container" style={{ paddingTop: '10rem', paddingBottom: '6rem', minHeight: '60vh' }}>
      <p style={{ letterSpacing: '0.12em', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {is404 ? 'ERROR 404' : 'ERROR'}
      </p>
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>
        {is404 ? 'Page not found' : 'Something went wrong'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '36rem', marginBottom: '2rem' }}>
        {is404
          ? 'The page you requested does not exist. Head back to the homepage to continue.'
          : 'An unexpected error occurred. Please try again from the homepage.'}
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--accent-cta)',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Back to home
      </a>
    </div>
  )
}
