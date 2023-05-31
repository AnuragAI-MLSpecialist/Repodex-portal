import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface AdminDocument extends mongoose.Document {
    email: string;
    password: string;
    forgot_code?: string;
    forgot_created_at?: string;
    is_active: boolean;
    _deleted: boolean;
}

const AdminsSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        forgot_code: {
            type: String,
            required: false
        },
        forgot_created_at: { type: Date, required: false },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

AdminsSchema.pre('save', async function (next) {
    const admin = this as AdminDocument;

    if (this.isModified('password') || this?.isNew) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

AdminsSchema.plugin(mongoosePagination);
export const AdminModel = mongoose.model<AdminDocument, Pagination<AdminDocument>>('admins', AdminsSchema);
