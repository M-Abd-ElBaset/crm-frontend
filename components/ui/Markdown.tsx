import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="mb-1 mt-4 text-base font-semibold text-gray-100">{children}</h2>,
        p: ({ children }) => <p className="my-2 text-gray-300">{children}</p>,
        ul: ({ children }) => <ul className="my-1 list-disc space-y-1 pl-5 text-gray-300">{children}</ul>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-gray-100">{children}</strong>,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}