import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--pumpkin-cream)' }}>
      <Header userEmail={user?.email} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="text-7xl mb-5">🎃</div>
        <h1 className="text-4xl font-black mb-3" style={{ color: 'var(--pumpkin-dark)' }}>
          호박마켓
        </h1>
        <p className="text-lg mb-2" style={{ color: 'var(--brown-muted)' }}>
          동네 이웃과 함께하는 따뜻한 중고거래
        </p>
        <p className="text-sm mb-10" style={{ color: 'var(--brown-muted)' }}>
          소박하고 친근하게, 필요한 물건을 사고팔아요
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href="/products"
            className="btn-pumpkin text-center no-underline py-3.5 text-base">
            🛒 판매글 보러가기
          </Link>
          {!user && (
            <Link href="/auth/signup"
              className="btn-outline text-center no-underline py-3.5 text-base">
              회원가입
            </Link>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-sm w-full mt-14">
          {[
            { icon: '🏘️', label: '동네 직거래' },
            { icon: '💛', label: '따뜻한 나눔' },
            { icon: '🌿', label: '지속 가능' },
          ].map((item) => (
            <div key={item.label} className="card-pumpkin py-4 text-center">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-bold" style={{ color: 'var(--brown-muted)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-5 text-xs" style={{ color: 'var(--brown-muted)' }}>
        © 2026 호박마켓 · 따뜻한 중고거래
      </footer>
    </div>
  )
}
