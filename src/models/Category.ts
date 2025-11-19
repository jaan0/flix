import mongoose, { Schema, models } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
