export const metadata = {
  title: 'Whiteclaw AI Companion',
  description: 'Your personal AI companion with 5 specialized agents',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#080C10' }}>
        {children}
      </body>
    </html>
  )
    }
