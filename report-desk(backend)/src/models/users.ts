import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
import bcrypt from 'bcrypt';

export interface UserDocument extends mongoose.Document {
    first_name: string;
    last_name?: string;
    phone?: string;
    email: string;
    company_name?: string;
    country: string;
    password: string;
    profile_pic_url?: string;
    is_email_verified?: string;
    verify_code?: string;
    verify_created_at?: string;
    forgot_code?: string;
    forgot_created_at?: string;
    is_active: boolean;
    _deleted: boolean;
}

const UsersSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: false },
        phone: { type: String, required: false },
        email: { type: String, required: true },
        company_name: { type: String, required: false },
        country: { type: String, required: true },
        password: { type: String, required: true },
        profile_pic_url: { type: String, required: false },
        is_email_verified: { type: Boolean, default: false },
        verify_code: { type: String, required: false },
        verify_created_at: { type: Date, required: false },
        forgot_code: { type: String, required: false },
        forgot_created_at: { type: Date, required: false },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

UsersSchema.pre('save', async function (next) {
    // const user = this as UserDocument;
    const user = this;

    if (this.isModified('password') || this?.isNew) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// UsersSchema.pre('updateOne', async function (next) {
//     const user = this as UserDocument;

//     if (this.isModified('password') || this?.isNew) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

UsersSchema.plugin(mongoosePagination);
export const UserModel = mongoose.model<UserDocument, Pagination<UserDocument>>('users', UsersSchema);
