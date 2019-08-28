/**
 * @description 二维举证的运算
 */

export default {
  // zrender里的matrix是3*2的矩阵，这里自动补充z轴的 0 0 1，基于 3 * 3的矩阵相乘，再取xy轴
  // 所以别纠结两个3*2的矩阵相乘问题，这里忽略了z轴，实际是类似补充了 0 0 1的3 * 3的矩阵相乘
  mul(a: Float32Array, b: Float32Array) {
    const result = new Float32Array(6);
    result[0] = a[0] * b[0] + a[1] * b[2];
    result[1] = a[0] * b[1] + a[1] * b[3];
    result[2] = a[2] * b[0] + a[3] * b[2];
    result[3] = a[2] * b[1] + a[3] * b[3];
    result[4] = a[4] * b[0] + a[5] * b[2] + b[4];
    result[5] = a[4] * b[1] + a[5] * b[3] + b[5];

    return result;
  },
};
