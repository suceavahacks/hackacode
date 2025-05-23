import test from "node:test"
import { z } from "zod"

export const problemSchema = z.object({
  id: z.number().optional(),
  created_at: z.date().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  time_limit: z.number(),
  memory_limit: z.number(),
  input_description: z.string().optional(),
  output_description: z.string().optional(),
  constraints: z.string().optional(),
  notes: z.string().optional(),
  solution_code: z.string().min(3, "Solution code is required"),
  solution_explanation: z.string().optional(),
  success_rate: z.number().optional(),
  submission_count: z.number().optional(),
  accepted_count: z.number().optional(),
  test_cases: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
    })
  ),
})

export type Problem = z.infer<typeof problemSchema>
