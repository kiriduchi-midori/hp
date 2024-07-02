"use client";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const h2 = "text-3xl h2";
const linkOption = {
  target: "_blank",
  rel: "noopener noreferrer"
};

function Author() {
  return (
    <section>
      <h2 className={h2}>
        author
      </h2>
      <div className="pt-8" />

      <div className="flex flex-row items-center pb-4">
        <div className="pr-4">
          <Image src="/data/sns.png" width={64} height={64} alt="icon" />
        </div>
        <div>
          錐槌 碧<br />
          Kiriduchi Midori
        </div>
      </div>

      <p>
        🎂: Oct, 9th | 🗨: 日本語, English | 🔏: <> </>
        <Link
          href="/data/pubkey.asc"
          {...linkOption}
        >
          🔑
        </Link>
      </p>

    </section>
  );
}

function Contact() {
  return (
    <section>
      <div className="pt-8" />
      <h2 className={h2}>
        contact
      </h2>
      <div className="pt-8" />

      <Link
        href="mailto:kiriduchi.midori@red-cabinet.net"
        {...linkOption}
      >
        ✉️ kiriduchi.midori@red-cabinet.net
      </Link>
      <p>
        I don&#39;t read any messages via SNS. Please email me if you want.
      </p>
    </section>
  );
}

function Links() {
  return (
    <section>
      <div className="pt-8" />
      <h2 className={h2}>
        link
      </h2>
      <div className="pt-8" />

      <ul className="list-disc list-inside">
        <li>
          <Link
            href="https://github.com/kiriduchi-midori/hp"
            {...linkOption}
          >
            git repo of this site
          </Link>
        </li>
      </ul>
    </section>
  );
}

function Banner() {
  return (
    <section>
      <div className="pt-8" />
      <h2 className={h2}>
        banner
      </h2>
      <div className="pt-8" />
      
      <Image src="/data/banner.png" width={200} height={40} alt="banner" />
    </section>
  );
}

function Main() {
  return (
    <main>
      <Author />
      <Contact />
      <Links />
      <Banner />
    </main>
  );
}

export default function Page() {
  return (
    <>
      <Header title="red-cabinet" />
      <Main />
      <Footer />
    </>
  );
}
