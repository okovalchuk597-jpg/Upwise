import "./globals.css";

export const metadata = {
  title: "Upwise — школа з упевненістю в Європі",
  description: "Живі уроки з вчителями та ШІ-підтримка для українських дітей, які адаптуються до школи в Європі.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
