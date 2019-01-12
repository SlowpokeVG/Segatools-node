import * as _ from 'lodash';
import { ObjectID } from 'mongodb';
import { Context } from 'koa';

import { messagesCollection, namesCollection } from '../../mongo';

export async function findById(ctx: Context, next) {
  const messageId = ctx.params.id;

  const messageRecord = await messagesCollection().findOne({
    _id: new ObjectID(messageId)
  });

  if (!messageRecord) {
    throw new Error('Message not found.');
  }

  const prevMessageRecord = (await messagesCollection()
    .find({
      _id: { $lt: messageRecord._id },
      chapterName: messageRecord.chapterName
    })
    .sort({ _id: -1 })
    .limit(1)
    .toArray())[0];

  const nextMessageRecord = (await messagesCollection()
    .find({
      _id: { $gt: messageRecord._id },
      chapterName: messageRecord.chapterName
    })
    .sort({ _id: -1 })
    .limit(1)
    .toArray())[0];

  const nameRecords = await namesCollection()
    .find({
      nameId: {
        $in: messageRecord.nameIds
      }
    })
    .toArray();

  const result = {
    ...messageRecord,
    names: messageRecord.nameIds.map(nameId => {
      return _.find(nameRecords, { nameId }) || null;
    }),
    prevMessageId: _.get(prevMessageRecord, '_id', null),
    nextMessageId: _.get(nextMessageRecord, '_id', null)
  };

  ctx.body = result;
}