export const metadata = {
  title: 'SYNCUP Coaching Feed',
  description: 'Realtime coaching feed application',
};

// 🔄 Absolute Secure Client-Side Ping Component
function KeepAlivePing() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Yeh verify karega ki code sirf browser mein execute ho raha hai
            if (typeof window !== 'undefined') {
              const FRONTEND_URL = "https://coaching-feed-r2nm.onrender.com";
              
              // Pehla trigger immediate chala dete hain page khulte hi
              fetch(FRONTEND_URL, { mode: 'no-cors' }).catch(() => {});

              setInterval(() => {
                fetch(FRONTEND_URL, { mode: 'no-cors' })
                  .then(() => console.log("[Ping]: Frontend Awake ✅"))
                  .catch((err) => console.error("[Ping]: Frontend Keep-Alive failed", err));
              }, 12 * 60 * 1000); // Har 12 minute mein automatic background request
            }
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f9fafb", fontFamily: "system-ui, sans-serif" }}>
        {children}
        {/* Safe execution wrapper background inject */}
        <KeepAlivePing />
      </body>
    </html>
  );
}