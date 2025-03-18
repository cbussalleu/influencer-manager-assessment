import './globals.css'

export const metadata = {
  title: 'Self Assessment Tool',
  description: 'Take control of your self-assessment and drive real results',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
