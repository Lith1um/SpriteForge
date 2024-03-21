export const enumValues = (obj: object) => Object.values(obj).filter(item => isNaN(Number(item)));

export const enumKeys = (obj: object) => Object.keys(obj).filter(item => isNaN(Number(item)));
