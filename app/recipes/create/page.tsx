'use client'

import { useState, ChangeEvent } from 'react'
import { createRecipe } from './actions'
import { createClient } from '@/utils/supabase/client'

export default function RecipeCreateForm() {
    const supabase = createClient()
    const [title, setTitle] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [ingredients, setIngredients] = useState([{ name: '', amount: '' }])
    const [steps, setSteps] = useState([''])

    //   画像のプレビュー
    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null
        setImageFile(file)

        if (file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        } else {
            setImagePreview(null)
        }
    }

    // 画像をストレージに保存しserver actionsからcreateRecipe関数を呼び出す
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let imageUrl = null;

        // まず画像をストレージにアップロード
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            const filePath = `recipes/${fileName}`

            const { error: uploadError } = await supabase.storage.from('recipe-images').upload(filePath, imageFile)

            if (uploadError) {
                alert('画像のアップロードに失敗しました')
                console.error('error', uploadError.message)
                return
            }

            // ストレージから画像のURLを取得
            const { data } = supabase.storage.from('recipe-images').getPublicUrl(filePath)

            imageUrl = data.publicUrl
        }

        // server actionsの呼び出し
        const formData = new FormData()
        formData.append('title', title)
        formData.append('imageUrl', imageUrl ?? '')
        formData.append('ingredients', JSON.stringify(ingredients))
        formData.append('steps', JSON.stringify(steps))

        await createRecipe(formData)
    }
        

    //材料の管理
    function updateIngredient(index: number, key: 'name' | 'amount', value: string) {
        setIngredients((prev) => {
        const newIngredients = [...prev]
        newIngredients[index] = { ...newIngredients[index], [key]: value }
        return newIngredients
        })
    }

    //   材料欄の追加
    function addIngredient() {
        setIngredients((prev) => [...prev, { name: '', amount: '' }])
    }

    //   材料欄の削除
    function removeIngredient(index: number) {
        setIngredients((prev) => prev.filter((_, i) => i !== index))
    }

    //   手順の管理
    function updateStep(index: number, value: string) {
        setSteps((prev) => {
        const newSteps = [...prev]
        newSteps[index] = value
        return newSteps
        })
    }

    //   手順欄の追加
    function addStep() {
        setSteps((prev) => [...prev, ''])
    }

    //   手順欄の削除
    function removeStep(index: number) {
        setSteps((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="min-h-screen bg-amber-200 ">
            <div className="max-w-3xl mx-auto py-12 px-5 bg-white rounded">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">レシピを作成</h1>

                <form onSubmit={handleSubmit}>
                {/* タイトル */}
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">タイトル</label>
                    <input
                        type="text"
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="例）おいしいカレー"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* 画像アップロード */}
                <div className="mb-8">
                    <label className="block mb-2 font-semibold text-gray-700">メイン画像</label>
                    <input type="file" name='image' accept="image/*" onChange={handleImageChange} className='rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400'/>
                    {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="プレビュー画像"
                        className="mt-4 max-w-xs rounded-md border border-gray-300 shadow-sm"
                    />
                    )}
                </div>

                {/* 材料 */}
                <div className="mb-8">
                    <label className="block mb-2 font-semibold text-gray-700">材料</label>
                    {ingredients.map((ingredient, i) => (
                        <div key={i} className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="材料名"
                                value={ingredient.name}
                                onChange={(e) => updateIngredient(i, 'name', e.target.value)}
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <input
                                type="text"
                                placeholder="量"
                                value={ingredient.amount}
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

                {/* 手順 */}
                <div className="mb-8">
                    <label className="block mb-2 font-semibold text-gray-700">手順</label>
                    {steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2 mb-3">
                            <textarea
                                rows={2}
                                placeholder={`手順 ${i + 1}`}
                                value={step}
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

                <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
                <input type="hidden" name="steps" value={JSON.stringify(steps)} />

                {/* 送信ボタン*/}
                <button
                    type="submit"
                    className="w-full py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500"
                >
                    保存
                </button>
                </form>
            </div>
        </div>
  )
}
