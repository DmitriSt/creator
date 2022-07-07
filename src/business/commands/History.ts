import BaseCommand from './BaseCommand';

class History {
  public commandsList: BaseCommand[] = [];
  public activeIndex = -1;

  public async add(command: BaseCommand): Promise<void> {
    if (this.activeIndex !== this.commandsList.length - 1) {
      this.commandsList.splice(this.activeIndex + 1);
      this.activeIndex = this.commandsList.length;
    } else {
      this.activeIndex += 1;
    }
    this.commandsList.push(command);
    console.log(this.commandsList.map((command) => command.name)); // for QA
    return command.do();
  }

  public async undo(): Promise<void> {
    const command = this.commandsList[this.activeIndex];
    this.activeIndex -= 1;
    return command.undo();
  }

  public async redo(): Promise<void> {
    this.activeIndex += 1;
    const command = this.commandsList[this.activeIndex];
    return command.do();
  }
}

const history = new History();

export default history;
