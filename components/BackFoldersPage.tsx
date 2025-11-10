import Link from "next/link";

export default function BackToFoldersPageButton() {
  return (
    <Link 
      href='/folders' 
      className="cursor-pointer text-lg relative -left-2 text-gray-800 hover:text-black duration-200"
    >
      〈 Folders
    </Link>
  )
}