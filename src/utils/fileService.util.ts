import { IReadDirRecur } from '@itypes/util.types';
import { ObjectEncodingOptions, promises as fsp } from 'node:fs';
import { basename, join } from 'node:path';

export class FileService {
  public getFileName = (pathName: string, suffix: string) =>
    basename(pathName, suffix);

  public generatePath = (dirName: string, itemName: string) =>
    join(dirName, itemName);

  public readDir = async (dirName: string) =>
    fsp.readdir(dirName, { withFileTypes: true });

  public readDirRecur = async (
    dirName: string,
    fileName: string,
  ): Promise<IReadDirRecur[]> => {
    const data = await this.readDir(dirName);

    const paths = (
      await Promise.all(
        data.flatMap(async (item) => {
          const itemPath = this.generatePath(dirName, item.name);

          if (item.isDirectory()) {
            return this.readDirRecur(itemPath, fileName);
          }

          if (item.isFile() && item.name.includes(fileName)) {
            return {
              fileName: this.getFileName(item.name, fileName),
              fullName: item.name,
              filePath: itemPath,
            };
          }
          return [];
        }),
      )
    ).flat();
    return paths;
  };
}
