import Image from "next/image";

export function Footer() {
  return (
    <footer className="pt-8 pb-8">
      <Image
        className="m-auto"
        src="/favicon.ico"
        alt="footer icon"
        width={24}
        height={24}
      />
    </footer>
  );
}
