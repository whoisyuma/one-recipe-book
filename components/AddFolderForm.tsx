'use client'

import { createFolder } from "@/app/folders/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-orange-400 hover:bg-orange-500 text-white py-1.5 px-3 rounded shadow"
    >
      {pending ? '追加中...' : '追加する'}
    </button>
  )
}

export default function AddFolderForm() {
  const [error, setError] = useState<string| null>(null); 

  return (
    <div>
      <form 
        action={createFolder} 
        className="flex justify-center items-center"
      >
        <input 
          type="text" 
          name="folderName" 
          placeholder="新しいフォルダを作成" 
          required 
          className="md:w-1/2 w-2/3 border rounded shadow-sm py-1 px-2 bg-white mr-1"
        />
        <SubmitButton/>
      </form>
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}