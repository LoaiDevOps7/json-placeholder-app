export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>دمج واجهات برمجة التطبيقات</h3>
          <p>
            تطبيق توضيحي لدمج JSONPlaceholder API وخادم WebSocket مع Next.js
          </p>
        </div>

        <div className="footer-section">
          <h4>المصادر</h4>
          <ul>
            <li>
              <a
                href="https://jsonplaceholder.typicode.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                JSONPlaceholder
              </a>
            </li>
            <li>
              <a
                href="https://websocket.org/tools/websocket-echo-server.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                WebSocket Echo Server
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} تطبيق دمج واجهات برمجة التطبيقات. جميع
          الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
