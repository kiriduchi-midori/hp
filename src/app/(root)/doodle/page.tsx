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

type Props = {
  data: any;
}

function Article({data}: Props) {
  let images = <></>;
  const [pos, setPos] = useState(0);
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
    images = (
      <span style={{position: 'relative'}}>
        <div
          className="button"
          style={{
            left: '0',
            paddingRight: '5rem',
            opacity: pos !== data.files.s.length - 1 ? 1 : 0,
          }}
          onClick={() => setPos((prev) => prev + 1 < data.files.s.length ? prev + 1 : prev)}
        />
        <div
          className="button"
          style={{
            right: '0',
            paddingLeft: '5rem',
            opacity: pos === 0 ? 0 : 1, 
          }}
          onClick={() => setPos((prev) => prev - 1 >= 0 ? prev - 1 : prev)}
        />
        <span className="text-xs page-navi">
          pages: {pos + 1} / {data.files.s.length}
        </span>
        <Image
          className="doodle-img"
          src={`/assets/${data.uuid}/${data.files.s[pos].name}`}
          alt={data.files.s[pos].name}
          width={data.files.s[pos].w}
          height={data.files.s[pos].h}
          onClick={() => window.open(`/assets/${data.uuid}/${data.files.m[pos].name}`, '_blank')}
          style={{ zIndex: 0, cursor: 'pointer', }}
        />
      </span>
    );
  }

  let nsfw = <></>;
  if (data.nsfw) {
    nsfw = (
      <span className="nsfw text-xs">
        "nsfw"
      </span>
    );
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
      <span className="mx-auto pb-4 flex flex-col" style={{ position: 'relative' }}>
        {nsfw}
        {images}
      </span>
      <span>
        {data.description}
      </span>
    </article>
  );
}

export default function Page() {
  const [article, setArticle] = useState([<>loading...</>]);
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
                <Article data={e} />
                <hr className="hr" />
              </>
            );
          } else {
            return (
              <>
                <Article data={e} />
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
