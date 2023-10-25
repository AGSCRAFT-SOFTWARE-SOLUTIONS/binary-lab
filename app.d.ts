// app.d.ts
/// <reference types="lucia" />

type UserSchema = {
  id: string;
} & Lucia.DatabaseUserAttributes;

type SessionSchema = {
  id: string;
  active_expires: number;
  idle_expires: number;
  user_id: string;
} & Lucia.DatabaseSessionAttributes;

type KeySchema = {
  id: string;
  user_id: string;
  hashed_password: string | null;
};

declare namespace Lucia {
  type Auth = import("../src/lib/auth/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
