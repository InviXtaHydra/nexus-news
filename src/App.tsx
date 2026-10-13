import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { BookmarkProvider } from './context/BookmarkContext'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchPage } from './pages/SearchPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="article/:slug" element={<ArticlePage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BookmarkProvider>
    </ThemeProvider>
  )
}
