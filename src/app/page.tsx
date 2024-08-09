const x = 5;

export default function Page() {
  const a = 5;
  return (
    <div className="gap mx-4 flex flex-col items-center justify-center p-4">
      <button className="btn btn-primary text-lg" type="button">
        Click {a + x}
      </button>
    </div>
  );
}
