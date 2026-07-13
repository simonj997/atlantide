import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Atlantide",
  description: "Monitoraggio progetti aziendali",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <div className="shell">
          <Sidebar />
          <div className="main">{children}</div>
        </div>
      </body>
    </html>
  );
}
