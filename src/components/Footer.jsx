const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p className="footer-made-by">
            Hecho con 💜 por{' '}
            <a
              href="https://github.com/MiguelJiRo"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              MiguelJiRo
            </a>
          </p>
        </div>

        <div className="footer-section">
          <p className="footer-api">
            Powered by{' '}
            <a
              href="https://www.coingecko.com/en/api"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              CoinGecko API
            </a>
          </p>
        </div>

        <div className="footer-section">
          <p className="footer-year">
            {new Date().getFullYear()} © Crypto Live Dashboard
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
