import { EPermissionActionRestriction, IPermission } from '@itypes/model.type';

export class PermissionService {
  public generatePermission(
    actionRestriction: EPermissionActionRestriction,
    resource: string,
    actions: string[],
    attributes?: Record<string, any>,
    actionRestrictionOptions?: Record<string, any>,
  ) {
    return actions.reduce<Omit<IPermission, 'id'>[]>((acc, cur) => {
      return [
        ...acc,
        {
          action: `${cur}:${actionRestrictionOptions && actionRestrictionOptions[cur] ? actionRestrictionOptions[cur] : actionRestriction}`,
          attributes: attributes && attributes[cur] ? attributes[cur] : '*',
          resource,
        },
      ];
    }, []);
  }
}
