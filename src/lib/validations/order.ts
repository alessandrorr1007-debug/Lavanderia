import {z} from "zod";
export const orderDraftSchema=z.object({customerId:z.string().uuid(),serviceId:z.string().uuid(),quantity:z.number().positive(),notes:z.string().max(1000).optional()});
