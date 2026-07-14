import "./globals.css";

export const metadata = {
  title: "Atlantide",
  description: "Monitoraggio progetti aziendali",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
