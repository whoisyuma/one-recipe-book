'use client'

import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateRecipe } from "@/app/recipes/[id]/edit/actions";

interface Ingredient {
  name: string;
  amount: string;
}

interface Folder {
  id: string;
  name: string;
}

interface Recipe {
  id: string;
  title: string;
  folder_id: string | null;
  folder: Folder| null;
  image_url: string | null;
  ingredients: Ingredient[];
  steps: string[];
  user_id: string;
  created_at: string;
}

interface EditProps {
  recipeId: string;
  previousRecipeData: Recipe;
  folders: Folder[];
}

export default function RecipeEditForm({ recipeId, previousRecipeData, folders }: EditProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(previousRecipeData.title || '');
  const [folderId, setFolderId] = useState(previousRecipeData.folder_id || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(previousRecipeData.image_url);
  const [ingredients, setIngredients] = useState<Ingredient[]>(previousRecipeData.ingredients || [{ name: '', amount: '' }]);
  const [steps, setSteps] = useState<string[]>(previousRecipeData.steps || ['']);
  const [error, setError] = useState<string | null>(null);
    
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }
    
  const updateIngredient = (index: number, key: 'name' | 'amount', value: string) => {
    const updated = [...ingredients];
    updated[index][key] = value;
    setIngredients(updated);
  }

  const addIngredient = () => 
    setIngredients([
      ...ingredients, { name: '', amount: '' }
    ]);
  const removeIngredient = (index: number) => 
    setIngredients(
      ingredients.filter((_, i) => i !== index)
    );
  
  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => 
    setSteps([...steps, '']);
  const removeStep = (index: number) => 
    setSteps(
      steps.filter((_, i) => i !== index)
    );
        
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let imageUrl = imagePreview;

      if (imageFile && imagePreview?.startsWith('blob:')) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `recipes/${fileName}`;

        const { error: uploadError } = await supabase
          .storage
          .from('recipe-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          setError('新しい画像のアップロードに失敗しました。');
          console.error(uploadError.message);
          return;
        }

        const { data } = supabase
          .storage
          .from('recipe-images')
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      };

      const formData = new FormData();
      formData.append('id', recipeId);
      formData.append('title', title);
      formData.append('folderId', folderId || '');
      formData.append('imageUrl', imageUrl ?? '');
      formData.append('ingredients', JSON.stringify(ingredients));
      formData.append('steps', JSON.stringify(steps));

      const result = await updateRecipe(formData);
      if (result?.error) {
        setError('レシピの更新に失敗しました。');
      } else if (result.success) {
        router.push(`/recipes/${result.recipeId}`);
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="text-red-600 text-sm mb-5">
          ※{error}
        </p>
      )}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          タイトル
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
          onChange={handleImageChange} 
          className='rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'
        />
        {imagePreview && (
            <img 
              src={imagePreview} 
              alt="プレビュー" 
              className="mt-4 max-w-xs rounded-md border border-gray-300 shadow-sm"
            />
        )}
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-semibold text-gray-700">
          材料
        </label>
        {ingredients.map((ing, i) => (
          <div 
            key={i} 
            className="flex gap-2 mb-3"
          >
            <input
              type="text"
              placeholder="材料名"
              value={ing.name}
              onChange={(e) => updateIngredient(i, 'name', e.target.value)}
              required
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <input
              type="text"
              placeholder="量"
              value={ing.amount}
              onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
              required
              className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button 
              type="button" 
              onClick={() => removeIngredient(i)} 
              disabled={ingredients.length === 1} 
              className="text-red-500 font-bold px-2"
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
          <div key={i} className="flex gap-2 mb-3">
            <textarea
              rows={2}
              value={step}
              onChange={(e) => updateStep(i, e.target.value)}
              required
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button 
              type="button" 
              onClick={() => removeStep(i)} 
              disabled={steps.length === 1} 
              className="text-red-500 font-bold px-2"
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

      <button 
        type="submit" 
        disabled={isPending} 
        className="w-full py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500"
      >
        {isPending ? '更新中...' : '更新する'}
      </button>
    </form>
  )
}