export interface IDBDate {
  created_at: Date;
  updated_at: Date;
}

export type TDBResponce<Result> = Promise<Result & IDBDate>;

export interface IApiResponse<TDBResp> {
  data: TDBResp | null;
  ok: boolean;
  meta: Record<string, any> | null;
  errors: string[] | null;
  message: string | null;
}

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  password: string;
}

export enum EPermissionActionRestriction {
  OWN = 'own',
  ANY = 'any',
}

export interface IPermission {
  id: number;
  resource: string;
  action: string;
  attributes: string;
}

export interface IUserSession {
  id: number;
}
