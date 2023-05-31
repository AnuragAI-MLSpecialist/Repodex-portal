import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface SearchHistoryDocument extends mongoose.Document {
    text: string;
    user_id: mongoose.Types.ObjectId;
    is_active: boolean;
    _deleted: boolean;
}

const SearchHistorySchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'users' },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

SearchHistorySchema.plugin(mongoosePagination);
export const SearchHistoryModel = mongoose.model<SearchHistoryDocument, Pagination<SearchHistoryDocument>>(
    'search_history',
    SearchHistorySchema
);
