const Joi = require("joi");

const TaskSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid("pending", "completed", "deleted").required(),
  userId: Joi.number().required(),
});

export default TaskSchema;
