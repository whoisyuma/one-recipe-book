import Header from "./Header";

export default function RecipesLayout({children}: {children: React.ReactNode;}) {
    return (
        <div>
            <Header/>
            <main>{children}</main>
        </div>
    )
}