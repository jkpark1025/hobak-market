import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Link from 'next/link'

const CATEGORIES = ['전체', '디지털/가전', '가구/인테리어', '의류/패션', '도서/음반', '스포츠/레저', '생활/주방', '식물/반려동물', '기타']

const STATUS_LABEL: Record<string, string> = { selling: '판매중', reserved: '예약중', sold: '거래완료' }
const STATUS_COLOR: Record<string, string> = { selling: '#5D8A3C', reserved: '#E8650A', sold: '#999' }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const [{ data: { user } }, productsResult] = await Promise.all([
    supabase.auth.getUser(),
    (() => {
      let query = supabase
        .from('products')
        .select('id, title, price, category, status, created_at, seller:profiles!products_user_id_profiles_fkey(nickname)')
        .order('created_at', { ascending: false })
      if (category && category !== '전체') {
        query = query.eq('category', category)
      }
      return query
    })(),
  ])

  const products = productsResult.data ?? []

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--pumpkin-cream)' }}>
      <Header userEmail={user?.email} />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 py-6">

        {/* 페이지 타이틀 + 글쓰기 버튼 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-black" style={{ color: 'var(--pumpkin-dark)' }}>
            판매글 목록
          </h1>
          {user && (
            <Link href="/products/new"
              className="no-underline text-sm font-bold text-white px-4 py-2 rounded-xl transition-all"
              style={{ background: 'linear-gradient(135deg, #E8650A, #C24A00)' }}>
              + 판매글 쓰기
            </Link>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = (!category && cat === '전체') || category === cat
            return (
              <Link
                key={cat}
                href={cat === '전체' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                className="no-underline flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold border-2 transition-all"
                style={isActive ? {
                  background: 'var(--pumpkin)',
                  color: '#fff',
                  borderColor: 'var(--pumpkin)',
                } : {
                  background: '#fff',
                  color: 'var(--brown-muted)',
                  borderColor: 'var(--pumpkin-border)',
                }}
              >
                {cat}
              </Link>
            )
          })}
        </div>

        {/* 상품 목록 */}
        {products.length === 0 ? (
          <div className="card-pumpkin py-20 text-center">
            <div className="text-5xl mb-4">🎃</div>
            <p className="font-bold mb-1" style={{ color: 'var(--brown-text)' }}>
              {category ? `'${category}' 카테고리에 판매글이 없어요` : '아직 판매글이 없어요'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--brown-muted)' }}>
              첫 번째 판매글을 올려보세요!
            </p>
            {user ? (
              <Link href="/products/new"
                className="btn-pumpkin no-underline inline-block px-8 py-3 text-sm" style={{ width: 'auto' }}>
                판매글 쓰기
              </Link>
            ) : (
              <Link href="/auth/login"
                className="btn-pumpkin no-underline inline-block px-8 py-3 text-sm" style={{ width: 'auto' }}>
                로그인하고 시작하기
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: 'var(--brown-muted)' }}>
              총 {products.length}개의 판매글
            </p>
            <div className="flex flex-col gap-0 rounded-2xl overflow-hidden"
              style={{ border: '1.5px solid var(--pumpkin-border)' }}>
              {products.map((product, idx) => {
                const seller = product.seller as { nickname?: string } | null
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="no-underline bg-white hover:bg-orange-50 transition-colors px-4 py-4 flex items-center gap-4"
                    style={idx !== products.length - 1
                      ? { borderBottom: '1px solid var(--pumpkin-border)' }
                      : {}}
                  >
                    {/* 썸네일 */}
                    <div className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl"
                      style={{ background: 'var(--pumpkin-pale)' }}>
                      🎃
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate mb-1" style={{ color: 'var(--brown-text)' }}>
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${STATUS_COLOR[product.status]}18`,
                            color: STATUS_COLOR[product.status],
                          }}>
                          {STATUS_LABEL[product.status]}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--brown-muted)' }}>
                          {product.category}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--brown-muted)' }}>
                        {seller?.nickname ?? '알 수 없음'} ·{' '}
                        {new Date(product.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>

                    {/* 가격 */}
                    <div className="text-right flex-shrink-0">
                      <p className="font-black"
                        style={{ color: product.price === 0 ? 'var(--leaf-green)' : 'var(--brown-text)' }}>
                        {product.price === 0 ? '나눔' : `${product.price.toLocaleString()}원`}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
