/// <reference types="lucia" />

declare namespace Lucia {
  type Auth = import("./lucia.ts").Auth;
  type DatabaseUserAttributes = {
    name: string;
    phone: string;
    location: string;
    institute: string;
  };
  type DatabaseSessionAttributes = {};
}
