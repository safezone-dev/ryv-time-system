export function isAdmin(
    role?: string
  ) {
    return role === "ADMIN";
  }
  
  export function isExecutive(
    role?: string
  ) {
    return role === "EXECUTIVE";
  }
  
  export function isCollaborator(
    role?: string
  ) {
    return (
      role ===
      "COLLABORATOR"
    );
  }