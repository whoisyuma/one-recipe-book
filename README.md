# One Recipe Book
> You can find the English version of this README below.
> この README の英語版は下の方にあります。

## プロジェクト概要

**Next.js (App Router)とSupabase**で構築した、マイレシピ帳アプリです。
ユーザー登録・ログイン機能付きで、自分だけのレシピを作成・編集・削除・一覧表示・詳細表示できます。

## 使用技術

- **フレームワーク：** Next.js(App Router), React
- **認証：** Supabase Auth
- **データベース：** Supabase
- **言語：** Typescript
- **スタイル：** Tailwind CSS

## 主な機能

- ユーザー認証（サインアップ/ログイン）
- 自分専用のレシピ一覧ページ
- レシピの詳細ページ
- レシピの作成・編集・削除機能
- フォルダ機能
- SupabaseのRLSで、他のユーザーのレシピにはアクセス不可
- モバイル対応（レスポンシブデザイン）
- 材料・作り方は1つずつ追加可能な入力方式

## 学んだこと・工夫したこと

- SupabaseのRLSを使って、ユーザーごとのデータ管理を安全に実装できた。
- Next.jsのServer Actionsとコンポーネントの使い分けを実装できた。
- Supabaseでの認証フローの実装と取り扱い。
- データベースはマイグレーションで管理を行った。
- 画像のアップロードとストレージの連携
- Tailwind CSSを使って、レスポンシブデザインで実装した。
- 材料や作り方は配列で扱うことで、1つずつ追加できるようにした。

## 追加したい機能

- 英語対応にする。
- ~~フォルダわけができるようにする。（例えば、中華レシピや日本食など）~~（実装済み）
- レシピや材料で検索できるようにする。
- レシピの一般公開と非公開に分類できるようにする。
- ~~ログアウト機能をつける~~（実装済み）
- コメントやレビュー、いいね機能の追加

## 公開サイト
こちらからデプロイ後のサイトをご覧いただけます：
[https://one-recipe-book.vercel.app/login](https://one-recipe-book.vercel.app/login)

## デモアカウントでログイン体験できます

このアプリにはデモ用アカウントを用意しています。以下の情報でログインして、レシピ投稿や編集・削除などを自由に試してみてください。

| メールアドレス         | パスワード    |
|------------------------|---------------|
| demo@example.com       | demo1234      |

投稿内容は随時削除される可能性があります。自由に使ってください。


## デザイン

### モバイル版
![モバイル版のデザイン例](/public/images/mockup1.png)

### デスクトップ版
![デスクトップ版のデザイン例](/public/images/mockup2.png)

## 連絡先
以下から気軽にご連絡ください：
- E-mail: [whoisyuma.0913@gmail.com](whoisyuma.0913@gmail.com)

## 備考
このアプリは学習用として作成しました。

# One Recipe Book

## Project Overview

This is a personal recipe book app built with **Next.js (App Router)** and **Supabase**.  
It includes user authentication, and allows users to create, edit, delete, view, and manage their own recipes.

## Technologies Used

- **Framework:** Next.js (App Router), React  
- **Authentication:** Supabase Auth  
- **Database:** Supabase  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  

## Key Features

- User authentication (Sign Up / Login)
- Personalized recipe list for each user
- Recipe detail pages
- Create, edit, and delete recipes
- Secure data access using Supabase RLS (Row-Level Security)
- Mobile-friendly (Responsive Design)
- Ingredients and instructions can be added one by one

## What I Learned & Key Highlights

- Implemented secure user-specific data handling using Supabase's RLS
- Separated logic between Server Actions and UI components in Next.js
- Implemented and managed authentication flow with Supabase
- Managed the database schema using migrations
- Enabled image uploads and integrated with Supabase Storage
- Built a fully responsive UI with Tailwind CSS
- Allowed users to add ingredients and steps as arrays, one at a time

## Planned Features

- English localization
- Folder categorization (e.g., Chinese dishes, Japanese food, etc.)
- Search functionality for recipes and ingredients
- Toggle between public and private recipe visibility
- Logout functionality
- Add comments, reviews, and like features

## Live Site

You can try the deployed version here:  
[https://one-recipe-book.vercel.app/login](https://one-recipe-book.vercel.app/login)

## Try with a Demo Account

A demo account is available so you can test all the features like posting, editing, and deleting recipes.

| Email                | Password  |
|----------------------|-----------|
| demo@example.com     | demo1234  |

*Note: Demo content may be deleted at any time. Feel free to explore.*

## Design

### Mobile View  
![Mobile Mockup](/public/images/mockup1.png)

### Desktop View  
![Desktop Mockup](/public/images/mockup2.png)

## Contact

Feel free to reach out:  
- Email: [whoisyuma.0913@gmail.com](mailto:whoisyuma.0913@gmail.com)

## Notes

This application was developed for learning purposes.
