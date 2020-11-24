import { Document, model, Schema } from 'mongoose';

interface LogConsultsInterface extends Document {
  query: string;
  results: object;
  total_results: number;
}

const LogConsultsSchema = new Schema({
  message: String,
  resource: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<LogConsultsInterface>(
  'LogConsults',
  LogConsultsSchema,
  'logs_consults'
);
