export type JSONIndex = {
    start: number;
    end: number;
};
export declare function extractHTMLElement(html: string, xPath: string, contentsOnly: boolean): string;
export declare function extractJSONValueIndex(json: string, jsonPath: string): {
    start: number;
    end: number;
};
