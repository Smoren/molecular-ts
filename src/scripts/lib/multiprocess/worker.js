process.on('message', async (msg) => {
  const { taskCode, input, taskId } = msg;

  try {
    const taskFunc = eval(`(${taskCode})`);
    const result = await taskFunc(input);
    process.send({ taskId, result });
  } catch (error) {
    process.send({ taskId, error: error.message || error.toString() });
  }
});
