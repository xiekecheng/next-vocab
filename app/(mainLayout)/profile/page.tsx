import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">个人中心</h1>
          <p className="text-muted-foreground">管理你的个人信息和账户设置</p>
        </div>
        
        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}
