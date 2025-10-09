import EditForm from './EditForm'

interface PageProps {
    params: Promise<{id: string}>
}

export default async function EditRecipePage({ params }: PageProps) {
    const { id: recipeId } = await params;

    return (
        <div className="min-h-screen bg-amber-200 py-5 md:py-15">
            <div className="max-w-3xl mx-2 md:mx-auto py-12 px-5 bg-white rounded">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">レシピを編集</h1>

                <EditForm recipeId={recipeId}/>
            </div>
        </div>
    )
}
