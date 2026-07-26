import { GITHUB_PAGES_STATIC_PARAMS } from "@/app/github-pages-static";

export function generateStaticParams() {
  return GITHUB_PAGES_STATIC_PARAMS.filter((p) => "providerId" in p);
}

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
