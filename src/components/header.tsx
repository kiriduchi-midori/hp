type Props = {
  title: string;
}

export function Header({title}: Props) {
  return (
    <header className="text-center pb-8">
      <h1 className="text-4xl">
        {title}
      </h1>
    </header>
  );
}
