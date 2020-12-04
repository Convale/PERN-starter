const standardPermissions = {
  regular: {
    static: ["read:basicUser"],
    // dynamic: {
    //   "posts:edit": ({userId, postOwnerId}) => {
    //     if (!userId || !postOwnerId) return false;
    //     return userId === postOwnerId;
    //   }
    // }
  },
  admin: {
    static: ["read:basicUser", "read:adminUser"],
  },
};

export default standardPermissions;
