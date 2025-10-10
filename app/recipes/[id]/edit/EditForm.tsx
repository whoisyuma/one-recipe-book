'use client'

import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useState, useTransition } from "react"
import { updateRecipe } from "./actions"
import { createClient } from "@/utils/supabase/client"

type Ingredient = { 
    name: string; amount: string 
}

interface EditProps {
    recipeId: string;
}

export default function EditForm({ recipeId }: EditProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    const [title, setTitle] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
    const [steps, setSteps] = useState<string[]>([''])
    
    // 初期データ取得
    useEffect(() => {
        const fetchRecipe = async () => {
            // ユーザー認証
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // データの取得
            const { data: recipe, error } = await supabase.from('recipes').select('*').eq('id', recipeId).single()

            if (error || !recipe) {
                alert('レシピの読み込みに失敗しました')
                return
            }

            setTitle(recipe.title)
            setImagePreview(recipe.image_url)
            setIngredients(recipe.ingredients || [{ name: '', amount: '' }])
            setSteps(recipe.steps || [''])
        }

        fetchRecipe()
    }, [recipeId, router, supabase])
    
    // 画像のプレビュー
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setImageFile(file)
        if (file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        }
    }
    
    // 材料の管理
    const updateIngredient = (index: number, key: 'name' | 'amount', value: string) => {
        const updated = [...ingredients]
        updated[index][key] = value
        setIngredients(updated)
    }

    // 材料の追加と削除
    const addIngredient = () => setIngredients([...ingredients, { name: '', amount: '' }])
    const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index))
    
    // 手順の管理
    const updateStep = (index: number, value: string) => {
        const updated = [...steps]
        updated[index] = value
        setSteps(updated)
    }

    // 手順の追加と削除
    const addStep = () => setSteps([...steps, ''])
    const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index))
        
    // 画像をストレージに保存しserver actionsからcreateRecipe関数を呼び出す
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        startTransition(async () => {
            let imageUrl = imagePreview

            // 新しい画像が選ばれていたらアップロード
            if (imageFile && imagePreview?.startsWith('blob:')) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${crypto.randomUUID()}.${fileExt}`
                const filePath = `recipes/${fileName}`

                const { error: uploadError } = await supabase
                    .storage
                    .from('recipe-images')
                    .upload(filePath, imageFile)

                if (uploadError) {
                    alert('画像のアップロードに失敗しました')
                    console.error(uploadError.message)
                    return
                }

                // 画像のURLを取得
                const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath)
                imageUrl = data.publicUrl
            }

            const formData = new FormData()
            formData.append('id', recipeId)
            formData.append('title', title)
            formData.append('imageUrl', imageUrl ?? '')
            formData.append('ingredients', JSON.stringify(ingredients))
            formData.append('steps', JSON.stringify(steps))

            updateRecipe(formData)
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* タイトル */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">タイトル</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    required
                />
            </div>

            {/* 画像 */}
            <div className="mb-8">
                <label className="block mb-2 font-semibold text-gray-700">メイン画像</label>
                <input type="file" onChange={handleImageChange} className='rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'/>
                {imagePreview && (
                    <img src={imagePreview} alt="プレビュー" className="mt-4 max-w-xs rounded-md border border-gray-300 shadow-sm"/>
                )}
            </div>

            {/* 材料 */}
            <div className="mb-8">
                <label className="block mb-2 font-semibold text-gray-700">材料</label>
                {ingredients.map((ing, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="材料名"
                            value={ing.name}
                            onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                        />
                        <input
                            type="text"
                            placeholder="量"
                            value={ing.amount}
                            onChange={(e) => updateIngredient(i, 'amount', e.target.value)}
                            className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                        />
                        <button type="button" onClick={() => removeIngredient(i)} disabled={ingredients.length === 1} className="text-red-500 font-bold px-2">
                            ×
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addIngredient} className="mt-2 px-4 py-1 bg-amber-400 text-white rounded-md hover:bg-amber-500">
                    材料を追加
                </button>
            </div>

            {/* 手順 */}
            <div className="mb-8">
                <label className="block mb-2 font-semibold text-gray-700">手順</label>
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-2 mb-3">
                        <textarea
                            rows={2}
                            value={step}
                            onChange={(e) => updateStep(i, e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                            required
                        />
                        <button type="button" onClick={() => removeStep(i)} disabled={steps.length === 1} className="text-red-500 font-bold px-2">
                            ×
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addStep} className="mt-2 px-4 py-1 bg-amber-400 text-white rounded-md hover:bg-amber-500">
                    手順を追加
                </button>
            </div>

            {/* 保存 */}
            <button type="submit" disabled={isPending} className="w-full py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500">
                {isPending ? '更新中...' : '更新する'}
            </button>
        </form>
    )
}