process.on('message', async (message) => {
  const { taskFunctionString, data } = message;
  const taskFunction = eval(`(${taskFunctionString})`);
  try {
    const result = await taskFunction(data);
    process.send({ result, data });
  } catch (error) {
    process.send({ error: error.toString(), data });
  }
});
