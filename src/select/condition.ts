export function selectCondition(
  data: Record<string, any>,
  condition: Record<string, any>
) {
  const keys = Object.keys(condition);

  return keys.every((val) => {
    const value = condition[val];
    switch (Object.prototype.toString.call(val)) {
      case '[object String]':
      case '[object Number]':
      case '[object Boolean]':
        return value === data[val];
      case '[object Object]':
        return handleConditionCompare(value, data);
      default:
        return true;
    }
  });
}

export type conditionParam = {
  key: string;
  value: RegExp | string;
};

type handleConditionParam = conditionParam & {
  type: 'gt' | 'gte' | 'lt' | 'lte' | 'or' | 'like';
  data?: conditionParam[];
};

// 条件匹配
function handleConditionCompare(
  { type, key, value, data: orData }: handleConditionParam,
  data: Record<string, any>
): boolean {
  if (!data[key]) return false;
  switch (type) {
    case 'gt':
      return data[key] > value;
    case 'lte':
      return data[key] >= value;
    case 'lt':
      return data[key] < value;
    case 'lte':
      return data[key] <= value;
    case 'like':
      return Object.getPrototypeOf(value).at
        ? new RegExp(value).test(data[key])
        : (<RegExp>value).test(data[key]);
    case 'or':
      return handleOrCondition(orData, data);
    default:
      return true;
  }
}

// 处理多条件只满足一个匹配
function handleOrCondition(
  condition: conditionParam[] = [],
  data: Record<string, any>
) {
  return condition.some(({ key, value }) => {
    if (!data[key]) return false;
    return Object.getPrototypeOf(value).at
      ? new RegExp(value).test(data[key])
      : (<RegExp>value).test(data[key]);
  });
}
