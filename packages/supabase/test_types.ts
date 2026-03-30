import { createServerClient } from './src/client/server'

async function test() {
  const supabase = await createServerClient()
  const { data: category } = await supabase.from('categories').select('*').eq('slug', 'test').single()
  if (category) {
    const x: string = category.id
    console.log(x)
  }
}
test()
