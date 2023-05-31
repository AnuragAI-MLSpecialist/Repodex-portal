import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface StaticPagesDocument extends mongoose.Document {
    name: string;
    description?: string;
    is_active: boolean;
    _deleted: boolean;
}

const StaticPagesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

StaticPagesSchema.plugin(mongoosePagination);
export const StaticPagesModel = mongoose.model<StaticPagesDocument, Pagination<StaticPagesDocument>>(
    'static_page',
    StaticPagesSchema
);
