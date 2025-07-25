import Link from "next/link";

export default function BlogLink({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="text-blue-600 hover:underline font-medium">
      {title}
    </Link>
  );
}
