export class InviteMemberDto {
  email: string;
  teamId: string;
  role: 'user' | 'admin';
}
