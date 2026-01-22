import { Types } from 'mongoose';

function toStr(id) {
  return id?.toString();
}

export function requireOwnership({
  Model,
  ownerField,
  idParam = 'id',
  attachAs = null,
  notFoundMessage = 'Resource not found',
  forbiddenMessage = 'Forbidden',
} = {}) {
  if (!Model) throw new Error('requireOwnership: Model is required');
  if (!ownerField) throw new Error('requireOwnership: ownerField is required');

  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];

      if (!Types.ObjectId.isValid(resourceId)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const doc = await Model.findById(resourceId);
      if (!doc) return res.status(404).json({ message: notFoundMessage });

      const ownerId = toStr(doc[ownerField]);
      const userId = toStr(req.user?._id);

      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      if (ownerId !== userId) return res.status(403).json({ message: forbiddenMessage });

      if (attachAs) req[attachAs] = doc;

      next();
    } catch (err) {
      next(err);
    }
  };
}
