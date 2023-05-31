import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

export interface UserReportDownloadDocument extends mongoose.Document {
    report_id: mongoose.Types.ObjectId;
    category_id: mongoose.Types.ObjectId;
    sub_category_id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    downloaded_at: Date;
    region: 'North America' | 'Global' | 'Europe' | 'Middle East' | 'APAC';
    country: string;
    type: 'Whitepaper' | 'Research Report' | 'Research Paper' | 'Infographic' | 'Press Release' | 'Survey';
    regions: any;
    countries: any;
    _deleted: boolean;
}

const UserReportDownloadSchema = new mongoose.Schema(
    {
        report_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'reports' },
        category_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'categories' },
        sub_category_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'categories' },
        region: {
            type: String,
            required: false,
            enum: ['North America', 'Global', 'Europe', 'Middle East', 'APAC']
        },
        country: { type: String, required: false },
        type: {
            type: String,
            required: true,
            enum: ['Whitepaper', 'Research Report', 'Research Paper', 'Infographic', 'Press Release', 'Survey']
        },
        countries: [
            {
                country: { type: String, required: false }
            }
        ],
        regions: [
            {
                region: {
                    type: String,
                    required: false,
                    enum: ['North America', 'Global', 'Europe', 'Middle East', 'APAC']
                }
            }
        ],
        user_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'users' },
        downloaded_at: { type: Date, required: false, default: Date.now },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

UserReportDownloadSchema.plugin(mongoosePagination);

export const UserReportDownloadModel = mongoose.model<
    UserReportDownloadDocument,
    Pagination<UserReportDownloadDocument>
>('user_report_download', UserReportDownloadSchema);
