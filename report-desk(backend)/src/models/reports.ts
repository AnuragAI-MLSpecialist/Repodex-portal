import * as mongoose from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
export interface ReportDocument extends mongoose.Document {
    name: string;
    description: string;
    type: 'Whitepaper' | 'Research Report' | 'Research Paper' | 'Infographic' | 'Press Release' | 'Survey';
    format: 'pdf' | 'png';
    region: 'North America' | 'Global' | 'Europe' | 'Middle East' | 'APAC';
    country: string;
    regions: any;
    countries: any;
    published_year: number;
    category_id: mongoose.Types.ObjectId;
    sub_category_id: mongoose.Types.ObjectId;
    is_free: boolean;
    report_filename: string;
    report_url: string;
    thumb_report_filename: string;
    thumb_report_url: string;
    report_upload_date: Date;
    views: number;
    is_active: boolean;
    _deleted: boolean;
}

const ReportSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        type: {
            type: String,
            required: true,
            enum: ['Whitepaper', 'Research Report', 'Research Paper', 'Infographic', 'Press Release', 'Survey']
        },
        format: {
            type: String,
            required: true,
            enum: ['pdf', 'png']
        },
        region: {
            type: String,
            required: false,
            enum: ['North America', 'Global', 'Europe', 'Middle East', 'APAC']
        },
        country: { type: String, required: false },
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
        category_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'categories' },
        sub_category_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'categories' },
        published_year: { type: Number, required: true },
        report_filename: { type: String, required: true },
        report_url: { type: String, required: true },
        thumb_report_filename: { type: String, required: false },
        thumb_report_url: { type: String, required: false },
        is_free: { type: Boolean, required: false, default: true },
        report_upload_date: { type: Date, required: true },
        views: { type: Number, required: false, default: 0 },
        is_active: { type: Boolean, default: true },
        _deleted: { type: Boolean, required: false, default: false }
    },
    { timestamps: true }
);

ReportSchema.plugin(mongoosePagination);

// ReportSchema.index({name: 'text'});
export const ReportModel = mongoose.model<ReportDocument, Pagination<ReportDocument>>('reports', ReportSchema);
