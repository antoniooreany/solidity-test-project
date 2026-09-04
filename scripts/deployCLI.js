export async function executeDeploymentCommand({ env, defaults, dependencies }) {
  try {
    const { request, credentials } = dependencies.parseDeploymentEnvironment(env, defaults);

    const runtimeResult = await dependencies.runDeployment({
      request,
      credentials,
      dependencies: {},
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
