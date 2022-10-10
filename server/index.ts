import Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Reminder } from '../src/types';
import db from './dbconfig';

const app = new Koa();

// @ts-expect-error for some reason @types/koa-bodyparser is wrong on this one
app.use(bodyParser());

app.use(async (ctx, next) => {
  if (ctx.path === '/reminders' && ctx.method.toLowerCase() === 'post') {
    const reminder = ctx.request.body as Reminder;

    const result = await db.query(
      'INSERT INTO reminders (input, reminder, method, reminder_time) VALUES (?, ?, ?, ?)',
      [reminder.input, reminder.reminder, null, reminder.time]
    );

    if (!result.rowCount) {
      ctx.response.status = 400;
      ctx.body = JSON.stringify({ success: false, error: 'Failed to insert reminder' });
      ctx.app.emit('error', new Error('Failed to insert reminder'), ctx);
    } else {
      ctx.response.status = 200;
      ctx.body = JSON.stringify({ success: true });
    }
    return;
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening on port ${process.env.PORT || 3001}`);
});
