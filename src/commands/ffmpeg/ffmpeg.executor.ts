import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { CommandExecutor } from "../../core/executor/command.executor.js";
import { IStreamLogger } from "../../core/handlers/stream-logger.interface";
import { IFfmpegInput } from "./ffmpeg.types";
import { FileService } from "../../core/files/file.service.js";
import { PromptService } from "../../core/prompt/prompt.service.js";
import { FfmpegBuilder } from "./ffmpeg.builder.js";
import { ICommandExecFfmpeg } from "./ffmpeg.types";
import { StreamHandler } from "../../core/handlers/stream.handler.js";

export class FfmpegExecutor extends CommandExecutor<IFfmpegInput> {
  private fileService: FileService = new FileService();
  private promptService: PromptService = new PromptService();

  constructor(logger: IStreamLogger) {
    super(logger);
  }
  protected async prompt(): Promise<IFfmpegInput> {
    const name = await this.promptService.input<string>("input", "Имя");
    const width = await this.promptService.input<number>("number", "Ширина");
    const height = await this.promptService.input<number>("number", "Высота");
    const path = await this.promptService.input<string>(
      "number",
      "Путь до файла"
    );
    return {
      name,
      width,
      height,
      path,
    };
  }
  protected build({
    name,
    width,
    height,
    path,
  }: IFfmpegInput): ICommandExecFfmpeg {
    const output = this.fileService.getFilePath(path, name, "mp4");
    const args = new FfmpegBuilder()
      .input(path)
      .setVideoSize(width, height)
      .output(output);
    return {
      command: "ffmpeg",
      args,
      output,
    };
  }
  protected spawn({
    command,
    args,
    output,
  }: ICommandExecFfmpeg): ChildProcessWithoutNullStreams {
    this.fileService.deleteFileIfExists(output);
    return spawn(command, args);
  }
  protected processStream(
    stream: ChildProcessWithoutNullStreams,
    logger: IStreamLogger
  ): void {
    const handler = new StreamHandler(logger);
    handler.processOutput(stream);
  }
}
