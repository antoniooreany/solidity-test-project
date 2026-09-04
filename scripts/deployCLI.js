export async function executeDeploymentCommand({ env, defaults, dependencies }) {
  const { parseDeploymentEnvironment, runDeployment, runtimeDependencies } = dependencies;

  try {
    const { request, credentials } = parseDeploymentEnvironment(env, defaults);

    const runtimeResult = await runDeployment({
      request,
      credentials,
      dependencies: runtimeDependencies ?? {},
    });

    if (runtimeResult.success) {
      return {
        exitCode: 0,
        result: {
          success: true,
          phase: runtimeResult.phase,
        },
      };
    } else {
      return {
        exitCode: 1,
        result: runtimeResult,
      };
    }
  } catch {
    return {
      exitCode: 1,
      result: {
        success: false,
        phase: 'runtime',
        code: 'DEPLOYMENT_CLI_FAILED',
        message: 'Deployment command failed.',
      },
    };
  }
}
