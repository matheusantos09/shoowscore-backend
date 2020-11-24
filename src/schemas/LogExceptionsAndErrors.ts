import { Document, model, Schema } from 'mongoose';

interface LogExceptionsAndErrorsInterface extends Document {
  query: string;
  results: object;
  total_results: number;
}

const LogExceptionsAndErrorsSchema = new Schema({
  resource: String,
  status_code: Number,
  app_code: Number,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<LogExceptionsAndErrorsInterface>(
  'LogExceptionsAndErrors',
  LogExceptionsAndErrorsSchema,
  'logs_exceptions'
);
