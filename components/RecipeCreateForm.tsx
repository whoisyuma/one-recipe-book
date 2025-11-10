'use client'

import { createRecipe } from "@/app/recipes/create/actions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useTransition } from "react";

interface Folder {
  id: string;
  name: string;
}

interface RecipeCreateFormProps {
  folders: Folder[];
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit"
      disabled={pending}
      className="w-full py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500"
    >
      { pending ? '保存中...' : '保存する'}
    </button>
  )
}

export default function RecipeCreateForm({ folders }: RecipeCreateFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState(['']);

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `recipes/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('recipe-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          setError('画像のアップロードに失敗しました。');
          console.error('error', uploadError.message);
          return;
        }

        const { data } = supabase
          .storage
          .from('recipe-images')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('folderId', folderId);
      formData.append('imageUrl', imageUrl ?? '');
      formData.append('ingredients', JSON.stringify(ingredients));
      formData.append('steps', JSON.stringify(steps));

      const result = await createRecipe(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/folders');
      }
    })
  }
        
  function updateIngredient(index: number, key: 'name' | 'amount', value: string) {
    setIngredients((prev) => {
      const newIngredients = [...prev];
      newIngredients[index] = { ...newIngredients[index], [key]: value };
      return newIngredients;
    })
  }

  function addIngredient() {
    setIngredients((prev) => 
      [...prev, { name: '', amount: '' }]
    )
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => 
      prev.filter((_, i) => i !== index)
    )
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) => {
      const newSteps = [...prev];
      newSteps[index] = value;
      return newSteps;
    })
  }

  function addStep() {
    setSteps((prev) => 
      [...prev, '']
    );
  }

  function removeStep(index: number) {
    setSteps((prev) => 
      prev.filter((_, i) => i !== index)
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="text-red-100 text-sm">
          {error}
        </p>
      )}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          タイトル
        </label>
        <input
            type="text"
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="レシピ名を入力"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
        />
      </div>

      <div className="mb-6">
        <label 
          htmlFor="folderId"
          className="block mb-2 font-semibold text-gray-700"
        >
          フォルダ
        </label>
        <select 
          name="folderId" 
          id="folderId"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
        >
          <option value="">--- 未分類 ---</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">
          メイン画像
        </label>
        <input 
          type="file" 
          name='image' 
          required 
          accept="image/*" 
          onChange={handleImageChange} 
          className='w-1/2 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="プレビュー画像"
            className="mt-4 max-w-xs rounded-md border border-gray-300 shadow-sm"
          />
        )}
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">
          材料
        </label>
        {ingredients.map((ingredient, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="材料名"
              value={ingredient.name}
              required
              onChange={(e) => updateIngredient(i, 'name', e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              type="text"
              placeholder="量"
              value={ingredient.amount}
              required
              onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
              className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={() => removeIngredient(i)}
              className="text-red-500 font-bold px-2"
              disabled={ingredients.length === 1}
              title="削除"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 px-4 py-1 bg-amber-400 text-white rounded-md hover:bg-amber-500"
        >
          材料を追加
        </button>
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">
          手順
        </label>
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 mb-3">
            <textarea
              rows={2}
              placeholder={`手順 ${i + 1}`}
              value={step}
              required
              onChange={(e) => updateStep(i, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={() => removeStep(i)}
              className="text-red-500 font-bold px-2"
              disabled={steps.length === 1}
              title="削除"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="mt-2 px-4 py-1 bg-amber-400 text-white rounded-md hover:bg-amber-500"
        >
          手順を追加
        </button>
      </div>

      <input 
        type="hidden"
        name="ingredients" 
        value={JSON.stringify(ingredients)} 
      />
      <input 
        type="hidden" 
        name="steps" 
        value={JSON.stringify(steps)} 
      />

      <SubmitButton pending={isPending} />
    </form>
  )
}