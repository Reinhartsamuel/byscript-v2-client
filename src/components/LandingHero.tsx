import heroVideo from './assets/hero-bg.mp4';
import './LandingHero.css';

export default function LandingHero() {
  return (
    <section className="hero">
      <header className="hero__masthead">
        <a className="hero__wordmark" href="/" aria-label="byScript home">
          <span className="hero__wordmark-by">by</span>
          <span className="hero__wordmark-script">Script</span>
        </a>
        <div className="hero__hairline" />
        <nav className="hero__nav">
          <a className="hero__nav-link" href="#platform">Platform</a>
          <a className="hero__nav-link" href="#strategies">Strategies</a>
          <a className="hero__nav-link" href="#contact">Contact</a>
        </nav>
      </header>

      <div className="hero__copy">
        <h1 className="hero__headline">
          <span className="hero__headline-line">
            <span className="hero__headline-inner">Your&nbsp;next&nbsp;trade</span>
          </span>
          <span className="hero__headline-line hero__headline-line--second">
            <span className="hero__headline-inner">starts&nbsp;with&nbsp;a&nbsp;signal.</span>
          </span>
        </h1>

        <p className="hero__subhead">
          <span className="hero__subhead-sentence">Connect&nbsp;your&nbsp;exchange.&nbsp;</span>
          <span className="hero__subhead-sentence">Activate&nbsp;a&nbsp;proven&nbsp;strategy.&nbsp;</span>
          <span className="hero__subhead-sentence">byScript&nbsp;executes&nbsp;the&nbsp;rest&nbsp;—&nbsp;reliably,&nbsp;24/7.</span>
        </p>

        <div className="hero__actions">
          <a className="hero__button" href="/login">Start automating</a>
          <a className="hero__link" href="#strategies">
            View strategies
            <svg
              className="hero__link-arrow"
              viewBox="0 0 11 12.6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="1.45"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5.5 0.4V12M1 7.5L5.5 12L10 7.5" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero__video-field">
        <video
          className="hero__video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
