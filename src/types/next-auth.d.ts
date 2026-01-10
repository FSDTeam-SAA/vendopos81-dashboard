import "next-auth";

declare module "next-auth" {
  interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: {
      url?: string;
    };
  }

  interface Session {
    user: User & {
      image?: {
        url?: string;
      };
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: {
      url?: string;
    };
  }
}
