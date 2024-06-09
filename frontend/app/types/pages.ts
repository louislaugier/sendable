export type Page = {
    url: string,
    label: string,
    requiresAuth?: boolean,
    isInvisibleInNav?: boolean,
    description?: string,
    sublinks?: Page
};
