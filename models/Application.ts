import mongoose, { Schema, model, models } from 'mongoose';

const ApplicationSchema = new Schema({
  companyName: {
    type: String,
    required: [true, 'Nama perusahaan wajib diisi']
  },
  position: {
    type: String,
    required: [true, 'Posisi wajib diisi']
  },
  owner: {
    type: String,
    enum: ['Edi', 'Anis'],
    required: [true, 'Pemilik data wajib ditentukan']
  },
  source: {
    type: String,
    enum: ['LinkedIn', 'Instagram', 'Email', 'Form', 'Lainnya'],
    default: 'LinkedIn'
  },
  linkPostingan: { type: String, default: "" },
  fotoPoster: { type: String, default: "" },
  status: {
    type: String,
    enum: ['Rencana', 'Terkirim', 'Wawancara', 'Ditolak', 'Diterima'],
    default: 'Terkirim'
  },
  interviewDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Application = models.Application || model('Application', ApplicationSchema);
export default Application;