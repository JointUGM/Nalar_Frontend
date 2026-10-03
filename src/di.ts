import { SignInUseCase } from '@/application/sign-in-use-case'
import { ActivateAccountUseCase } from '@/application/activate-account-use-case'
import { SignOutUseCase } from '@/application/sign-out-use-case'
import { ObserveAuthSessionUseCase } from '@/application/observe-auth-session-use-case'
import { GetCurrentIdentityUseCase } from '@/application/get-current-identity-use-case'
import { HttpIdentityRepository } from '@/infrastructure/services/HttpIdentityRepository'
import { HttpLiveService } from '@/infrastructure/services/HttpLiveService'
import { LiveUseCases } from '@/application/live-use-cases'
import { HttpApi } from '@/infrastructure/services/HttpApi'
import { HttpParentService } from '@/infrastructure/services/HttpParentService'
import { ParentUseCases } from '@/application/parent-use-cases'
import { HttpStudentService } from '@/infrastructure/services/HttpStudentService'
import { StudentUseCases } from '@/application/student-use-cases'
import { HttpTeacherService } from '@/infrastructure/services/HttpTeacherService'
import { TeacherUseCases } from '@/application/teacher-use-cases'
import { HttpKnowledgeBaseService } from '@/infrastructure/services/HttpKnowledgeBaseService'
import { KnowledgeBaseUseCases } from '@/application/knowledge-base-use-cases'
import type { AccountDependencies } from '@/ui/pages/account/AccountDependencies'

export interface PublicAppConfig { apiBaseUrl?: string }

function resolveApiBaseUrl(input?: string): string | null {
  if (input?.trim() === '/api/v1') return '/api/v1'
  try {
    const url = new URL(input?.trim() ?? '')
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash || url.pathname !== '/api/v1') return null
    return '/api/v1'
  } catch { return null }
}

export async function createDependencies(config: PublicAppConfig): Promise<{ account: AccountDependencies | null; live: LiveUseCases | null; parent: ParentUseCases | null; student: StudentUseCases | null; teacher: TeacherUseCases | null; knowledgeBase: KnowledgeBaseUseCases | null; dispose: () => Promise<void> }> {
  const apiBaseUrl = resolveApiBaseUrl(config.apiBaseUrl)
  if (!apiBaseUrl) return { account: null, live: null, parent: null, student: null, teacher: null, knowledgeBase: null, dispose: async () => {} }
  const { HttpAuthService } = await import('@/infrastructure/services/HttpAuthService')
  const auth = new HttpAuthService({ apiBaseUrl })
  const api = new HttpApi({ apiBaseUrl })
  return {
    live: new LiveUseCases(new HttpLiveService({ apiBaseUrl })),
    parent: new ParentUseCases(new HttpParentService(api)),
    student: new StudentUseCases(new HttpStudentService(api)),
    teacher: new TeacherUseCases(new HttpTeacherService(api)),
    knowledgeBase: new KnowledgeBaseUseCases(new HttpKnowledgeBaseService(api)),
    account: {
      activate: new ActivateAccountUseCase(auth),
      signIn: new SignInUseCase(auth), signOut: new SignOutUseCase(auth), session: new ObserveAuthSessionUseCase(auth),
      identity: new GetCurrentIdentityUseCase(new HttpIdentityRepository({ apiBaseUrl })),
    },
    dispose: async () => { auth.dispose() },
  }
}
