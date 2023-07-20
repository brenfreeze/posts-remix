export default function ContactCard({ name, username }) {
  return (
    <div className="flex gap-4 px-4 py-2 border border-gray-300 shadow-md rounded-md">
      <div className="w-12 h-12 bg-gray-900 grid place-content-center rounded-full">
        <span className="text-2xl">👋</span>
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm">@{username}</p>
      </div>
    </div>
  );
}
