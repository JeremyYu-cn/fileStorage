/**
 * 公共返回
 * @param code
 * @param msg
 * @param data
 */
export function CommonReturn(code: number, msg: string | string[], data: any) {
  return {
    code,
    msg,
    data,
  };
}
