type AmazonOrder = {
    name: string;
    url: string;
};
/**
 * Parse the html response for the amazon order history provider
 * Note: the classes may seem arbitrary,
 * but they are the only way to select the correct nodes
 */
export declare function parseResponse(html: string): AmazonOrder[];
export {};
