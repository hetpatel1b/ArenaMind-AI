/**
 * Generic class for Value Objects.
 * Value objects are immutable and distinguished by their structural properties, not identity.
 */
export abstract class ValueObject<T extends Record<string, unknown>> {
  public readonly props: Readonly<T>;

  constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Compares two value objects for structural equality.
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
