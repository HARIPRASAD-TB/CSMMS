import { GITHUB_PAGES_STATIC_PARAMS } from "@/app/github-pages-static";

export function generateStaticParams() {
  return GITHUB_PAGES_STATIC_PARAMS.filter((p) => "id" in p);
}

export default function MaterialDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
