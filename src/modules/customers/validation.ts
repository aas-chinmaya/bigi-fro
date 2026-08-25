import { z } from "zod";

// Helper: Validate mobile number format
const mobileRegex = /^[0-9]{10}$/;

// Main customer validation schema
export const customerSchema = z.object({
  // Business Information
  businessId: z.string().min(1, "Business ID is required"),
  branchId: z.string().min(1, "Branch ID is required"),

  // Basic Information
  customerCode: z.string().optional(),
  customerType: z.enum(["WALK_IN", "REGULAR", "WHOLESALE"]),
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  companyName: z.string().optional(),

  // Contact Information
  mobile: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(mobileRegex, "Invalid mobile number format"),
  alternateMobile: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),

  // Tax Information
  gstin: z.string().optional(),
  pan: z.string().optional(),

  // Credit Information
  creditLimit: z.number().nonnegative("Credit limit cannot be negative"),
  creditDays: z.number().min(0, "Credit days cannot be negative"),
  openingBalance: z.number().nonnegative("Opening balance cannot be negative"),
  outstandingBalance: z.number().nonnegative("Outstanding balance cannot be negative"),
  rewardPoints: z.number().min(0, "Reward points cannot be negative"),

  // Status
  isActive: z.boolean(),

  // Notes
  notes: z.string().optional(),
});

// Export the inferred type for form data
export type CustomerFormData = z.infer<typeof customerSchema>;
