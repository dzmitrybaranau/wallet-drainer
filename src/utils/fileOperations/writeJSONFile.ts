import path from "path";
import fs from "fs";

export const writeJSONFile = (filePath: string, data: any) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data));
};
