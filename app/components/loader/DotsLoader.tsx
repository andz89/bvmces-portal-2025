export function DotsLoader() {
  return (
    <div className="flex gap-2">
      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
    </div>
  );
}
