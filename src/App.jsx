const liveProducts = [
  {
    title: 'Everyday Image Studio',
    subtitle: 'Smart image workflows for teams and creators',
    href: 'https://everydayimagestudio.dayfiles.com/',
    state: 'Live'
  },
  {
    title: 'PDF Toolkit',
    subtitle: 'Merge, compress, convert, and ship clean docs',
    href: 'https://pdf.dayfiles.com/',
    state: 'Live'
  }
];

const betaFeatures = [
  {
    name: 'File Copilot',
    description: 'Ask for edits in plain language and generate ready-to-share files in seconds.'
  },
  {
    name: 'Shared Workspaces',
    description: 'Keep all versions, comments, and exports in one place for your whole team.'
  },
  {
    name: 'Smart File Tags',
    description: 'Auto-tag incoming files by content so search and sorting stay fast at scale.'
  }
];

const workflows = [
  'Collect and clean incoming files',
  'Turn drafts into polished deliverables',
  'Share final outputs with trackable links'
];

export default function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          dayfiles.com
        </a>
        <a className="header-cta" href="https://pdf.dayfiles.com/" target="_blank" rel="noreferrer">
          Open Tools
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <p className="eyebrow">File stack for modern teams</p>
          <h1>Everything file-related, in one place.</h1>
          <p className="hero-copy">
            Dayfiles gives your team practical tools to handle documents, media, and daily file operations without
            switching between scattered apps.
          </p>
          <div className="hero-actions">
            <a href="https://everydayimagestudio.dayfiles.com/" target="_blank" rel="noreferrer">
              Explore Image Studio
            </a>
            <a href="https://pdf.dayfiles.com/" target="_blank" rel="noreferrer">
              Open PDF Toolkit
            </a>
          </div>
        </section>

        <section className="panel products" aria-label="Live products">
          <div className="section-heading">
            <h2>Live now</h2>
            <p>Production-ready tools available today.</p>
          </div>
          <div className="card-grid">
            {liveProducts.map((product) => (
              <article key={product.title} className="card">
                <div className="badge">{product.state}</div>
                <h3>{product.title}</h3>
                <p>{product.subtitle}</p>
                <a href={product.href} target="_blank" rel="noreferrer">
                  Visit {product.title}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel beta" aria-label="Beta features">
          <div className="section-heading">
            <h2>In beta</h2>
            <p>Features currently being tested with early users.</p>
          </div>
          <div className="card-grid">
            {betaFeatures.map((feature) => (
              <article key={feature.name} className="card beta-card">
                <div className="badge beta-badge">Beta</div>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel flow" aria-label="Workflow">
          <div className="section-heading">
            <h2>How teams use Dayfiles</h2>
          </div>
          <ol>
            {workflows.map((workflow) => (
              <li key={workflow}>{workflow}</li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="footer">
        <p>Dayfiles. Built for daily file work.</p>
        <div>
          <a href="https://everydayimagestudio.dayfiles.com/" target="_blank" rel="noreferrer">
            Image Studio
          </a>
          <a href="https://pdf.dayfiles.com/" target="_blank" rel="noreferrer">
            PDF Toolkit
          </a>
        </div>
      </footer>
    </div>
  );
}
