import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface CategoryDocument extends mongoose.Document {
    name: string;
    description: string;
    category_id?: mongoose.Types.ObjectId;
    total_reports: number;
    is_active: boolean;
    _deleted: boolean;
}

const CategoriesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'categories' },
        description: { type: String, required: false },
        total_reports: { type: Number, required: false, default: 0 },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

CategoriesSchema.plugin(mongoosePagination);
export const CategoryModel = mongoose.model<CategoryDocument, Pagination<CategoryDocument>>(
    'categories',
    CategoriesSchema
);
