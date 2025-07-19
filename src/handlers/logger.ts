import colors from "colors";

function success(message: string): void {
  console.log(colors.green(`[SUCCESS] ${message}`));
}

function error(message: string): void {
  console.log(colors.red(`[ERROR] ${message}`));
}

function info(message: string): void {
  console.log(colors.blue(`[INFO] ${message}`));
}
export default { success, error, info };