import { Link } from 'react-router-dom'

interface Props {
  className?: string
}

export default function Logo({ className = '' }: Props) {
  return (
    <Link to="/" className={`flex items-center gap-2 shrink-0 ${className}`} aria-label="ShopIQ Home">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="8" fill="#111" />
        <path d="M10 14L12 10H24L26 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 14V26C10 26.5304 10.2107 27.0391 10.5858 27.4142C10.9609 27.7893 11.4696 28 12 28H24C24.5304 28 25.0391 27.7893 25.4142 27.4142C25.7893 27.0391 26 26.5304 26 26V14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 18C14 19.0609 14.4214 20.0783 15.1716 20.8284C15.9217 21.5786 16.9391 22 18 22C19.0609 22 20.0783 21.5786 20.8284 20.8284C21.5786 20.0783 22 19.0609 22 18" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-extrabold text-xl tracking-tight text-black">
        Shop<span className="text-[#E53E3E]">IQ</span>
      </span>
    </Link>
  )
}
