import Link from 'next/link'
import { MintDialog } from './MintDialog'

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-3xl mx-auto py-4 sm:py-6 lg:py-8 bg-[#2f1d74]">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-3xl font-bold font-[family-name:var(--font-geist-sans)] text-white"
            >
              PeaqPunks
            </Link>
          </div>
          <MintDialog />
        </div>
      </div>
    </header>
  )
}

export default Header 