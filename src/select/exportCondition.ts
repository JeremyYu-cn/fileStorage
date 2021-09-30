import { conditionParam } from './condition';

// 大于
function gt({ key, value }: conditionParam) {
  return {
    key,
    value,
    type: 'gt',
  };
}

// 大于等于
function gte({ key, value }: conditionParam) {
  return {
    key,
    value,
    type: 'gte',
  };
}

// 小于
function lt({ key, value }: conditionParam) {
  return {
    key,
    value,
    type: 'lt',
  };
}

// 小于等于
function lte({ key, value }: conditionParam) {
  return {
    key,
    value,
    type: 'lte',
  };
}

// 或者
function or(data: conditionParam[]) {
  return {
    type: 'or',
    data,
  };
}

// 模糊查找
function like({ key, value }: conditionParam) {
  return {
    key,
    value,
    type: 'like',
  };
}

export { gt, gte, lt, lte, or, like };
