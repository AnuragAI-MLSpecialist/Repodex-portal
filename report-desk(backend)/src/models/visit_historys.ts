import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface VisitHistoryDocument extends mongoose.Document {
    user_id: mongoose.Types.ObjectId;
    is_active: boolean;
    _deleted: boolean;
}

const VisitHistorySchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'users' },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

VisitHistorySchema.plugin(mongoosePagination);
export const VisitHistoryModel = mongoose.model<VisitHistoryDocument, Pagination<VisitHistoryDocument>>(
    'visit_history',
    VisitHistorySchema
);
