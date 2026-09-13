export const aiMonitor = ({
  provider,
  startTime,
  success,
  total,
  error = null
}) => {

  const delay = Date.now() - startTime;

  console.log("------ AI MONITORING ------");

  console.log("Provider :", provider);
  console.log("Success  :", success);
  console.log("Delay    :", `${delay} ms`);
  console.log("Total    :", total);

  if (error) {
    console.log("Error    :", error.message);
  }

  console.log("---------------------------");

  return {
    provider,
    delay,
    success,
    total,
    error: error?.message || null
  };
};