import { ProductList } from '@/components/ProductList'

export default async function Home() {
  return (
    <div className='w-screen h-screen flex justify-center items-start'>
      <ProductList />
    </div>
  )
}
