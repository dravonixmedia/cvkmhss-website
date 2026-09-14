export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output of trusted, locally-authored schema objects only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
