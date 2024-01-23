const ClerkLayout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className="bg-slate-100 h-full flex items-center justify-center">
      {children}
    </div>
  )
}

export default ClerkLayout;