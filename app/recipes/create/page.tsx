import RecipeCreateForm from "./RecipeCreateForm";

export default function RecipeCreatePage() {
    return (
        <div className="min-h-screen bg-amber-200 py-5 md:py-15">
            <div className="max-w-3xl mx-2 lg:mx-auto py-12 px-5 bg-white rounded">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">レシピを作成</h1>

                <RecipeCreateForm/>
            </div>
        </div>
  )
}
