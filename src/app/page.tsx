import { ProductList } from '@/components/ProductList'

export default async function Home() {
  return (
    <div className='bg-teal-200 min-h-screen'>
      <ProductList />
    </div>
  )
}
