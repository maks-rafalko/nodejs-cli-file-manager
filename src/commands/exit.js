export const exit = async (executionContext) => {
    executionContext.readLine.close();
}