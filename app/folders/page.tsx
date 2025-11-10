import AddFolderForm from "@/components/AddFolderForm";
import AddRecipeButton from "@/components/AddRecipeButton";
import FolderDeleteButton from "@/components/FolderDeleteButton";
import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function FoldersPage() {
  const supabase = await createClient();

  const { data: folders, error } = await supabase
    .from('folders')
    .select('id, name')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('フォルダの読み込みに失敗しました。', error);
  }

  return (
    <div className="min-h-screen bg-amber-200">
      <Header/>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-15">
          <h1 className="text-4xl font-bold">
            Folders
          </h1>
          <AddRecipeButton/>
        </div>
        <AddFolderForm/>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mt-10 md:mt-15">
          <li className="bg-white flex flex-col items-center justify-center rounded-lg shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-200 md:p-4 py-2 cursor-pointer">
            <Link 
              href='/recipes' 
              className="flex flex-col items-center justify-start w-full px-3 md:px-0"
            >
              <img 
                src="/folder-icon.svg" 
                alt="フォルダアイコン" 
                className="w-20 h-20 md:w-25 md:h-25"
              />
              <p className="mt-2 font-medium text-center">
                すべて
              </p>
            </Link>
          </li>
          {folders?.map((folder) => (
            <li key={folder.id} className="relative bg-white flex items-center justify-center rounded-lg shadow-sm hover:shadow-lg transform hover:scale-[1.02] transition duration-200 md:p-4 py-2 cursor-pointer">
              <div className="flex flex-col">
                <Link 
                  href={`/folders/${folder.id}`} 
                  className="flex flex-col items-center justify-start w-full px-3 md:px-0"
                >
                  <img 
                    src="/folder-icon.svg" 
                    alt="フォルダアイコン" 
                    className="w-20 h-20 md:w-25 md:h-25"
                  />
                  <p className="mt-2 font-medium text-center">
                    {folder.name}
                  </p>
                </Link>
              </div>
              <div className="absolute top-2 right-2">
                <FolderDeleteButton folderId={folder.id}/>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}