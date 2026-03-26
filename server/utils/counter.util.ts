import { CounterModel } from "@/server/models/counter.model";

export async function getNextSequence(name: string) {
  const counter = await CounterModel.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
    },
  );

  return counter.seq;
}
