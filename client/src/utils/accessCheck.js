import standardPermissions from "./userRoles";

const accessCheck = (authUser, action) => {
  const { customPermissions } = authUser.userAccess;
  const permissions = standardPermissions[authUser.userAccess.baseType];

  if (!permissions) return false;

  const staticPermissions = permissions.static;

  if (staticPermissions && staticPermissions.includes(action)) return true;

  // const dynamicPermissions = permissions.dynamic;

  // if (dynamicPermissions) {
  //   const permissionCondition = dynamicPermissions[action];
  //   if (!permissionCondition) {
  //     return false;
  //   }
  //   return permissionCondition(data);
  // }

  if (customPermissions && customPermissions.includes(action)) return true;

  return false;
};

export default accessCheck;
