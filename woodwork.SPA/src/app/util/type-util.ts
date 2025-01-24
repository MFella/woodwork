export class TypeUtil {
  static isKeyInUnknown<T extends string>(
    obj: unknown,
    ...keys: T[]
  ): obj is Record<T, any> {
    return typeof obj === 'object' && !!obj && keys.every(key => key in obj);
  }

  static hasDefinedNonNullProps<T extends { [P in keyof T]?: unknown }>(
    obj: T
  ): obj is T & { [P in keyof T]-?: Exclude<T[P], undefined | null> } {
    return Object.keys(obj).every(
      k =>
        obj[k as keyof typeof obj] !== undefined &&
        obj[k as keyof typeof obj] !== null
    );
  }

  // static hasDefinedNonNullProps<
  //   T extends { [P in K]?: unknown },
  //   K extends PropertyKey
  // >(
  //   obj: T,
  //   ...keys: K[]
  // ): obj is T & { [P in K]-?: Exclude<T[P], undefined | null> } {
  //   return keys.every(k => obj[k] !== undefined && obj[k] !== null);
  // }
}
