import { Context } from 'koa';

export async function isLoggedIn(ctx: Context, next) {
  const { user } = ctx.state;

  if (!user) {
    throw new Error('Not logged in.');
  }

  await next();
}
