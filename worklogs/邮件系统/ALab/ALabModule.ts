import { blueprint } from "puerts";
import * as UE from "ue";
import { GetGlobalWorld, LogInfo, PrintToScreen, SpawnActorByClass } from "../Global/GlobalFunction";
import MixinSuperTemplate from "./MixinTemplate/MixinSuperTemplate";
class ALab_Module {
    constructor() {}
    readonly Main = (): void => {
        PrintToScreen("TS_ALabModule Mian() Run");
        //this.TestMixinSuper();

        // MixinSuperTemplate.Mixin("/Game/ALab/TestMixin/MixinBase.MixinBase_C");
        // SpawnActorByClass(GetGlobalWorld(), MixinSuperTemplate.GetDerivedStaticClass(), new UE.Vector(0, 0, 0), new UE.Rotator(0, 0, 0));
    };
}
export default new ALab_Module();
