import { Routes } from '@angular/router';
import { AuthPageGuard } from '../core/guards/auth-page.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('../auth/login/login.module').then((m) => m.LoginModule),
      canActivate: [AuthPageGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('../auth/register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'counselor-sign-up',
    loadChildren: () =>
    import('../auth/counselor-signup/counselor-signup.module').then(m => m.CounselorSignUpModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('../auth/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: 'invite-project',
    loadChildren: () =>
      import('../auth/invite-project/invite-project.module').then(
        (m) => m.InviteProjectModule
      ),
  },
];
