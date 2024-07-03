"use client";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import json from "./doodle.json";

const linkOption = {
  target: "_blank",
  rel: "noopener noreferrer",
};

function toArticle(data: any) {
  if (data.object_type !== "illust") {
    console.error(data.uuid, 'is not illuist');
    return <></>;
  }

  let key = "", keyLink = "";
  for (const k in data.files[0]) key = k;
  for (const k in data.files[1]) keyLink = k;

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
      <span className="mx-auto pb-4">
        <Link
          href={`/assets/${data.uuid}/${keyLink}`}
          {...linkOption}
        >
          <Image
            className="doodle-img"
            src={`/assets/${data.uuid}/${key}`}
            alt={data.uuid}
            width={data.files[0][key].w}
            height={data.files[0][key].h}
          />
        </Link>
      </span>
      <span>
        {data.description}
      </span>
    </article>
  );
}

export default function Page() {
  const array = json.map((e, i) => {
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
  });

  return (
    <>
      <Header title="doodle" />
      <main className="main">
        {<>{...array}</>}
      </main>
      <Footer />
    </>
  );
}
