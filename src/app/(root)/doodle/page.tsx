"use client";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";

const linkOption = {
  target: "_blank",
  rel: "noopener noreferrer",
};

function toArticle(data: any) {
  let images = <></>;
  if (data.object_type === "illust") {
    images = (
      <Link
        href={`/assets/${data.uuid}/${data.files[1].name}`}
        {...linkOption}
      >
        <Image
          className="doodle-img"
          src={`/assets/${data.uuid}/${data.files[0].name}`}
          alt={data.uuid}
          width={data.files[0].w}
          height={data.files[0].h}
        />
      </Link>
    );
  }
  if (data.object_type === "manga") {
    const array = [];
    for (let i = 0; i < data.files.s.length; i++) {
      array.push(
        <Link
          href={`/assets/${data.uuid}/${data.files.m[i].name}`}
          {...linkOption}
        >
          <Image
            className="doodle-img"
            src={`/assets/${data.uuid}/${data.files.s[i].name}`}
            alt={data.files.s[i].name}
            width={data.files.s[i].w}
            height={data.files.s[i].h}
          />
        </Link>
      );
    }
    images = <>{...array}</>;
  }

  return (
    <article key={data.uuid} className="flex flex-col p-4">
      <span className="flex flex-row">
        <span className="grow" />
        <span className="text-xs">
          {data.created_at}
        </span>
      </span>
      <span className="pb-4 text-xl">
        {data.title}
      </span>
      <span className="mx-auto pb-4 flex flex-col">
        {images}
      </span>
      <span>
        {data.description}
      </span>
    </article>
  );
}

export default function Page() {
  const [article, setArticle] = useState([<></>]);
  useEffect(() => {
    (async () => {
      const res = await fetch("/assets/doodle.json");
      if (!res.ok) {
        setArticle([<>something error happened 🤔</>]);
        return;
      }
      const json: [] = await res.json();
      setArticle(
        json.map((e, i) => {
          if (i < json.length - 1) {
            return (
              <>
                {toArticle(e)}
                <hr className="hr" />
              </>
            );
          } else {
            return (
              <>
                {toArticle(e)}
              </>
            );
          }
        })
      );
    })();
  }, []);

  return (
    <>
      <Header title="doodle" />
      <main className="main">
        {<>{...article}</>}
      </main>
      <Footer />
    </>
  );
}
