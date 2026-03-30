export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Newsa yonetim paneline hos geldiniz.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Toplam Haber', value: '0', color: 'bg-blue-50 text-blue-700' },
          { label: 'Yayinda', value: '0', color: 'bg-green-50 text-green-700' },
          { label: 'Taslak', value: '0', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Incelemede', value: '0', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color} inline-block rounded px-2 py-0.5`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
