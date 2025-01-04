process.on('message', async (message) => {
  const { taskFunctionString, inputData, taskIndex } = message;
  const taskFunction = eval(`(${taskFunctionString})`);
  try {
    const result = await taskFunction(inputData);
    process.send({ result, inputData, taskIndex });
  } catch (error) {
    process.send({ error: error.toString(), inputData, taskIndex });
  }
});
