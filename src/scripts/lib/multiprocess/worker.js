process.on('message', async (message) => {
  const { taskFunctionString, inputData } = message;
  const taskFunction = eval(`(${taskFunctionString})`);
  try {
    const result = await taskFunction(inputData);
    process.send({ result, inputData });
  } catch (error) {
    process.send({ error: error.toString(), inputData });
  }
});
