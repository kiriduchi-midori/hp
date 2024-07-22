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

const ArticleTemplate = (
  data: any,
  buttons: JSX.Element,
  navi: JSX.Element,
  nsfw: JSX.Element,
  image: JSX.Element,
  description: JSX.Element
) => (
  <article key={data.uuid} className="flex flex-col p-4">
    <span className="flex flex-row">
      <span className="grow" />
      <span className="text-xs pr-4">
        {data.tags.map((e: any) => `#${e}`).join(', ')}
      </span>
      <span className="text-xs">
        {data.created_at}
      </span>
    </span>
    <span className="pb-4 text-xl">
      {data.title}
    </span>
    <span className="mx-auto pb-4 flex flex-col" style={{ position: 'relative' }}>
      <span style={{ position: 'relative' }}>
        {buttons}
        {navi}
        {nsfw}
        {image}
      </span>
    </span>
    {description}
  </article>
);

function Nsfw({ data }: Props) {
  const navi = data.object_type === "manga" ? (
    <span className="text-xs page-navi">
      pages: 1 / {data.files.s.length}
    </span>
  ) : <></>;
  const button = (
    <div
      className="button"
      style={{
        left: '0',
        paddingRight: '5rem',
        opacity: 1,
      }}
      onClick={() => setElement(<><Article data={data} /></>)}
    />
  );
  const image = (
    <Image
      className="doodle-img"
      src="/data/nsfwIcon.jpg"
      alt="nsfw"
      width={434}
      height={614}
      style={{ zIndex: 0 }}
    />
  );
  const nsfw = <></>;
  const description = <></>;
  const [element, setElement] = useState(
    ArticleTemplate(data, button, navi, nsfw, image, description)
  );

  return (
    <>
      {element}
    </>
  );
}

function Article({ data }: Props) {
  const [pos, setPos] = useState(0);
  let buttons = <></>;
  let navi = <></>;
  let images = <></>;
  let nsfw = <></>;
  const description = (
    <span>
      {data.description}
    </span>
  );

  if (data.nsfw) {
    nsfw = (
      <span className="nsfw text-xs">
        nsfw
      </span>
    );
  }

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
    buttons = (
      <>
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
      </>
    );

    navi = (
      <span className="text-xs page-navi">
        pages: {pos + 1} / {data.files.s.length}
      </span>
    );
    
    images = (
      <Image
        className="doodle-img"
        src={`/assets/${data.uuid}/${data.files.s[pos].name}`}
        alt={data.files.s[pos].name}
        width={data.files.s[pos].w}
        height={data.files.s[pos].h}
        onClick={() => window.open(`/assets/${data.uuid}/${data.files.m[pos].name}`, '_blank')}
        style={{ zIndex: 0, cursor: 'pointer', }}
      />
    );
  }

  return ArticleTemplate(data,buttons,navi,nsfw,images,description);
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
        json.map((e:any, i) => {
          const article = e.nsfw === 0 ? <Article data={e} /> : <Nsfw data={e} />;
          if (i < json.length - 1) {
            return (
              <>
                {article}
                <hr className="hr" />
              </>
            );
          } else {
            return (
              <>
                {article}
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
