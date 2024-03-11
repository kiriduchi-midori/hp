import Link from "next/link";
import Image from "next/image";

const className = `text-center`;
const h2 = `text-3xl pt-8 pb-8`;
const linkOption = {
  target: "_blank",
  rel: "noopener noreferrer"
};

function Header() {
  return (
    <header className={className}>
      <h1 className={`text-4xl`}>
        red-cabinet.net
      </h1>
    </header>
  );
}

function Author() {
  return (
    <section>
      <h2 className={h2}>
        author
      </h2>

      <h3 className={`flex flex-row items-center pb-4`}>
        <div className={`pr-4`}>
          <Image src={"/data/sns.png"} width={64} height={64} alt="icon" />
        </div>
        <div>
          錐槌 碧<br />
          Kiriduchi Midori
        </div>
      </h3>

      <p className={`text-xs`}>
        🎂: Oct, 9th | 🗨: 日本語, English
      </p>

      <Link
        href="/data/pubkey.asc"
        className={`text-xs`}
        {...linkOption}
      >
        🔑 AC698 7DD9C 4A0AC A4046 44F1A E626E 4E564 57BE3 3B497 04844
      </Link>
    </section>
  );
}

function Contact() {
  return (
    <section>
      <h2 className={h2}>
        contact
      </h2>

      <Link
        href="mailto:kiriduchi.midori@red-cabinet.net"
        {...linkOption}
      >
        ✉️ kiriduchi.midori@red-cabinet.net
      </Link>
    </section>
  );
}

function Main() {
  return (
    <main className={`pt-8 pb-8`}>
      <Author />
      <Contact />
    </main>
  );
}

function Footer() {
  return (
    <footer className={`${className} text-xs`} style={{ color: "#ff2222" }}>
      since 2023.03 © red-cabinet.net v3.0.2
    </footer>
  );
}


export default function Page() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}
