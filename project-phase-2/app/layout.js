import "./globals.css";

export const metadata = {
  title: "Chirp Social Platform",
  description: "CMPS 350 project phase 2 frontend",
};

export default function Root({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
