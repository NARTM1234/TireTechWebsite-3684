/** Emphasize the parent-company name without changing CMS-authored copy. */
export function CompanyCopy({ text }: { text: string }) {
  const parts = text.split(
    /(Red\s+Star\s+General\s+Trading\s+Company|شركة\s+ريد\s+ستار\s+للتجارة\s+العامة)/gi,
  );
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <strong className="parent-company-inline" key={i}>
            {part.toUpperCase().split(/(Red|ريد)/i).map((word, j) => /^(Red|ريد)$/i.test(word)
              ? <span className="parent-company-red" key={j}>{word}</span> : word)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}
