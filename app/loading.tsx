export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-amber-200">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-600 border-t-transparent"></div>
      <p className="mt-4 text-lg font-medium text-amber-800">
        読み込んでいます...
      </p>
    </div>
  );
}
