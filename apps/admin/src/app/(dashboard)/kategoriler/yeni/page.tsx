import { CategoryForm } from '../_components/CategoryForm'
import { PageHeader } from '@/components/PageHeader'

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader title="Yeni Kategori" />
      <CategoryForm />
    </div>
  )
}
