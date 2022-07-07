export default abstract class BaseCommand {
  public abstract readonly name: string;
  public abstract do(): Promise<void>;
  public abstract undo(): Promise<void>;
}
