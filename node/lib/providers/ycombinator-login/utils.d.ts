type HasBookfaceNodeObjectType = {
    [key: string]: string | number | boolean | Object;
    hasBookface: boolean;
};
type UserInfoNodeObjectType = {
    [key: string]: string | number | boolean | Object;
    currentUser: {
        id: number;
        first_name: string;
        full_name: string;
    };
};
/**
 * Parse the html response for the ycombinator provider
 * Note: the classes may seem arbitrary,
 * but they are the only way to select the correct nodes
 */
export declare function parseResponse(html: string): {
    hasBookfaceObject: HasBookfaceNodeObjectType;
    userInfoObject: UserInfoNodeObjectType;
};
export {};
