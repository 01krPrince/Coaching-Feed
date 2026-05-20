
export const metadata = {
  title: 'SYNCUP Coaching Feed',
  description: 'Realtime coaching feed application',
};

// 🔄 Client-Side Ping Component
// Yeh component sirf browser mein chalega aur backend/frontend dono ko render state mein awake rakhega.
function KeepAlivePing() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const FRONTEND_URL = "https://coaching-feed-r2nm.onrender.com";
            
            setInterval(() => {
              // mode: 'no-cors' isiliye taaki bina kisi CORS tension ke request chali jaye
              fetch(FRONTEND_URL, { mode: 'no-cors' })
                .then(() => console.log("[Ping]: Keep-Alive trigger sent successfully"))
                .catch((err) => console.error("[Ping]: Keep-Alive failed", err));
            }, 12 * 60 * 1000); // Har 12 minute mein trigger hoga
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
        {/* Is component ko body ke end mein inject kar diya */}
        <KeepAlivePing />
      </body>
    </html>
  );
}