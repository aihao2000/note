import * as UE from "ue";
import { PrintToScreen } from "../Global/GlobalFunction";
class TS_ALabActor extends UE.Actor {
    Constructor() {}
    ReceiveBeginPlay(): void {
        PrintToScreen("TS_ALabActor");
        this.EnableInput(UE.GameplayStatics.GetPlayerController(this.GetWorld(), 0));
    }
}
export default TS_ALabActor;
