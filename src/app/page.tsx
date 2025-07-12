import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-content">
          <h1>دمج واجهات برمجة التطبيقات مع Next.js</h1>
          <p>استكشف بيانات JSONPlaceholder وخادم WebSocket في تطبيق واحد</p>
          <div className="hero-buttons">
            <Link href="/json" className="btn primary">
              عرض بيانات JSON
            </Link>
            <Link href="/websocket" className="btn secondary">
              فتح WebSocket
            </Link>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 8h14a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm1 2v8h12v-8H6Zm6 2h2v2h-2v-2Zm-4 0h2v2H8v-2Zm8 0h2v2h-2v-2ZM7 5h10v2H7V5Z" />
            </svg>
          </div>
          <h3>JSONPlaceholder API</h3>
          <p>
            استكشف بيانات تجريبية من JSONPlaceholder تشمل المستخدمين والمنشورات
            والصور بتصميم جدول أنيق.
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm-5-7h2a3 3 0 0 0 6 0h2a5 5 0 0 1-10 0Zm1-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
            </svg>
          </div>
          <h3>WebSocket Echo</h3>
          <p>
            تواصل مع خادم WebSocket لإرسال واستقبال الرسائل في الوقت الحقيقي
            بواجهة مستخدم حديثة.
          </p>
        </div>
      </div>
    </div>
  );
}
