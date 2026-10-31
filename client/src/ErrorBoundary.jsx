import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('The app view failed to render:', error.name);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#111714', color: '#e8e9e2', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <section><h1>That didn’t load as expected.</h1><p>Refresh the page to continue. Your submitted answers remain on the server.</p><button onClick={() => window.location.reload()} style={{ padding: '12px 18px', cursor: 'pointer' }}>Refresh page</button></section>
    </main>;
  }
}
