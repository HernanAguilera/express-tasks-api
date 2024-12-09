const Joi = require("joi");

const TaskSchema = Joi.object({
  id: Joi.number(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid("pending", "in progress", "completed"),
  userId: Joi.number().required(),
  createdAt: Joi.string(),
  updatedAt: Joi.string(),
});

export default TaskSchema;
