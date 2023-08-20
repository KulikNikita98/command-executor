import inquirer from "inquirer";
import { PromptType } from "./prompt.types";

export class PromptService {
  public async input<T>(type: PromptType, message: string) {
    const { result } = await inquirer.prompt<{
      result: T;
    }>([
      {
        type,
        name: "result",
        message,
      },
    ]);
    return result;
  }
}
