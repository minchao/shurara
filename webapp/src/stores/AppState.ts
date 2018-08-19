import {action, observable} from "mobx";

const hasWindow = typeof window !== "undefined";

export interface IAppStateProps {
  timer: number;
}

/*
* This is the entry point for the app's state. All stores should go here.
*/
class AppState implements IAppStateProps {
  @observable public timer = 0;
  @observable public message = "";

  private intervalId: any;

  constructor() {
    if (hasWindow) {
      this.intervalId = setInterval(this.incrementTimer, 1000);
    }
  }

  @action public incrementTimer = () => {
    this.timer += 1;
  }

  @action public setMessage(message: string) {
    this.message = message;
  }

  @action public resetTimer() {
    this.timer = 0;
  }

  public reload(store: IAppStateProps) {
    Object.assign(this, store);
    return this;
  }

  public unload() {
    clearInterval(this.intervalId);
  }
}

export default AppState;
