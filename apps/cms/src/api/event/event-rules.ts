import { errors } from '@strapi/utils';

const EVENT_UID = 'api::event.event';

/**
 * Refuse to save an event whose end date is before (or equal to) its start date —
 * such an event would never show. Runs on every create/update through the
 * document service (admin Content Manager and REST alike). Partial updates are
 * checked against the stored dates.
 */
export function registerEventDateValidation(strapi: any) {
  strapi.documents.use(async (ctx: any, next: () => Promise<unknown>) => {
    if (ctx.uid !== EVENT_UID || !['create', 'update'].includes(ctx.action)) return next();

    const data = ctx.params?.data ?? {};
    let { startDate, endDate } = data;
    if (ctx.action === 'update' && (startDate === undefined || endDate === undefined)) {
      const stored = await strapi.documents(EVENT_UID).findOne({
        documentId: ctx.params.documentId,
        locale: ctx.params.locale,
        fields: ['startDate', 'endDate'],
      });
      startDate = startDate === undefined ? stored?.startDate : startDate;
      endDate = endDate === undefined ? stored?.endDate : endDate;
    }

    if (startDate && endDate && Date.parse(endDate) <= Date.parse(startDate)) {
      throw new errors.ValidationError('End date must be after the start date.', {
        errors: [{ path: ['endDate'], message: 'End date must be after the start date.', name: 'ValidationError' }],
      });
    }
    return next();
  });
}

/**
 * Turn `showEvent` off on every event whose end date has passed, so the admin
 * matches what visitors see (the website already hides expired events).
 * Updates all rows of the document — draft and published, every locale.
 */
export async function switchOffExpiredEvents(strapi: any) {
  const { count } = await strapi.db.query(EVENT_UID).updateMany({
    where: { showEvent: true, endDate: { $lte: new Date() } },
    data: { showEvent: false },
  });
  if (count) strapi.log.info(`Events: switched off showEvent on ${count} expired row(s).`);
}

/** Run the expiry switch now and every 5 minutes. */
export function scheduleExpiredEventSwitch(strapi: any) {
  const run = () =>
    switchOffExpiredEvents(strapi).catch((e: unknown) => strapi.log.error(`Events: expiry switch failed: ${e}`));
  strapi.cron.add({ switchOffExpiredEvents: { task: run, options: { rule: '*/5 * * * *' } } });
  return run();
}
