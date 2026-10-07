export const metadata = { title: "Simple Login" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 40 }}>{children}</body>
    </html>
  );
}
