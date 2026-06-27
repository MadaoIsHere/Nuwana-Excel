import "./globals.css";

export const metadata = {
  title: "Nuwana Excel",
  description: "Platform template Excel dengan video tutorial",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}