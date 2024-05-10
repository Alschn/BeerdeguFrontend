type Param = string | number | boolean | null | undefined;

export function stringifyParams(params: Record<string, Param | Array<Param>>) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.filter((v) => v !== null && v !== undefined).join(",");
    } else if (value !== null && value !== undefined) {
      acc[key] = value.toString();
    }
    return acc;
  }, {} as Record<string, string>);
}
