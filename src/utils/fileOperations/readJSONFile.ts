import fs from "fs";
import {writeJSONFile} from "@utils/fileOperations/index";

export const readJSONFile = (filePath: string, defaultValue: any) => {
    if (!fs.existsSync(filePath)) {
        writeJSONFile(filePath, defaultValue);
    }
    const rawData = fs.readFileSync(filePath);

    try {
        return JSON.parse(rawData.toString());
    } catch (e) {
        console.log(`Error parsing JSON from ${filePath}`, e);
        return defaultValue;
    }
};
