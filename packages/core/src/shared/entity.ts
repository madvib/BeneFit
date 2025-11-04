export abstract class Entity<T> {
  public readonly id: string;
  protected readonly props: T;

  constructor(props: T, id: string) {
    this.id = id;
    this.props = props;
  }

  public equals(entity?: Entity<T>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this.id === entity.id;
  }
}
